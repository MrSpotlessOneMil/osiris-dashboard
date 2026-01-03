import { getDashboardData } from "@/lib/google-sheets";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getDashboardData();
  return NextResponse.json(data);
}
