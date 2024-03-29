import { NextFunction, Request, Response } from "express";
import { Role } from "../../../model/role";

async function delRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.params;

  try {
    const role = await Role.findByIdAndDelete(id);

    res.json({
      role,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export { delRole };
