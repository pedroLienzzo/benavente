import mongoose from "mongoose"

const ClienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Por favor, proporcione un nombre"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

ClienteSchema.pre("save", async function (next) {
  if (this.isModified("nombre")) {
    const existingCliente = await mongoose.models.Cliente.findOne({ nombre: this.nombre })
    if (existingCliente) {
      const error: any = new Error("Ya existe un cliente con este nombre")
      error.code = 11000 // This is the MongoDB duplicate key error code
      return next(error)
    }
  }
  next()
})

const Cliente = mongoose.models.Cliente || mongoose.model("Cliente", ClienteSchema)

export default Cliente

