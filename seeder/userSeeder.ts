import { faker } from "@faker-js/faker";
import type { IUser } from "@/types/UserDocument";
import UserManager from "../src/models/UserManager";

async function seed() {
  const DATA: IUser[] = [];

  const manager = new UserManager();
  const nbEntity = Math.random() * 10 + 2;

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

  const createPromises = DATA.map((user) => manager.create(user));
  return Promise.all(createPromises);
}

async function clear() {
  const manager = new UserManager();
  const users = await manager.findAll();

  const deletePromises = users.map((user) => manager.delete(user.id));
  return Promise.all(deletePromises);
}

export default { seed, clear };
