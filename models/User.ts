import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor, proporcione un nombre"],
    },
    email: {
      type: String,
      required: [true, "Por favor, proporcione un correo electrónico"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor, proporcione un correo electrónico válido"],
    },
    password: {
      type: String,
      required: [true, "Por favor, proporcione una contraseña"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "conductor"],
      default: "conductor",
    },
  },
  { timestamps: true },
)

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User

