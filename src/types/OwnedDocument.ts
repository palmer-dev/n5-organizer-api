import {TimestampedDocument} from "@/types/TimestampedDocument";
import {Schema} from "mongoose";

export interface OwnedDocument extends TimestampedDocument {
    createdBy?: Schema.Types.ObjectId;
}
