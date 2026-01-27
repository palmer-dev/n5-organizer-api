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
    ignoreId,
  }: AppointmentAvailabilitySearch): Promise<AppointmentDocument[]> {
    const matchStage: PipelineStage.Match["$match"] = {
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    };

    // Ignore specific appointment
    if (ignoreId) {
      // eslint-disable-next-line no-underscore-dangle
      matchStage._id = { $ne: new Types.ObjectId(ignoreId) };
    }

    const searchAggregation: PipelineStage[] = [
      {
        $match: matchStage,
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
        $match: {
          agendas: {
            $elemMatch: {
              user: {
                $in: users.map((u) => new Types.ObjectId(u)),
              },
            },
          },
        },
      },
    ];

    return this.model.aggregate(searchAggregation).exec();
  }
}

export default AppointmentManager;
