import mongoose from "mongoose"

const VehiculoSchema = new mongoose.Schema(
  {
    matricula: {
      type: String,
      required: [true, "Por favor, proporcione una matrícula"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

const Vehiculo = mongoose.models.Vehiculo || mongoose.model("Vehiculo", VehiculoSchema)

export default Vehiculo

