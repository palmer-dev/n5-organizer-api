// middlewares/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import auth from "../lib/auth";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = session.user;
    return next();
  } catch (error) {
    console.error("Better Auth Error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default requireAuth;
