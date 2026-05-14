

import { NextResponse } from "next/server";
import { heroSidebarService } from "@/services/heroSidebarService";


export async function GET() {
  try {
    const data = await heroSidebarService.getSidebarData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = body.sidePromotion || body.mainBanner;

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const updatedData = await heroSidebarService.upsertSidebarData({
      id: body.id, // যদি ID থাকে তবে সার্ভিস আপডেট করবে
      imageUrl: data.imageUrl,
      targetUrl: data.targetUrl || data.link || "", // link বা targetUrl হ্যান্ডলিং
      isActive: data.isActive
    });

    return NextResponse.json(updatedData);
  } catch (error: any) {
    console.error("API POST ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await heroSidebarService.deleteSidebarData(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}