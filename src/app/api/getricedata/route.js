import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import RiceAnalysis from "@/models/RiceModel";

export async function GET(request) {
    try{
        await connectToDatabase();
        // Remove any accidental limit, and log count for debugging
        const data = await RiceAnalysis.find({}).sort({ created_at: -1 }); // No .limit()
        console.log("RiceAnalysis count:", data.length); // Add this log
        return NextResponse.json({data: data}, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';