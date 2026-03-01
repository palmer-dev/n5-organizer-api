import {faker} from "@faker-js/faker";
import AppointmentManager from "@/models/AppointmentManager";
import AppointmentStatusType from "@/types/AppointmentStatusType";
import {AgendaDocument} from "@/types/AgendaDocument";
import Agenda from "@schemas/Agenda";
import {Types} from "mongoose";
import {UserDocument} from "@/types/UserDocument";


async function getRandomAgendas(nb: number, ignoreId: string | Types.ObjectId) {
    return Agenda.aggregate([
        {
            $match: {user: {$ne: new Types.ObjectId(ignoreId)}}
        },
        {$sample: {size: nb}}
    ]);
}

function randomStartDateWithinWorkHours(daysAhead = 30) {
    // Choisit un jour dans les X prochains jours
    const date = faker.date.soon({days: daysAhead});

    // Définir heure aléatoire entre 8h et 17h30
    const hour = faker.number.int({min: 8, max: 17});
    const minute = faker.helpers.arrayElement([0, 15, 30, 45]);

    date.setHours(hour, minute, 0, 0);
    return date;
}

async function seed(user: UserDocument, agenda: AgendaDocument) {
    const nbAgendasToLink = faker.number.int({min: 1, max: 2});

    // récupère des agendas aléatoires en excluant l'agenda actuel
    const otherAgendas = await getRandomAgendas(nbAgendasToLink, user.id);

    const agendasToLink = otherAgendas.map(a => ({
        agenda: a._id,
        status: faker.helpers.arrayElement(AppointmentStatusType.cases())
    }));

    agendasToLink.push({agenda: agenda._id, status: faker.helpers.arrayElement(AppointmentStatusType.cases())});

    const appointmentManager = new AppointmentManager(user.id);

    const nbEntity = faker.number.int({min: 1, max: 3});

    const createPromises = Array.from({length: nbEntity}).map(async () => {
        const possibleDurations = [60, 90, 120, 150]; // 1h, 1h30, 2h, 2h30
        const startDate = randomStartDateWithinWorkHours();
        const durationMinutes = faker.helpers.arrayElement(possibleDurations);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

        return appointmentManager.create({
            name: faker.word.words({count: 2}),
            notes: faker.lorem.lines(2),
            startDate,
            endDate,
            agendas: agendasToLink,
        });
    });

    return await Promise.all(createPromises);
}

async function clear() {
    const manager = new AppointmentManager();
    const datas = await manager.findAll();

    const deletePromises = datas.map((data) => manager.delete(data.id));
    return Promise.all(deletePromises);
}

export default {seed, clear};
