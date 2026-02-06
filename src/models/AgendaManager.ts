import AbstractManager from "@/models/AbstractManager";
import Agenda from "@/schemas/Agenda";
import { AgendaDocument } from "@/types/AgendaDocument";
import { Types } from "mongoose";
import { AppointmentDocument } from "@/types/AppointmentDocument";
import Appointment from "@schemas/Appointment";
import AppointmentStatusType from "@/types/AppointmentStatusType";
import { applyAggregateTransforms } from "@lib/aggregateTransformer";
import { AgendaStats } from "@/types/AgendaStats";

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
        // Récupération des appointments liés
        {
          $lookup: {
            from: "appointments",
            localField: "_id",
            foreignField: "agendas.agenda",
            as: "appointments",
          },
        },
        // Calcul des stats
        {
          $addFields: {
            stats: {
              appointmentsThisWeek: {
                $size: {
                  $filter: {
                    input: "$appointments",
                    as: "a",
                    cond: {
                      $and: [
                        { $gte: ["$$a.startDate", startOfWeek] },
                        { $lt: ["$$a.startDate", endOfWeek] },
                      ],
                    },
                  },
                },
              },
              waitingValidation: {
                $size: {
                  $filter: {
                    input: "$appointments",
                    as: "a",
                    cond: {
                      $eq: [
                        "$$a.status",
                        AppointmentStatusType.Pending.toString(),
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        // Nettoyage (on enlève la liste brute des RDV)
        {
          $project: {
            appointments: 0,
          },
        },
        // Ajout du lien "user"
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        // Déplier le tableau pour avoir directement l'objet
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true, // optionnel si certains agendas n'ont pas d'utilisateur
          },
        },
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

    const stats = await this.model
      .aggregate([
        { $match: this.userFilter() },
        { $match: { main: true } },
        {
          $group: {
            _id: null,
            mainCalendars: { $sum: 1 },
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
                            { $gte: ["$startDate", startOfWeek] },
                            { $lt: ["$startDate", endOfWeek] },
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                  waitingValidation: {
                    $sum: {
                      $cond: [
                        {
                          $eq: [
                            "$status",
                            AppointmentStatusType.Pending.toString(),
                          ],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                  activeCollaboratorsSet: {
                    $addToSet: {
                      $cond: [
                        {
                          $and: [
                            { $gte: ["$startDate", startOfWeek] },
                            { $lt: ["$startDate", endOfWeek] },
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
              $ifNull: [{ $arrayElemAt: ["$appointmentStats", 0] }, {}],
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
    return this.model.findOne({ user: id, main: true }).exec();
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
