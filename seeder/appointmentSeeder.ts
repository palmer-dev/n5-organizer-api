import { faker } from "@faker-js/faker";
import { IAppointmentDocument } from "@/types/AppointmentDocument";
import AppointmentManager from "../src/models/AppointmentManager";
import AgendaManager from "../src/models/AgendaManager";
import AppointmentStatusType from "../src/types/AppointmentStatusType";

async function seed() {
  const DATA: IAppointmentDocument[] = [];

  const agendaManager = new AgendaManager();
  const agendas = await agendaManager.findAll();

  const manager = new AppointmentManager();
  const nbEntity = Math.random() * 100 + 2;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < nbEntity; i++) {
    const startDate = faker.date.soon({ days: 30 }); // dans les 30 prochains jours
    const durationMinutes = faker.number.int({ min: 30, max: 180 }); // 30 min à 3h
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    const toLink = [];
    // eslint-disable-next-line no-shadow,no-plusplus
    for (let i = 0; i < Math.random() * 2 + 1; i++) {
      const numberOfEntity = agendas.length;
      const index = faker.number.int({ min: 0, max: numberOfEntity - 1 });
      toLink.push(agendas[index].id);
    }

    DATA.push({
      name: faker.word.words(1),
      notes: faker.lorem.lines(2),
      startDate,
      endDate,
      status: AppointmentStatusType.Validated,
      agendas: toLink,
    });
  }

  const createPromises = DATA.map((data) => manager.create(data));
  return Promise.all(createPromises);
}

async function clear() {
  const manager = new AppointmentManager();
  const datas = await manager.findAll();

  const deletePromises = datas.map((data) => manager.delete(data.id));
  return Promise.all(deletePromises);
}

export default { seed, clear };
