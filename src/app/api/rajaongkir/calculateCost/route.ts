import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const courier = searchParams.get("courier");
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const weight = searchParams.get("weight");

    if (!courier || !origin || !destination || !weight) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          key: process.env.RAJAONGKIR_API_KEY!,
        },
        body: new URLSearchParams({
          origin,
          destination,
          weight,
          courier,
          price: "lowest",
        }),
      }
    );

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
