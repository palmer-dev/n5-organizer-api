import AbstractManager from "@/models/AbstractManager";
import Agenda from "@/schemas/Agenda";
import {AgendaDocument} from "@/types/AgendaDocument";
import {Types} from "mongoose";
import {AppointmentDocument} from "@/types/AppointmentDocument";
import Appointment from "@schemas/Appointment";
import AppointmentStatusType from "@/types/AppointmentStatusType";
import {applyAggregateTransforms} from "@lib/aggregateTransformer";
import {AgendaStats} from "@/types/AgendaStats";

class AgendaManager extends AbstractManager<AgendaDocument> {
    constructor(userId?: Types.ObjectId) {
        super(Agenda, userId);
    }

    async findAll(): Promise<AgendaDocument[]> {
        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const agendas = await this.model
            .aggregate([
                // Filtre utilisateur / permissions
                {
                    $match: this.userFilter(),
                },
                {
                    $lookup: {
                        from: "appointments",
                        localField: "_id",
                        foreignField: "agendas.agenda",
                        as: "appointments",
                    },
                },
                {
                    $unwind: {path: "$appointments", preserveNullAndEmptyArrays: true},
                },
                {
                    $addFields: {
                        isThisWeek: {
                            $and: [
                                {$gte: ["$appointments.startDate", startOfWeek]},
                                {$lt: ["$appointments.startDate", endOfWeek]},
                            ],
                        },
                        isWaitingValidation: {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: {$ifNull: ["$appointments.agendas", []]},
                                            as: "agendaItem",
                                            cond: {
                                                $and: [
                                                    {$eq: ["$$agendaItem.agenda", "$_id"]},
                                                    {$eq: ["$$agendaItem.status", "Pending"]},
                                                ],
                                            },
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        name: {$first: "$name"},
                        user: {$first: "$user"},
                        appointmentsThisWeek: {$sum: {$cond: ["$isThisWeek", 1, 0]}},
                        waitingValidation: {
                            $sum: {$cond: ["$isWaitingValidation", 1, 0]},
                        },
                    },
                },
                {
                    $project: {
                        name: 1,
                        user: 1,
                        stats: {
                            appointmentsThisWeek: "$appointmentsThisWeek",
                            waitingValidation: "$waitingValidation",
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}},
            ])
            .exec();

        return agendas.map((r) => applyAggregateTransforms<AgendaDocument>(r));
    }

    async stats(): Promise<AgendaStats> {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        if (!this.userId) {
            return {
                mainCalendars: 0,
                appointmentsThisWeek: 0,
                waitingValidation: 0,
                activeCollaborators: 0,
            };
        }
        const calendar = await this.findByUser(this.userId);

        const stats = await this.model
            .aggregate([
                {$match: this.userFilter()},
                // { $match: { main: true } },
                {
                    $group: {
                        _id: null,
                        mainCalendars: {$sum: 1},
                    },
                },
                {
                    $lookup: {
                        from: "appointments",
                        pipeline: [
                            {
                                $group: {
                                    _id: null,
                                    appointmentsThisWeek: {
                                        $sum: {
                                            $cond: [
                                                {
                                                    $and: [
                                                        {$gte: ["$startDate", startOfWeek]},
                                                        {$lt: ["$startDate", endOfWeek]},
                                                    ],
                                                },
                                                1,
                                                0,
                                            ],
                                        },
                                    },
                                    waitingValidation: {
                                        $sum: {
                                            $size: {
                                                $filter: {
                                                    input: {$ifNull: ["$agendas", []]},
                                                    as: "agendaItem",
                                                    cond: {
                                                        $and: [
                                                            {
                                                                $eq: [
                                                                    "$$agendaItem.agenda",
                                                                    new Types.ObjectId(calendar!.id as string),
                                                                ],
                                                            },
                                                            {
                                                                $eq: [
                                                                    "$$agendaItem.status",
                                                                    AppointmentStatusType.Pending.toString(),
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    activeCollaboratorsSet: {
                                        $addToSet: {
                                            $cond: [
                                                {
                                                    $and: [
                                                        {$gte: ["$startDate", startOfWeek]},
                                                        {$lt: ["$startDate", endOfWeek]},
                                                    ],
                                                },
                                                "$user",
                                                "$$REMOVE",
                                            ],
                                        },
                                    },
                                },
                            },
                            {
                                $project: {
                                    appointmentsThisWeek: 1,
                                    waitingValidation: 1,
                                    activeCollaborators: {
                                        $size: "$activeCollaboratorsSet",
                                    },
                                },
                            },
                        ],
                        as: "appointmentStats",
                    },
                },
                {
                    $addFields: {
                        appointmentStats: {
                            $ifNull: [{$arrayElemAt: ["$appointmentStats", 0]}, {}],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        mainCalendars: 1,
                        appointmentsThisWeek: {
                            $ifNull: ["$appointmentStats.appointmentsThisWeek", 0],
                        },
                        waitingValidation: {
                            $ifNull: ["$appointmentStats.waitingValidation", 0],
                        },
                        activeCollaborators: {
                            $ifNull: ["$appointmentStats.activeCollaborators", 0],
                        },
                    },
                },
            ])
            .exec();

        return stats as unknown as AgendaStats;
    }

    // eslint-disable-next-line class-methods-use-this
    appointments(id: string): Promise<AppointmentDocument[] | null> {
        return Appointment.find({
            "agendas.agenda": new Types.ObjectId(id),
        }).exec();
    }

    // eslint-disable-next-line class-methods-use-this
    findByUser(id: string | Types.ObjectId): Promise<AgendaDocument | null> {
        return this.model.findOne({user: id, main: true}).exec();
    }

    async findForUsers(
        ids: (Types.ObjectId | string)[]
    ): Promise<AgendaDocument[]> {
        const results = await Promise.all(ids.map((id) => this.findByUser(id)));

        // on filtre les null (au cas où un user n’a pas d’agenda principal)
        return results.filter(
            (agenda): agenda is AgendaDocument => agenda !== null
        );
    }
}

export default AgendaManager;
