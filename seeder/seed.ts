import {config} from "dotenv";
import mongoose from "mongoose";
import appointmentSeeder from "./appointmentSeeder";
import userSeeder from "./userSeeder";
import agendaSeeder from "./agendaSeeder";
import workSchedulesSeeder from "./workSchedulesSeeder";
import {UserDocument} from "@/types/UserDocument";

const envFile = process.env.NODE_ENV === "seed" ? ".env.seed" : ".env";

config({path: envFile});
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

const seed = async () => {
    console.info(`Migrate users...`);
    const users = await userSeeder.seed();

    // On migre tous les utilisateurs en parallèle
    await Promise.all(
        users.map(async (userSession) => {
            const user = userSession.user as unknown as UserDocument;
            const prefixUser = `[User: ${user.email}]`;

            try {
                console.info(`${prefixUser} Migrate agenda...`);
                const agendas = await agendaSeeder.seed(user);

                // Pour chaque agenda, on peut traiter appointments et work schedules en parallèle
                await Promise.all(
                    agendas.map(async (agenda) => {
                        const prefixAgenda = `${prefixUser} [Agenda: ${agenda.name}]`;

                        console.info(`${prefixAgenda} Migrate appointments...`);
                        await appointmentSeeder.seed(user, agenda);
                    })
                );

                console.info(`${prefixUser} Migrate work schedules...`);
                await workSchedulesSeeder.seed(user);

                console.info(`${prefixUser} Migration complete`);
            } catch (err) {
                console.error(`${prefixUser} Error:`, err);
            }
        })
    );
};

(async () => {
    try {
        console.info(`Connect to database...`);
        await connect();
        console.info(`Clearing database...`);
        await clear();
        console.info(`Migrate database...`);
        await seed();
        console.info(`Database migrated`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
