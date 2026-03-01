import AbstractManager from "@/models/AbstractManager";
import User from "@/schemas/User";
import {UserDocument} from "@/types/UserDocument";

class UserManager extends AbstractManager<UserDocument> {
    constructor() {
        super(User);
    }

    create(data: Partial<UserDocument>): Promise<UserDocument> {
        return this.model.create({
            ...data,
        } as unknown as UserDocument);
    }
}

export default UserManager;
