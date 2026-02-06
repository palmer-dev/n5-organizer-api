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
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    agendas: [
      {
        agenda: {
          type: SchemaExtended.Types.ObjectId,
          ref: "Agenda",
          required: true,
        },
        status: {
          type: String,
          enum: AppointmentStatusType.values(),
          default: AppointmentStatusType.Pending.toString(),
        },
      },
    ],
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

schema.virtual("users").get(function () {
  if (!this.agendas) return [];

  return (this.agendas as unknown as AgendaPopulated[])
    .map((agenda) => {
      if (agenda instanceof Types.ObjectId) {
        return undefined;
      }

      if (
        typeof agenda === "object" &&
        "agenda" in agenda &&
        agenda.agenda &&
        typeof agenda.agenda === "object" &&
        "user" in agenda.agenda
      ) {
        return agenda.agenda.user;
      }

      return undefined;
    })
    .filter((u): u is Types.ObjectId => Boolean(u));
});

// eslint-disable-next-line func-names
schema.pre("find", function () {
  this.populate("agendas.agenda agendas");
});

const model = Model<AppointmentDocument>("Appointment", schema);

export default model;
