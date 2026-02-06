
import { config } from "dotenv";
import mongoose, { Types } from "mongoose";
import UserManager from "@/models/UserManager";
import AppointmentManager from "@/models/AppointmentManager";
import AgendaManager from "@/models/AgendaManager";
import WorkScheduleManager from "@/models/WorkScheduleManager";
import ExternalAgendManager from "@/models/ExternalAgendaManager";
import { Models } from "@/types/Models";

config();
// create a connection pool to the database

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// try a connection

mongoose.connect(
  `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
);

// declare and fill models: that's where you should register your own managers

const models: Models = {
  user: new UserManager(),
  appointment: new AppointmentManager(),
  agenda: new AgendaManager(),
  workSchedule: new WorkScheduleManager(),
  externalAgenda: new ExternalAgendManager(),
};

const handler = {
  get(obj: Models, prop: keyof Models) {
    if (prop in obj) {
      return obj[prop];
    }

    const pascalize = (string: string) =>
      string.slice(0, 1).toUpperCase() + string.slice(1);

    throw new ReferenceError(
      `models.${prop} is not defined. Did you create ${pascalize(
        prop
      )}Manager.js, and did you register it in backend/src/models/index.js?`
    );
  },
};

function forUser(userId: Types.ObjectId) {
  const userModels = {
    appointment: new AppointmentManager(userId),
    agenda: new AgendaManager(userId),
    workSchedule: new WorkScheduleManager(userId),
    externalAgenda: new ExternalAgendManager(userId),
  };

  return new Proxy(userModels, handler);
}

export default {
  ...new Proxy(models, handler),
  forUser,
};
