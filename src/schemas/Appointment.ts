import { model as Model } from "mongoose";
import SchemaExtended from "@models/SchemaExtended.js";
import AppointmentStatusType from "@/types/AppointmentStatusType.js";
import { AppointmentDocument } from "@/types/AppointmentDocument";

const schema = new SchemaExtended<AppointmentDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: AppointmentStatusType.keys(),
      default: AppointmentStatusType.Pending,
    },
    agendas: [
      {
        type: SchemaExtended.Types.ObjectId,
        ref: "Agenda",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const model = Model<AppointmentDocument>("Appointment", schema);

export default model;
