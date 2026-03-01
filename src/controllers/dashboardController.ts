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
            {$unwind: "$agendas"},
            {
                $lookup: {
                    from: "agendas",
                    localField: "agendas.agenda",
                    foreignField: "_id",
                    as: "agendas.agenda"
                }
            },
            {$unwind: "$agendas.agenda"},
            {
                $lookup: {
                    from: "users",
                    localField: "agendas.agenda.user",
                    foreignField: "_id",
                    as: "agendas.agenda.user"
                }
            },
            {$unwind: "$agendas.agenda.user"},
            {
                $group: {
                    _id: "$_id",
                    fullDoc: {$first: "$$ROOT"},
                    agendasEnrichis: {$push: "$agendas"}
                }
            },
            {
                $match: {
                    "agendasEnrichis.agenda.user._id": new Types.ObjectId(req.user.id)
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$fullDoc",
                            {agendas: "$agendasEnrichis"}
                        ]
                    }
                }
            },
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
