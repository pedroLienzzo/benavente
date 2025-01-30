import mongoose from "mongoose"

const MaterialSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "Por favor, proporcione un nombre"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

const Material = mongoose.models.Material || mongoose.model("Material", MaterialSchema)

export default Material

