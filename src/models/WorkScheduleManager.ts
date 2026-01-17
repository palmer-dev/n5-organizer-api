import AbstractManager from "@models/AbstractManager";
import WorkSchedule from "@/schemas/WorkSchedule";
import { WorkScheduleDocument } from "@/types/WorkScheduleDocument";

class WorkScheduleManager extends AbstractManager<WorkScheduleDocument> {
  constructor() {
    super(WorkSchedule);
  }
}

export default WorkScheduleManager;
