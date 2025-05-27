import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import RiceAnalysis from "@/models/RiceModel";

export async function GET(request) {
    try{
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const myid = searchParams.get('id');
        
        if (!myid) {
            return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
        }
        
        const data = await RiceAnalysis.findById(myid); // Use findById instead of find
        
        if (!data) {
            return NextResponse.json({ error: "Data not found" }, { status: 404 });
        }
        
        return NextResponse.json({data: data}, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

// Add this to prevent static generation issues
export const dynamic = 'force-dynamic';