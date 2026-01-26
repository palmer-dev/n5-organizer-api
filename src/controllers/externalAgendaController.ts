import type { Request, Response } from "express";
import models from "../models/index.js";

const browse = async (req: Request, res: Response) => {
  models.externalAgenda
    .findAll()
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = async (req: Request, res: Response) => {
  models.externalAgenda
    .find(req.params.id)
    .then((row) => {
      if (row == null) {
        res.sendStatus(404);
      } else {
        res.send(row);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const edit = async (req: Request, res: Response) => {
  const externalAgenda = req.body;

  // TODO validations (length, format...)

  externalAgenda.id = parseInt(req.params.id, 10);

  models.externalAgenda
    .update(externalAgenda)
    .then((result) => {
      if (result === null) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const add = async (req: Request, res: Response) => {
  const externalAgenda = req.body;

  // TODO validations (length, format...)

  models.externalAgenda
    .create(externalAgenda)
    .then((result) => {
      res.location(`/externalAgendas/${result.id}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const destroy = async (req: Request, res: Response) => {
  models.externalAgenda
    .delete(req.params.id)
    .then((result) => {
      if (result === null) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

export default {
  browse,
  read,
  edit,
  add,
  destroy,
};
