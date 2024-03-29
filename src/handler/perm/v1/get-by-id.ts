import { NextFunction, Request, Response } from "express";
import { NotFoundErr } from "../../../error/not-found";
import { Perm } from "../../../model/perm";

async function getPerm(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.params;

  try {
    const perm = await Perm.findById(id);
    if (!perm) {
      throw new NotFoundErr("Permission Not Found");
    }

    res.json({
      permission: perm,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export { getPerm };
