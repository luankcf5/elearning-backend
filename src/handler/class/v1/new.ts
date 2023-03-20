import { NextFunction, Request, Response } from "express";
import { Class } from "../../../model/class";

type NewClassDto = {
  name: string;
  session: string;
  description?: string;
};

async function newClass(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, session, description }: NewClassDto =
    req.body;

  try {
    const _class = Class.build({
      name,
      session,
      description,
    });
    await _class.save();

    res.status(201).json({
      class: _class,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export { newClass };
