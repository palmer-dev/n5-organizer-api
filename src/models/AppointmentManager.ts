import AbstractManager from "@models/AbstractManager";
import Appointment from "@schemas/Appointment.js";
import {
  AppointmentAvailabilitySearch,
  AppointmentDocument,
} from "@/types/AppointmentDocument";
import { PipelineStage, Types } from "mongoose";

class AppointmentManager extends AbstractManager<AppointmentDocument> {
  constructor(userId?: Types.ObjectId) {
    super(Appointment, userId);
  }

  search({
    startDate,
    endDate,
    users,
  }: AppointmentAvailabilitySearch): Promise<AppointmentDocument[]> {
    const searchAggregation: PipelineStage[] = [
      {
        $match:
          /**
           * query: The query in MQL.
           */
          {
            startDate: { $lte: endDate },
            endDate: { $gte: startDate },
          },
      },
      {
        $lookup: {
          from: "agendas",
          localField: "agendas",
          foreignField: "_id",
          as: "agendas",
        },
      },
      {
        $match:
          /**
           * query: The query in MQL.
           */
          {
            agendas: {
              $elemMatch: {
                user: {
                  $in: users.map(u => new Types.ObjectId(u)),
                },
              },
            },
          },
      },
    ];

    console.log(searchAggregation);

    return this.model.aggregate(searchAggregation).exec();
  }
}

export default AppointmentManager;
