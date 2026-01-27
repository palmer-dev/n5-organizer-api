import { model as Model, Types } from "mongoose";
import { SchemaExtended } from "@models/SchemaExtended.js";
import AppointmentStatusType from "@/types/AppointmentStatusType.js";
import { AppointmentDocument } from "@/types/AppointmentDocument";
import { AgendaDocument } from "@/types/AgendaDocument";

type AgendaPopulated = AgendaDocument | Types.ObjectId;

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

// eslint-disable-next-line func-names
schema.virtual("users").get(function () {
  if (!this.agendas) return [];

  return (this.agendas as AgendaPopulated[])
    .map((agenda) => {
      if (typeof agenda === "object" && "user" in agenda) {
        return agenda.user;
      }
      return undefined;
    })
    .filter((u): u is Types.ObjectId => Boolean(u));
});

// eslint-disable-next-line func-names
schema.pre("find", function () {
  this.populate({ path: "agendas", select: "user" });
});

const model = Model<AppointmentDocument>("Appointment", schema);

export default model;
