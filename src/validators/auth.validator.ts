import { z } from "zod";
import { exists } from "./dbValidatorHelpers";
import User from "../models/user.model";

export const authSignUpValidator = z.object({
  name: z.string().nonempty("Name is required"),
  email: z
    .string()
    .email()
    .refine(exists(User, "email", true), "Email already exists"),
  password: z.string().min(6),
});

export const authSignInValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});
