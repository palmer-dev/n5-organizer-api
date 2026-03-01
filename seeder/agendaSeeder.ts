import {faker} from "@faker-js/faker";
import {IAgenda} from "@/types/AgendaDocument";
import AgendaManager from "@/models/AgendaManager";
import UserManager from "@/models/UserManager";
import AgendaType from "@/types/AgendaType";
import {UserDocument} from "@/types/UserDocument";

async function seed(user: UserDocument) {
    const DATA: IAgenda[] = [];


    const manager = new AgendaManager(user.id);
    const nbEntity = faker.number.int({min: 1, max: 1});

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < nbEntity; i++) {
        DATA.push({
            main: DATA.length === 0,
            name: `${faker.word.adjective()} ${faker.word.noun()}`,
            type: AgendaType.Intern,
            user: user.id
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

export default {seed, clear};
