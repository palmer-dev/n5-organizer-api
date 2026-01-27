import { model as Model } from "mongoose";
import { SchemaExtended } from "@/models/SchemaExtended.js";
import { WorkScheduleDocument } from "@/types/WorkScheduleDocument";

const schema = new SchemaExtended<WorkScheduleDocument>(
  {
    timezone: {
      type: String,
      required: true,
      default: "Europe/Paris",
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    user: {
      type: SchemaExtended.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const model = Model<WorkScheduleDocument>("WorkSchedule", schema);

export default model;
