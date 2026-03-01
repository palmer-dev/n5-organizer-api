import type {Request, Response} from "express";
import models from "@/models";
import {Types} from "mongoose";

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
        .appointment
        .useModel()
        .aggregate([
            {$match: {startDate: {$gte: new Date()}}},
            {
                $lookup: {
                    from: "agendas",
                    localField: "agendas.agenda",
                    foreignField: "_id",
                    as: "agendaDoc"
                }
            },
            {$unwind: "$agendaDoc"}, // un agenda par document
            {$match: {"agendaDoc.user": new Types.ObjectId(req.user.id)}},
            {
                $group: {
                    _id: "$_id",
                    doc: {$first: "$$ROOT"} // regroupe par appointment
                }
            },
            {$replaceRoot: {newRoot: "$doc"}},
            {$limit: 5}
        ])
        .exec()
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

export default {
    stats,
    upcoming,
};
