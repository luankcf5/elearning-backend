import { NextFunction, Request, Response } from "express";
import { UnauthorizedErr } from "../errors/unauthorized";

function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new UnauthorizedErr("UNAUTHORIZED");
  }

  next();
}

export { requireAuth };
