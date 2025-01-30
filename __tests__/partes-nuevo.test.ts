import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import NuevoPartePage from "../app/partes/nuevo/page"

const server = setupServer(
  rest.get("/api/parte-data", (req, res, ctx) => {
    return res(
      ctx.json({
        conductores: [{ _id: "1", nombre: "Conductor 1" }],
        transportistas: [{ _id: "1", nombre: "Transportista 1" }],
        vehiculos: [{ _id: "1", matricula: "ABC123" }],
        clientes: [{ _id: "1", nombre: "Cliente 1" }],
        materiales: [{ _id: "1", nombre: "Material 1" }],
      }),
    )
  }),
  rest.post("/api/partes", (req, res, ctx) => {
    return res(ctx.json({ message: "Parte de trabajo creado correctamente" }))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("NuevoPartePage", () => {
  it("renders the form correctly", async () => {
    render(<NuevoPartePage />)

    await waitFor(() => {
      expect(screen.getByText("Nuevo parte de trabajo")).toBeInTheDocument()
      expect(screen.getByText("Información")).toBeInTheDocument()
      expect(screen.getByText("Línea 1")).toBeInTheDocument()
    })
  })

  it("allows adding a new line", async () => {
    render(<NuevoPartePage />)

    const addLineButton = await screen.findByText("+ Añadir línea")
    fireEvent.click(addLineButton)

    expect(screen.getByText("Línea 2")).toBeInTheDocument()
  })

  it("submits the form successfully", async () => {
    render(<NuevoPartePage />)

    // Fill out the form
    // ... (add code to fill out the form fields)

    const submitButton = screen.getByText("Crear")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Parte de trabajo creado correctamente")).toBeInTheDocument()
    })
  })
})

