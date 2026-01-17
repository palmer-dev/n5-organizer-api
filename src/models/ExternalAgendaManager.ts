import AbstractManager from "@/models/AbstractManager.js";
import ExternalAgenda from "@schemas/ExternalAgenda.js";
import { ExternalAgendaDocument } from "@/types/ExternalAgendaDocument";

class ExternalAgendaManager extends AbstractManager<ExternalAgendaDocument> {
  constructor() {
    super(ExternalAgenda);
  }
}

export default ExternalAgendaManager;
