import { model as Model, Types } from "mongoose";
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
      type: Types.ObjectId,
      ref: "User",
    },
    main: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// eslint-disable-next-line func-names
schema.pre("find", function () {
  this.populate({ path: "user", select: "-password" });
});

const model = Model<AgendaDocument>("Agenda", schema);

export default model;
