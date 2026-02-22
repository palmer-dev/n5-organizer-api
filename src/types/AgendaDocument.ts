import {Types} from "mongoose";
import AgendaType from "@/types/AgendaType";
import {OwnedDocument} from "@/types/OwnedDocument";
import {IUser} from "@/types/UserDocument";

export interface IAgenda {
    name: string;
    type: AgendaType;
    user: Types.ObjectId | IUser;
    main: boolean;
}

export interface AgendaDocument extends OwnedDocument, IAgenda {
}
