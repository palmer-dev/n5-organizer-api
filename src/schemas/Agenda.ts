import { model as Model } from "mongoose";
import { SchemaExtended } from "@models/SchemaExtended";
import AgendaType from "@/types/AgendaType";
import { AgendaDocument } from "@/types/AgendaDocument";

const schema = new SchemaExtended<AgendaDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: AgendaType.keys(),
      default: AgendaType.Intern,
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

const model = Model<AgendaDocument>("Agenda", schema);

export default model;
