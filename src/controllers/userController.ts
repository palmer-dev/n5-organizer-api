import type { Request, Response } from "express";
import models from "../models/index.js";

const browse = async (req: Request, res: Response) => {
  models.user
    .findAll()
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = async (req: Request<{ id: string }>, res: Response) => {
  models.user
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

const edit = async (req: Request<{ id: string }>, res: Response) => {
  const user = req.body;

  // TODO validations (length, format...)

  user.id = parseInt(req.params.id, 10);

  models.user
    .update(user)
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
  const user = req.body;

  // TODO validations (length, format...)

  models.user
    .create(user)
    .then((result) => {
      res.location(`/users/${result.id}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const destroy = async (req: Request<{ id: string }>, res: Response) => {
  models.user
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

export default { browse, read, edit, add, destroy };
