import { Types } from "mongoose";
import { OwnedDocument } from "@/types/OwnedDocument";

export interface IWorkSchedule {
  timezone: string;
  startTime: Date;
  endTime: Date;
  user?: Types.ObjectId;
}

export interface WorkScheduleDocument extends OwnedDocument, IWorkSchedule {}
