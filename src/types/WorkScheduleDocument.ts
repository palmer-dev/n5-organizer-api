import { Types } from "mongoose";
import { TimestampedDocument } from "@/types/TimestampedDocument";

export interface IWorkSchedule {
  timezone: string;
  startTime: Date;
  endTime: Date;
  user?: Types.ObjectId;
}

export interface WorkScheduleDocument
  extends TimestampedDocument,
    IWorkSchedule {}
