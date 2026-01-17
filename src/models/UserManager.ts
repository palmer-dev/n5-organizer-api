import AbstractManager from "@/models/AbstractManager";
import User from "@/schemas/User";
import { UserDocument } from "@/types/UserDocument";

class UserManager extends AbstractManager<UserDocument> {
  constructor() {
    super(User);
  }
}

export default UserManager;
