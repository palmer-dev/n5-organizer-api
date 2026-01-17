import { faker } from "@faker-js/faker";
import { IAgenda } from "@/types/AgendaDocument";
import AgendaManager from "@/models/AgendaManager";
import UserManager from "@/models/UserManager";
import AgendaType from "@/types/AgendaType";

async function seed() {
  const DATA: IAgenda[] = [];

  const userManager = new UserManager();
  const users = await userManager.findAll();

  const manager = new AgendaManager();
  const nbEntity = Math.random() * 10 + 2;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nbEntity; i++) {
    const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
    if (user)
      DATA.push({
        name: faker.word.adverb(),
        type: AgendaType.Intern,
        user: user.id,
      });
  }

  const createPromises = DATA.map((data) => manager.create(data));
  return Promise.all(createPromises);
}

async function clear() {
  const manager = new AgendaManager();
  const datas = await manager.findAll();

  const deletePromises = datas.map((data) => manager.delete(data.id));
  return Promise.all(deletePromises);
}

export default { seed, clear };
