// import { NextResponse } from "next/server";
// import { heroService } from "@/services/heroService";

// export async function GET() {
//   try {
//     const data = await heroService.getHeroData();
//     return NextResponse.json(data);
//   } catch (error: any) {
//     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
    
//     const updatedData = await heroService.updateHeroData({
//       id: body.id,
//       imageUrl: body.mainBanner.imageUrl || "",
//       title: body.mainBanner.title || "",
//       subtitle: body.mainBanner.subtitle || "",
//       buttonLink: body.mainBanner.buttonLink || "",
//       isActive: body.mainBanner.isActive ?? true,
//     });

//     // console.log(body.id)

//     return NextResponse.json(updatedData);
//   } catch (error: any) {
//     console.error("API Error:", error);
//     return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json({ error: "ID is required" }, { status: 400 });
//     }

//     await heroService.deleteHeroData(id);
//     return NextResponse.json({ message: "Deleted successfully" });
//   } catch (error: any) {
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import { heroService } from "@/services/heroService";

export async function GET() {
  try {
    const data = await heroService.getHeroData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ফ্রন্টএন্ড থেকে আসা 'mainBanner' অবজেক্ট থেকে ডাটা বের করা হচ্ছে
    const { id, mainBanner } = body;

    const updatedData = await heroService.updateHeroData({
      id: id, // সরাসরি বডির ID ব্যবহার করা হচ্ছে
      imageUrl: mainBanner.imageUrl || "",
      title: mainBanner.title || "",
      subtitle: mainBanner.subtitle || "",
      buttonLink: mainBanner.buttonLink || "",
      isActive: mainBanner.isActive, // এখানে সরাসরি ভ্যালু পাস হবে (true/false)
    });

    return NextResponse.json(updatedData);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await heroService.deleteHeroData(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}