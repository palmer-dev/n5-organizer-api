import AbstractManager from "@models/AbstractManager";
import Appointment from "@schemas/Appointment.js";
import {
    AppointmentAvailabilitySearch,
    AppointmentDocument,
} from "@/types/AppointmentDocument";
import {PipelineStage, Types} from "mongoose";
import AppointmentStatusType from "@/types/AppointmentStatusType";

class AppointmentManager extends AbstractManager<AppointmentDocument> {
    constructor(userId?: Types.ObjectId) {
        super(Appointment, userId);
    }

    search({
               startDate,
               endDate,
               users,
               ignoreId,
           }: AppointmentAvailabilitySearch): Promise<AppointmentDocument[]> {
        const matchStage: PipelineStage.Match["$match"] = {
            startDate: {$lte: endDate},
            endDate: {$gte: startDate},
        };

        // Ignore specific appointment
        if (ignoreId) {
            // eslint-disable-next-line no-underscore-dangle
            matchStage._id = {$ne: new Types.ObjectId(ignoreId)};
        }

        const usersId = [...users.map((user) => new Types.ObjectId(user)), this.userId!];

        const searchAggregation: PipelineStage[] = [
            {
                $match: matchStage,
            },
            {
                $addFields: {
                    agendaIds: {
                        $map: {
                            input: "$agendas",
                            as: "a",
                            in: {
                                $cond: [
                                    {$eq: [{$type: "$$a"}, "objectId"]},
                                    "$$a", // ancien format
                                    "$$a.agenda", // nouveau format
                                ],
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "agendas",
                    localField: "agendaIds",
                    foreignField: "_id",
                    as: "agendas",
                },
            },
            {
                $match: {
                    agendas: {
                        $elemMatch: {
                            user: {
                                $in: usersId,
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    agendaIds: 0,
                },
            },
        ];
        return this.model.aggregate(searchAggregation).exec();
    }

    updateAgendaStatus(
        appointmentId: string,
        agendaId: string,
        status: AppointmentStatusType
    ): Promise<AppointmentDocument | null> {
        return this.model
            .findByIdAndUpdate(
                appointmentId,
                {
                    $set: {
                        "agendas.$[a].status": status,
                    },
                },
                {
                    new: true,
                    arrayFilters: [{"a.agenda": agendaId}],
                }
            )
            .exec();
    }
}

export default AppointmentManager;
