import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: "standard",
    enum: ["standard", "admin"],
    required: true,
  },
  lastActive: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "inactive",
    enum: ["active", "inactive"],
    required: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKKOdmJz8Z2pDtYgFgR2u9spABvNNPKYYtGw&s",
  },
  isDisabled: { type: Boolean, default: false },
});

UserSchema.index({ email: 1, phone: 1 }, { unique: true });

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  console.log(enteredPassword);
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await mongoose.model("Task").deleteMany({ userId: this._id });

      next();
    } catch (error: any) {
      next(error);
    }
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export { User };
