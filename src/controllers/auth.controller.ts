import { NextFunction, Request, Response } from "express";
import {
  authSignInValidator,
  authSignUpValidator,
} from "../validators/auth.validator";
import { UnauthorizedError, ValidationError } from "../utils/AppError";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { ClientRole } from "../enums/roles";
import config from "../config/dotenv";

export async function getAuthUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) throw new UnauthorizedError();

    res.send(req.user);
  } catch (error) {
    next(error);
  }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const { success, data, error } = await authSignUpValidator.safeParseAsync(
      req.body
    );

    if (!success) throw new ValidationError(error);

    const user = await User.create(data);
    const token = jwt.sign(
      {
        type: ClientRole.USER,
        id: user._id,
      },
      config.jwtSecret!,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    };

    res.json(userResponse);
  } catch (error) {
    next(error);
  }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { success, data, error } = authSignInValidator.safeParse(req.body);
    const { email, password } = data || {};

    if (!success) throw new UnauthorizedError("Invalid email or password");

    const user = await User.findOne({ email }, "+password");

    if (!user) throw new UnauthorizedError("Invalid email or password");

    const isMatch = await user.comparePassword(password!);
    if (!isMatch) throw new UnauthorizedError("Invalid email or password");

    const token = jwt.sign(
      {
        type: ClientRole.USER,
        id: user._id,
      },
      config.jwtSecret!,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
}
