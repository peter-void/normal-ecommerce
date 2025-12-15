import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cityId = request.nextUrl.searchParams.get("cityId");

    if (!cityId) {
      return NextResponse.json(
        { error: "City ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://rajaongkir.komerce.id/api/v1/destination/district/${cityId}`,
      {
        method: "GET",
        headers: {
          Key: process.env.RAJAONGKIR_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch subdistrict data");
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
