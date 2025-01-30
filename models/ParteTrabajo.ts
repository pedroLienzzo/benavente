import mongoose from "mongoose"

const LineaParteSchema = new mongoose.Schema({
  cliente: {
    type: String,
    required: [true, "Por favor, proporcione un cliente"],
  },
  lugarCarga: {
    type: String,
    required: [true, "Por favor, proporcione un lugar de carga"],
  },
  lugarDescarga: {
    type: String,
    required: [true, "Por favor, proporcione un lugar de descarga"],
  },
  espera: {
    type: String,
    required: [true, "Por favor, proporcione el tiempo de espera"],
  },
  trabajo: {
    type: String,
    required: [true, "Por favor, proporcione el tiempo de trabajo"],
  },
  toneladas: {
    type: Number,
    required: [true, "Por favor, proporcione las toneladas"],
  },
  material: {
    type: String,
    required: [true, "Por favor, proporcione el material"],
  },
  jornada: {
    type: String,
    required: [true, "Por favor, proporcione la jornada"],
    enum: ["manana", "tarde", "noche", "completa"],
  },
})

const ParteTrabajoSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      required: [true, "Por favor, proporcione una fecha"],
    },
    matricula: {
      type: String,
      required: [true, "Por favor, proporcione una matrícula"],
    },
    kilometros: {
      type: Number,
      required: [true, "Por favor, proporcione los kilómetros"],
    },
    conductor: {
      type: String,
      required: [true, "Por favor, proporcione un conductor"],
    },
    transportista: {
      type: String,
      required: [true, "Por favor, proporcione un transportista"],
    },
    estado: {
      type: String,
      enum: ["Pendiente", "Completado"],
      default: "Pendiente",
    },
    lineas: {
      type: [LineaParteSchema],
      required: true,
      validate: {
        validator: function(lineas: any[]) {
          return lineas.length > 0;
        },
        message: "Debe haber al menos una línea en el parte"
      }
    },
  },
  {
    timestamps: true,
  }
)

// Clear any existing model before creating a new one
mongoose.models = {};

const ParteTrabajo = mongoose.model("ParteTrabajo", ParteTrabajoSchema)

export default ParteTrabajo

