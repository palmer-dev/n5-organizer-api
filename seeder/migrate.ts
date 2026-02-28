import {config} from "dotenv";
import mongoose from "mongoose";
import appointmentSeeder from "./appointmentSeeder";
import userSeeder from "./userSeeder";
import agendaSeeder from "./agendaSeeder";
import workSchedulesSeeder from "./workSchedulesSeeder";

config();
// declare and fill models: that's where you should register your own managers

const connect = () => {
    const {DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME} = process.env;

    return mongoose.connect(
        `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
    );
};

const clear = async () => {
    await userSeeder.clear();
    await workSchedulesSeeder.clear();
    await agendaSeeder.clear();
    await appointmentSeeder.clear();
};

const migrate = async () => {
    console.info(`Migrate users...`);
    await userSeeder.seed();

    console.info(`Migrate agenda...`);
    await agendaSeeder.seed();

    console.info(`Migrate appointments...`);
    await appointmentSeeder.seed();

    console.info(`Migrate work schedules...`);
    await workSchedulesSeeder.seed();
};

(async () => {
    try {
        console.info(`Connect to database...`);
        await connect();
        console.info(`Clearing database...`);
        await clear();
        console.info(`Migrate database...`);
        await migrate();
        console.info(`Database migrated`);
    } catch (err) {
        console.error(err);
    }
})();
