import AbstractManager from "@models/AbstractManager";
import WorkSchedule from "@/schemas/WorkSchedule";
import { WorkScheduleDocument } from "@/types/WorkScheduleDocument";
import { Types } from "mongoose";

class WorkScheduleManager extends AbstractManager<WorkScheduleDocument> {
  constructor(userId?: Types.ObjectId) {
    super(WorkSchedule, userId);
  }
}

export default WorkScheduleManager;
