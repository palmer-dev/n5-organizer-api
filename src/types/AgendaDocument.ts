import { Types } from "mongoose";
import AgendaType from "@/types/AgendaType";
import { TimestampedDocument } from "@/types/TimestampedDocument";

export interface IAgenda {
  name: string;
  type: AgendaType;
  user?: Types.ObjectId;
}

export interface AgendaDocument extends TimestampedDocument, IAgenda {}
