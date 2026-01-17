import { model as Model } from "mongoose";
import SchemaExtended from "@models/SchemaExtended.js";
import { ExternalAgendaDocument } from "@/types/ExternalAgendaDocument";

const schema = new SchemaExtended<ExternalAgendaDocument>(
  {
    url: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      default: "Europe/Paris",
    },
    password: {
      type: String,
      required: true,
    },
    agenda: {
      type: SchemaExtended.Types.ObjectId,
      ref: "Agenda",
    },
  },
  {
    timestamps: true,
  }
);

const model = Model<ExternalAgendaDocument>("ExternalAgenda", schema);

export default model;
