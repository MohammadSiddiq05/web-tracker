import { db } from "@/configs/db";
import { pageViewTable, websitesTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

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
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();

        // ─── USER AGENT PARSING ───────────────────────────────────────────
        const ua = req.headers.get("user-agent") || "";
        const parser = new UAParser(ua);
        const deviceType = parser.getDevice().type || "Desktop";
        const osName = parser.getOS()?.name || "";
        const browserName = parser.getBrowser()?.name || "";

        // ─── GEO FROM VERCEL HEADERS (free, no rate limit) ───────────────
        // These headers are injected automatically by Vercel on every request.
        // Locally they will be empty strings — use fallback values for dev.
        const country     = req.headers.get("x-vercel-ip-country")         || "";
        const countryCode = req.headers.get("x-vercel-ip-country")         || "";
        const city        = req.headers.get("x-vercel-ip-city")            || "";
        const region      = req.headers.get("x-vercel-ip-country-region")  || "";

        // Decode percent-encoded city names that Vercel sometimes sends
        // e.g. "San%20Francisco" → "San Francisco"
        const safeCity   = city   ? decodeURIComponent(city)   : "";
        const safeRegion = region ? decodeURIComponent(region) : "";

        // ─── IP ADDRESS ───────────────────────────────────────────────────
        const ip =
            req.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
            req.headers.get("x-forwarded-for")?.split(",")[0].trim()        ||
            req.headers.get("x-real-ip")                                    ||
            "";

        console.log("[track] ip:", ip, "| country:", country, "| city:", safeCity);

        // ─── WEBSITE VALIDATION ───────────────────────────────────────────
        const websiteRecord = await db
            .select()
            .from(websitesTable)
            .where(eq(websitesTable.websiteId, body.websiteId))
            .limit(1);

        if (!websiteRecord[0]) {
            return NextResponse.json(
                { error: "Website not found" },
                { status: 404 }
            );
        }

        const correctWebsiteId = websiteRecord[0].websiteId;

        // ─── INSERT OR UPDATE ─────────────────────────────────────────────
        let result;

        if (body?.type === "entry") {
            result = await db
                .insert(pageViewTable)
                .values({
                    visitorId:       body.visitorId,
                    websiteId:       correctWebsiteId,
                    domain:          body.domain,
                    url:             body.url,
                    type:            body.type,
                    referrer:        body.referrer,
                    entryTime:       body.entryTime,
                    exitTime:        body.exitTime,
                    totalActiveTime: body.totalActiveTime,
                    utm_source:      body.utm_source,
                    utm_medium:      body.utm_medium,
                    utm_campaign:    body.utm_campaign,
                    device:          deviceType,
                    os:              osName,
                    browser:         browserName,
                    city:            safeCity,
                    region:          safeRegion,
                    country:         country,
                    countryCode:     countryCode,
                    ipAddress:       ip,
                    refParams:       JSON.stringify(body.refParams),
                })
                .returning();

            console.log("[track] INSERT:", result);
        } else {
            result = await db
                .update(pageViewTable)
                .set({
                    exitTime:        body.exitTime,
                    totalActiveTime: body.totalActiveTime,
                    exitUrl:         body.exitUrl,
                })
                .where(eq(pageViewTable.visitorId, body?.visitorId))
                .returning();

            console.log("[track] UPDATE:", result);
        }

        return NextResponse.json(
            { message: "Data received successfully", data: result },
            { headers: CORS_HEADERS }
        );
    } catch (error: any) {
        console.error("[track] ERROR:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
};