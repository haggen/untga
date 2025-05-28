import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { parse } from "~/lib/validation";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<unknown> }
) {
  try {
    const { ip } = parse(await params, {
      ip: z.ipv4(),
    });
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=city,regionName,country`,
      {
        cache: "force-cache",
      }
    );
    if (!response.ok) {
      throw new Error("Not OK", { cause: response });
    }
    return NextResponse.json(await response.json());
  } catch (err) {
    console.error("Failed to fetch from Geolocation API", err);
    return new NextResponse(null, { status: 500 });
  }
}
