import "../../loadEnvironment.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import { type UserCredentials } from "../../types";

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    const customError = new CustomError(
      "Wrong credentials",
      401,
      "Wrong credentials"
    );

    next(customError);

    return;
  }

  const jwtPayload = {
    sub: user?._id,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

  res.status(200).json({ token });
};

export const createUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, username, email } = req.body;
    const avatar = req.file;

    const saltLength = 10;
    const hashedPasword = await bcryptjs.hash(password, saltLength);

    const newUser = await User.create({
      username,
      password: hashedPasword,
      avatar,
      email,
    });

    res.status(201).json({ newUser });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Wrong credentials"
    );

    next(customError);
  }
};
