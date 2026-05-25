
import { NextRequest, NextResponse } from "next/server";

import { and, eq, gt } from "drizzle-orm";

import { UAParser } from "ua-parser-js";

import { db } from "@/configs/db";

import { liveUserTable } from "@/configs/schema";


const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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

        const {
            visitorId,
            websiteId,
            last_seen,
            url,
        } = body;


        // Parse device info from User-Agent

        const parser = new UAParser(
            req.headers.get("user-agent") || ""
        );

        const deviceInfo =
            parser.getDevice()?.model || "Desktop";

        const osInfo =
            parser.getOS()?.name || "";

        const browserInfo =
            parser.getBrowser()?.name || "";


        // Get IP

        const ip =
            req.headers
                .get("x-forwarded-for")
                ?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "71.71.22.54";


        // Fetch Geo Location

        const geoRes = await fetch(
            `http://ip-api.com/json/${ip}`
        );

        const geoInfo = await geoRes.json();


        // Insert / Update Live User

        await db
            .insert(liveUserTable)
            .values({

                visitorId,
                websiteId,
                last_seen,

                city: geoInfo.city || "",

                region:
                    geoInfo.regionName || "",

                country:
                    geoInfo.country || "",

                countryCode:
                    geoInfo.countryCode || "",

                lat:
                    geoInfo.lat?.toString() || "",

                lng:
                    geoInfo.lon?.toString() || "",

                device: deviceInfo,

                os: osInfo,

                browser: browserInfo,

            })

            .onConflictDoUpdate({

                target: liveUserTable.visitorId,

                set: {

                    last_seen,

                    city: geoInfo.city || "",

                    region:
                        geoInfo.regionName || "",

                    country:
                        geoInfo.country || "",

                    countryCode:
                        geoInfo.countryCode || "",

                    lat:
                        geoInfo.lat?.toString() || "",

                    lng:
                        geoInfo.lon?.toString() || "",

                    device: deviceInfo,

                    os: osInfo,

                    browser: browserInfo,

                },

            });

        return NextResponse.json(
            {
                message: "Data received successfully",
            },
            {
                headers: CORS_HEADERS,
            }
        );

    } catch (err: any) {

        console.error(err);

        return NextResponse.json(
            {
                status: "error",
                message: err.message,
            },
            {
                headers: CORS_HEADERS,
            }
        );
    }
}


export const GET = async (req: NextRequest) => {

    const websiteId =
        req.nextUrl.searchParams.get(
            "websiteId"
        );

    const now = Date.now();


    const activeUsers = await db
        .select()
        .from(liveUserTable)
        .where(

            and(

                gt(
                    liveUserTable.last_seen,
                    String(now - 30_000)
                ),

                eq(
                    liveUserTable.websiteId,
                    websiteId as string
                )

            )
        );

    return NextResponse.json(
        activeUsers
    );
}
