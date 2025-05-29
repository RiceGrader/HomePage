import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DalAnalysis from "@/models/DalModel";

export async function GET(request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        let query = {};
        if (startDate) {
            query.created_at = { $gte: new Date(startDate) };
        }
        if (endDate) {
            query.created_at = { ...query.created_at, $lte: new Date(endDate) };
        }
        const data = await DalAnalysis.find(query).sort({ created_at: -1 });
        return NextResponse.json({ data: data }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';