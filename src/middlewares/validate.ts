import { Request, Response, NextFunction } from "express";

import { type ContextRunner } from "express-validator";

// can be reused by many routes
const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.

    const results = await Promise.all(
      validations.map((validation) => validation.run(req))
    );

    const errorResult = results.find((result) => !result.isEmpty());

    if (errorResult) {
      return res.status(400).json({ errors: errorResult.array() });
    }

    return next();
  };
};

export default validate;
