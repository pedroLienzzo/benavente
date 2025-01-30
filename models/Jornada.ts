import mongoose from "mongoose"

const JornadaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Por favor, proporcione un tipo de jornada"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

const Jornada = mongoose.models.Jornada || mongoose.model("Jornada", JornadaSchema)

export default Jornada
