import { db } from "@/configs/db";
import { pageViewTable, websitesTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const parser = new UAParser(req.headers.get("user-agent") || "");
    const deviceInfo = parser.getDevice().type || "Desktop";
    const osInfo = parser.getOS()?.name;
    const browserInfo = parser.getBrowser()?.name;

    let ip =
        req.headers.get("x-forwarded-for")?.split(",")[0] ||
        req.headers.get("x-real-ip");

    if (!ip || ip === "::1") {
        ip = "39.37.128.1";
    }

    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geoInfo = await geoRes.json();

    const websiteRecord = await db
        .select()
        .from(websitesTable)
        .where(eq(websitesTable.domain, body.domain))
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
                city: geoInfo.city,
                region: geoInfo.regionName,
                country: geoInfo.country,
                countryCode: geoInfo.countryCode,
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
                exitUrl : body.exitUrl
            })
            .where(eq(pageViewTable.visitorId, body?.visitorId))
            .returning();

        console.log("Update Result:", result);
    }

    return NextResponse.json({
        message: "Data received successfully",
        data: result,
    });
};