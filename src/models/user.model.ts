import mongoose, { CallbackError, model, Model, Schema } from "mongoose";
import { User, UserMethods } from "../types/user";
import bcrypt from "bcrypt";

const userSchema = new Schema<User, Model<User>, UserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    methods: {
      comparePassword: async function (password: string): Promise<boolean> {
        try {
          if (!this.isModified("password")) return true;

          const isMatch = await bcrypt.compare(this.password, password);

          return isMatch;
        } catch (error) {
          throw error as CallbackError;
        }
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) next();

    const genSalt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, genSalt);

    this.password = hashedPassword;
  } catch (error) {
    next(error as CallbackError);
  }
});

const User = model("User", userSchema);

export default User;
