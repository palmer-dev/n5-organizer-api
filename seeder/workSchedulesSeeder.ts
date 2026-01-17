import { faker } from "@faker-js/faker";
import WorkScheduleManager from "@models/WorkScheduleManager";
import { IWorkSchedule } from "@/types/WorkScheduleDocument";
import UserManager from "@models/UserManager";

async function seed() {
  const DATA: IWorkSchedule[] = [];

  const userManager = new UserManager();
  const users = await userManager.findAll();

  const manager = new WorkScheduleManager();

  users.forEach((user) => {
    const startTime = faker.date.soon({ days: 30 }); // dans les 30 prochains jours
    const durationMinutes = faker.number.int({ min: 30, max: 180 }); // 30 min à 3h
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    DATA.push({
      timezone: user.timezone,
      user: user.id,
      startTime,
      endTime,
    });
  });

  const createPromises = DATA.map((data) => manager.create(data));
  return Promise.all(createPromises);
}

async function clear() {
  const manager = new WorkScheduleManager();
  const datas = await manager.findAll();

  const deletePromises = datas.map((data) => manager.delete(data.id));
  return Promise.all(deletePromises);
}

export default { seed, clear };
