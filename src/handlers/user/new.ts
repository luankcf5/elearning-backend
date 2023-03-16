import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { Prof } from "../../models/profile";
import { User } from "../../models/user";

type NewUserDto = {
  username: string;
  password: string;
  roleId?: Types.ObjectId;
  fullName: string;
  gender: string;
  dob: Date;
  email?: string;
  phone?: string;
};

async function newUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const {
    username,
    password,
    roleId,
    fullName,
    gender,
    dob,
    email,
    phone,
  }: NewUserDto = req.body;

  try {
    const prof = Prof.build({
      fullName,
      dob,
      gender,
      email,
      phone,
    });
    const user = User.build({
      username,
      password,
      profile: prof.id,
      role: roleId,
    });
    await prof.save();
    await user.save();

    res.status(201).json({
      user,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export { newUser };
