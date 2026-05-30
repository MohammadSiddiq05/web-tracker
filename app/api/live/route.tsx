import { NextRequest, NextResponse } from "next/server";
import { and, eq, lt } from "drizzle-orm";
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

        // ── Vercel geo headers (free, no rate limit) ──────────────────────
        const country     = req.headers.get("x-vercel-ip-country")        || "";
        const countryCode = req.headers.get("x-vercel-ip-country")        || "";
        const region      = req.headers.get("x-vercel-ip-country-region") || "";
        const city        = decodeURIComponent(req.headers.get("x-vercel-ip-city") || "");

        // lat/lng Vercel provide nahi karta — blank rakhein
        const lat = "";
        const lng = "";

        await db
            .insert(liveUserTable)
            .values({
                visitorId,
                websiteId,
                last_seen,
                city,
                region,
                country,
                countryCode,
                lat,
                lng,
                device: deviceInfo,
                os: osInfo,
                browser: browserInfo,
            })
            .onConflictDoUpdate({
                target: [liveUserTable.visitorId, liveUserTable.websiteId],
                set: {
                    last_seen,
                    city,
                    region,
                    country,
                    countryCode,
                    device: deviceInfo,
                    os: osInfo,
                    browser: browserInfo,
                },
            });

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

        const threshold = (Date.now() - 30_000).toString();

        await db
            .delete(liveUserTable)
            .where(
                and(
                    eq(liveUserTable.websiteId, websiteId),
                    lt(liveUserTable.last_seen, threshold)
                )
            );

        const activeUsers = await db
            .select()
            .from(liveUserTable)
            .where(eq(liveUserTable.websiteId, websiteId));

        return NextResponse.json(activeUsers, { headers: CORS_HEADERS });

    } catch (err: any) {
        console.error("LIVE GET ERROR:", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500, headers: CORS_HEADERS }
        );
    }
};