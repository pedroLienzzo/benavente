import mongoose from "mongoose"

const TransportistaSchema = new mongoose.Schema(
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

TransportistaSchema.pre("save", async function (next) {
  if (this.isModified("nombre")) {
    const existingTransportista = await mongoose.models.Transportista.findOne({ nombre: this.nombre })
    if (existingTransportista) {
      const error: any = new Error("Ya existe un transportista con este nombre")
      error.code = 11000 // This is the MongoDB duplicate key error code
      return next(error)
    }
  }
  next()
})

const Transportista = mongoose.models.Transportista || mongoose.model("Transportista", TransportistaSchema)

export default Transportista

