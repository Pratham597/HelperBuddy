import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const partnerSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      isApproved: { type: String, default: '0' },
    },
    { timestamps: true }
  );
  
  partnerSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
  };
  
  partnerSchema.pre("save", async function (next) {
    if (this.modified) {
      return next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  });

  export default mongoose.models.partner||mongoose.model("partner", partnerSchema);
  