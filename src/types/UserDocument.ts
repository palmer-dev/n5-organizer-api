import { TimestampedDocument } from "@/types/TimestampedDocument";

export interface IUser {
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  timezone: string;
}

export interface UserDocument extends TimestampedDocument, IUser {}
