import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Frontend Mode: API is inactive" });
}