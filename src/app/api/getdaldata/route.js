import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DalAnalysis from "@/models/DalModel";

export async function GET(request) {
    try{
        await connectToDatabase();
        const data = await DalAnalysis.find({}).sort({ created_at: -1 }); // Sort by newest first
        return NextResponse.json({data: data}, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}