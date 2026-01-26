import AbstractManager from "@/models/AbstractManager.js";
import ExternalAgenda from "@schemas/ExternalAgenda.js";
import { ExternalAgendaDocument } from "@/types/ExternalAgendaDocument";
import { Types } from "mongoose";

class ExternalAgendaManager extends AbstractManager<ExternalAgendaDocument> {
  constructor(userId?: Types.ObjectId) {
    super(ExternalAgenda, userId);
  }
}

export default ExternalAgendaManager;
