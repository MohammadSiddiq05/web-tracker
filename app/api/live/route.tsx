import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";
import { UAParser } from "ua-parser-js";
import { db } from "@/configs/db";
import { liveUserTable } from "@/configs/schema";

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS(req: Request) {
    const origin = req.headers.get("origin") || "*";
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { visitorId, websiteId, last_seen } = body;

        const parser = new UAParser(req.headers.get("user-agent") || "");
        const deviceInfo = parser.getDevice()?.type || "Desktop";
        const osInfo = parser.getOS()?.name || "";
        const browserInfo = parser.getBrowser()?.name || "";

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "";

        let geoInfo: any = {};
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
            geoInfo = await geoRes.json();
        } catch {
            console.warn("Geo lookup failed");
        }

        await db
            .insert(liveUserTable)
            .values({
                visitorId,
                websiteId,
                last_seen,
                city: geoInfo.city || "",
                region: geoInfo.regionName || "",
                country: geoInfo.country || "",
                countryCode: geoInfo.countryCode || "",
                lat: geoInfo.lat?.toString() || "",
                lng: geoInfo.lon?.toString() || "",
                device: deviceInfo,
                os: osInfo,
                browser: browserInfo,
            })


        return NextResponse.json(
            { message: "Data received successfully" },
            { headers: CORS_HEADERS }
        );

    } catch (err: any) {
        console.error("LIVE POST ERROR:", err);
        return NextResponse.json(
            { status: "error", message: err.message },
            { status: 500, headers: CORS_HEADERS }
        );
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const websiteId = req.nextUrl.searchParams.get("websiteId");

        if (!websiteId) {
            return NextResponse.json(
                { error: "websiteId required" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        const now = Date.now();
        const threshold = now - 30_000; 

        const allUsers = await db
            .select()
            .from(liveUserTable)
            .where(eq(liveUserTable.websiteId, websiteId));

        const activeUsers = allUsers.filter(
            (u) => Number(u.last_seen) >= threshold
        );

        return NextResponse.json(activeUsers, { headers: CORS_HEADERS });

    } catch (err: any) {
        console.error("LIVE GET ERROR:", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500, headers: CORS_HEADERS }
        );
    }
};