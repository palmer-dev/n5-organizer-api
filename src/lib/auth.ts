import {betterAuth} from "better-auth";
import {mongodbAdapter} from "better-auth/adapters/mongodb";
import {MongoClient} from "mongodb";
import {config} from "dotenv";
import {username} from "better-auth/plugins";
import models from "@/models";
import {Types} from "mongoose";

config();

const {DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME} = process.env;

const client = new MongoClient(
    `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
);

const db = client.db();

const auth = betterAuth({
    database: mongodbAdapter(db, {
        transaction: false,
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [username()],
    user: {
        modelName: "users",
        additionalFields: {
            firstname: {
                type: "string",
                required: true,
            },
            lastname: {
                type: "string",
                required: true,
            },
            timezone: {
                type: "string",
                required: false,
                defaultValue: "Europe/Paris",
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                async after(user) {
                    // Create a default agenda
                    const userId = new Types.ObjectId(user.id.toString());
                    await models.forUser(userId)
                        .agenda
                        .create({
                            user: userId,
                            name: "Default agenda",
                            main: true
                        })
                },
            },
        },
    }
});

export type Session = typeof auth.$Infer.Session;
export type SessionUser = typeof auth.$Infer.Session.user;

export default auth;
