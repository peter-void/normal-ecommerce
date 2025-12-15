import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(
      "https://rajaongkir.komerce.id/api/v1/destination/province",
      {
        method: "GET",
        headers: {
          Key: process.env.RAJAONGKIR_API_KEY!,
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch province data");
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
