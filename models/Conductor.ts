import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const ConductorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Por favor, proporcione un nombre"],
    },
    matriculaAsignada: {
      type: String,
      required: [true, "Por favor, proporcione una matrícula asignada"],
    },
    transportistaAsociado: {
      type: String,
      required: [true, "Por favor, proporcione un transportista asociado"],
    },
    correo: {
      type: String,
      required: [true, "Por favor, proporcione un correo electrónico"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Por favor, proporcione un correo electrónico válido"],
    },
    contraseña: {
      type: String,
      required: [true, "Por favor, proporcione una contraseña"],
      minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
)

// Encrypt password using bcrypt
ConductorSchema.pre("save", async function (next) {
  if (!this.isModified("contraseña")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.contraseña = await bcrypt.hash(this.contraseña, salt)
})

ConductorSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as { contraseña?: string }
  if (update.contraseña) {
    const salt = await bcrypt.genSalt(10)
    update.contraseña = await bcrypt.hash(update.contraseña, salt)
  }
  next()
})

// Match user entered password to hashed password in database
ConductorSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.contraseña)
}

const Conductor = mongoose.models.Conductor || mongoose.model("Conductor", ConductorSchema)

export default Conductor

