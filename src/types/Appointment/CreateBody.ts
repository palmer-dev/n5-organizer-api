import { Types } from "mongoose";

export interface AppointmentCreateBody {
  name: string;
  notes: string;
  startDate: Date;
  endDate: Date;
  users: Types.ObjectId[];
}
