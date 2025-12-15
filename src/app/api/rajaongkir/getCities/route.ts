import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const provinceId = req.nextUrl.searchParams.get("provinceId");
    if (!provinceId) {
      return NextResponse.json(
        { error: "Province ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://rajaongkir.komerce.id/api/v1/destination/city/${provinceId}`,
      {
        headers: {
          Key: process.env.RAJAONGKIR_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch city data");
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
