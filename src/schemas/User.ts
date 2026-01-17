import { model as Model } from "mongoose";
import SchemaExtended from "@/models/SchemaExtended.js";
import { UserDocument } from "@/types/UserDocument";

const schema = new SchemaExtended<UserDocument>(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
      default: "Europe/Paris",
    },
  },
  {
    timestamps: true,
  }
);

const model = Model<UserDocument>("User", schema);

export default model;
