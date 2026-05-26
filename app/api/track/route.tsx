import { db } from "@/configs/db";
import { pageViewTable, websitesTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";


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


function getClientIP(req: Request) {
    const vercelIP = req.headers.get("x-vercel-forwarded-for");

    console.log(vercelIP);

    if (vercelIP) {
        return vercelIP.split(",")[0].trim();
    }

    const xff = req.headers.get("x-forwarded-for");

    if (xff) {
        return xff.split(",")[0].trim();
    }

    // 3. Fallback
    const realIp = req.headers.get("x-real-ip");

    if (realIp) {
        return realIp;
    }

    return null;
}

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const parser = new UAParser(req.headers.get("user-agent") || "");
    const deviceInfo = parser.getDevice().type || "Desktop";
    const osInfo = parser.getOS()?.name;
    const browserInfo = parser.getBrowser()?.name;


    const ip = getClientIP(req);

    console.log(ip);

    let geoInfo = null;

    if (
        ip &&
        !ip.startsWith("10.") &&
        !ip.startsWith("192.168.") &&
        !ip.startsWith("127.") &&
        !ip.startsWith("::1") &&
        ip !== "71.71.22.54"
    ) {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        geoInfo = await geoRes.json();
    }
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

    let result;

    if (body?.type === "entry") {

        result = await db
            .insert(pageViewTable)
            .values({
                visitorId: body.visitorId,
                websiteId: correctWebsiteId,
                domain: body.domain,
                url: body.url,
                type: body.type,
                referrer: body.referrer,
                entryTime: body.entryTime,
                exitTime: body.exitTime,
                totalActiveTime: body.totalActiveTime,
                utm_source: body.utm_source,
                utm_medium: body.utm_medium,
                utm_campaign: body.utm_campaign,
                device: deviceInfo,
                os: osInfo,
                browser: browserInfo,
                city: geoInfo?.city || "",
                region: geoInfo?.region || "",
                country: geoInfo?.country_name || "",
                countryCode: geoInfo?.country_code || "",
                ipAddress: ip || "",
                refParams: JSON.stringify(body.refParams),
            })
            .returning();

        console.log("Insert Result:", result);

    } else {

        result = await db
            .update(pageViewTable)
            .set({
                exitTime: body.exitTime,
                totalActiveTime: body.totalActiveTime,
                exitUrl: body.exitUrl
            })
            .where(eq(pageViewTable.visitorId, body?.visitorId))
            .returning();

        console.log("Update Result:", result);
    }

    return NextResponse.json(
        {
            message: "Data received successfully",
            data: result,
        },
        {
            headers: CORS_HEADERS,
        }
    );
};