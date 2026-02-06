import type { Request, Response } from "express";
import models from "@/models";
import { Types } from "mongoose";

const stats = async (req: Request, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .agenda.stats()
    .then((result) => {
      if (result === null) {
        res.sendStatus(404);
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const upcoming = async (req: Request, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .appointment.findWithoutExec({
      startDate: { $gte: new Date() },
    })
    .limit(5)
    .exec()
    .then((result) => {
      console.log(result);
      if (result === null) {
        res.sendStatus(404);
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

export default {
  stats,
  upcoming,
};
