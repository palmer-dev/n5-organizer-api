import {faker} from "@faker-js/faker";
import type {IUser} from "@/types/UserDocument";
import UserManager from "@/models/UserManager";
import auth from "@lib/auth";

async function seed() {
    const DATA: IUser[] = [];

    DATA.push({
        name: "REY Florian",
        firstname: "Florian",
        lastname: "REY",
        email: "florian.rey@next-u.fr",
        password: "P@ssword12345",
        timezone: faker.location.timeZone(),
    });

    const manager = new UserManager();
    const nbEntity = faker.number.int({min: 2, max: 10});

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < nbEntity; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        DATA.push({
            name: `${firstName} ${lastName}`,
            firstname: firstName,
            lastname: lastName,
            email: faker.internet.email(),
            password: faker.internet.password(),
            timezone: faker.location.timeZone(),
        });
    }

    const createPromises = DATA.map((user) => auth.api.signUpEmail({"body": user}));
    const test = await Promise.all(createPromises);

    console.log("ICI", test);
    return test;
}

async function clear() {
    const manager = new UserManager();
    const users = await manager.findAll();

    const deletePromises = users.map((user) => manager.delete(user.id));
    return Promise.all(deletePromises);
}

export default {seed, clear};
