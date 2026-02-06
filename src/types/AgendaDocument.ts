import { Types } from "mongoose";
import AgendaType from "@/types/AgendaType";
import { OwnedDocument } from "@/types/OwnedDocument";

export interface IAgenda {
  name: string;
  type: AgendaType;
  user?: Types.ObjectId;
  main: boolean;
}

export interface AgendaDocument extends OwnedDocument, IAgenda {}
