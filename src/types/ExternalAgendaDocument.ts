import { Types } from "mongoose";
import { TimestampedDocument } from "@/types/TimestampedDocument";
import { OwnedDocument } from "@/types/OwnedDocument";

export interface IExternalAgenda {
  url: string;
  username: string;
  password: string;
  agenda?: Types.ObjectId;
}

export interface ExternalAgendaDocument
  extends OwnedDocument,
    IExternalAgenda {}
