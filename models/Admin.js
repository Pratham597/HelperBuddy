import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true,trim:true },
    email: { type: String, required: true,trim:true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

adminSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

adminSchema.pre("save", async function (next) {
  if (this.modified) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

export default mongoose.models.admin || mongoose.model("admin", adminSchema);
