import { TimestampedDocument } from "@/types/TimestampedDocument";
import { Types } from "mongoose";

export interface OwnedDocument extends TimestampedDocument {
  createdBy?: Types.ObjectId;
}
