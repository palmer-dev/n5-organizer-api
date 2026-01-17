import { Types } from "mongoose";
import { TimestampedDocument } from "@/types/TimestampedDocument";

export interface IExternalAgenda {
  url: string;
  username: string;
  password: string;
  agenda?: Types.ObjectId;
}

export interface ExternalAgendaDocument
  extends TimestampedDocument,
    IExternalAgenda {}
