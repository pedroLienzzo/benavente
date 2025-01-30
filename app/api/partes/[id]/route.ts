import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import connectDB from "@/lib/mongodb";


export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const db = await connectDB();
        const collection = db.connection.db.collection('partetrabajos');
        // console.log("collection: ", collection)
        const parte = await collection.findOne({ _id: new ObjectId(params.id) });
        // console.log("parte: ", parte)
        if (!parte) {
            return NextResponse.json(
                { success: false, error: "Parte no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: parte });
    } catch (error) {
        console.error("Error obteniendo parte:", error);
        return NextResponse.json(
            { success: false, error: "Error obteniendo parte" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    console.log("Attempting to delete parte with ID:", id);

    try {
        const db = await connectDB();
        const collection = db.connection.db.collection('partetrabajos');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            console.warn("No parte found with the given ID.");
            return NextResponse.json(
                { success: false, error: "Parte not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error during delete operation:", error);
        return NextResponse.json(
            { success: false, error: "Error eliminando parte" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const { _id, ...updateData } = body;

        const db = await connectDB();
        const collection = db.connection.db.collection('partetrabajos');
        console.log("UPDATING COLLECTION: ", collection);

        const result = await collection.updateOne(
            { _id: new ObjectId(params.id) },
            { $set: updateData }
        );

        console.log("UPDATING RESULT: ", result);

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Parte no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error actualizando parte:", error);
        return NextResponse.json(
            { success: false, error: "Error actualizando parte" },
            { status: 500 }
        );
    }
}