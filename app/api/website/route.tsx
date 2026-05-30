import { db } from "@/configs/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { pageViewTable, websitesTable } from "@/configs/schema";
import { toZonedTime } from "date-fns-tz";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const getSafeTimeZone = (tz?: string | null) => {
    if (!tz) return "UTC";
    try {
        Intl.DateTimeFormat("en-US", { timeZone: tz });
        return tz;
    } catch {
        return "UTC";
    }
};

const formatDateInTZ = (date: Date, timeZone: string) =>
    new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);

/** { name, uv } — used for params, utm, urls */
const formatSimple = (map: Record<string, number>) =>
    Object.entries(map)
        .map(([name, uv]) => ({ name, uv }))
        .sort((a, b) => b.uv - a.uv);

/** { name, uv, image: "" } — used for devices, os, browsers */
const formatWithLabel = (map: Record<string, number>) =>
    Object.entries(map)
        .map(([name, uv]) => ({ name, uv, image: "" }))
        .sort((a, b) => b.uv - a.uv);

/** Countries with flag image via flagcdn */
const formatCountries = (
    map: Record<string, number>,
    codeMap: Record<string, string>
) =>
    Object.entries(map)
        .map(([name, uv]) => ({
            name,
            uv,
            image: codeMap[name]
                ? `https://flagcdn.com/w40/${codeMap[name].toLowerCase()}.png`
                : "/country.png",
        }))
        .sort((a, b) => b.uv - a.uv);

/** Cities with country flag (using countryCode stored per city) */
const formatCities = (
    map: Record<string, number>,
    codeMap: Record<string, string>
) =>
    Object.entries(map)
        .map(([name, uv]) => ({
            name,
            uv,
            image: codeMap[name]
                ? `https://flagcdn.com/w40/${codeMap[name].toLowerCase()}.png`
                : "/city.png",
        }))
        .sort((a, b) => b.uv - a.uv);

/** Regions with country flag */
const formatRegions = (
    map: Record<string, number>,
    codeMap: Record<string, string>
) =>
    Object.entries(map)
        .map(([name, uv]) => ({
            name,
            uv,
            image: codeMap[name]
                ? `https://flagcdn.com/w40/${codeMap[name].toLowerCase()}.png`
                : "/region.png",
        }))
        .sort((a, b) => b.uv - a.uv);

const getDomainName = (value: string) => {
    try {
        const host = new URL(
            value.startsWith("http") ? value : `https://${value}`
        ).hostname;
        return host.replace("www.", "").split(".")[0];
    } catch {
        return value.split(".")[0];
    }
};

const formatReferrals = (map: Record<string, number>) =>
    Object.entries(map)
        .map(([name, uv]) => ({
            name,
            uv,
            domainName: getDomainName(name),
        }))
        .sort((a, b) => b.uv - a.uv);

// ─── POST — create website ────────────────────────────────────────────────────

export const POST = async (req: NextRequest) => {
    try {
        const { domain, timezone, enableLocalhostTracking } = await req.json();
        const { has } = await auth();
        const user = await currentUser();
        const hasPremiumAccess = has({ plan: "monthly" });

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!hasPremiumAccess) {
            const result = await db
                .select()
                .from(websitesTable)
                .where(
                    eq(
                        websitesTable.userEmail,
                        user?.primaryEmailAddress?.emailAddress as string
                    )
                );

            if (result.length > 0) {
                return NextResponse.json({ msg: "limit" });
            }
        }

        const existingDomain = await db
            .select()
            .from(websitesTable)
            .where(eq(websitesTable.domain, domain));

        if (existingDomain.length > 0) {
            return NextResponse.json(
                { message: "Domain already exists" },
                { status: 400 }
            );
        }

        const result = await db
            .insert(websitesTable)
            .values({
                domain,
                timezone,
                enableLocalhostTracking,
                userEmail: user?.primaryEmailAddress?.emailAddress as string,
            })
            .returning();

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("POST /website error:", JSON.stringify(error, null, 2));
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
};

// ─── DELETE — remove website + its page views ─────────────────────────────────

export const DELETE = async (req: NextRequest) => {
    try {
        const { websiteId } = await req.json();
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const website = await db
            .select()
            .from(websitesTable)
            .where(
                and(
                    eq(websitesTable.websiteId, websiteId),
                    eq(
                        websitesTable.userEmail,
                        user.primaryEmailAddress?.emailAddress as string
                    )
                )
            );

        if (website.length === 0) {
            return NextResponse.json(
                { error: "Website not found" },
                { status: 404 }
            );
        }

        await db
            .delete(pageViewTable)
            .where(eq(pageViewTable.websiteId, websiteId));

        await db
            .delete(websitesTable)
            .where(eq(websitesTable.websiteId, websiteId));

        return NextResponse.json({
            success: true,
            message: "Website deleted successfully",
        });
    } catch (error: any) {
        console.error("DELETE /website error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
};

// ─── GET — analytics ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    const user = await currentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const websiteId  = req.nextUrl.searchParams.get("websiteId");
    const from       = req.nextUrl.searchParams.get("from");
    const to         = req.nextUrl.searchParams.get("to");
    const websiteOnly = req.nextUrl.searchParams.get("websiteOnly");

    const fromUnix = from
        ? Math.floor(new Date(`${from}T00:00:00`).getTime() / 1000)
        : null;
    const toUnix = to
        ? Math.floor(new Date(`${to}T23:59:59`).getTime() / 1000)
        : null;

    // ── websiteOnly: return site metadata only, no analytics ──────────────
    if (websiteOnly === "true") {
        if (websiteId) {
            const websites = await db
                .select()
                .from(websitesTable)
                .where(
                    and(
                        eq(websitesTable.userEmail, user?.primaryEmailAddress?.emailAddress as string),
                        eq(websitesTable.websiteId, websiteId)
                    )
                );
            return NextResponse.json(websites[0]);
        }

        const websites = await db
            .select()
            .from(websitesTable)
            .where(
                eq(websitesTable.userEmail, user.primaryEmailAddress!.emailAddress)
            );
        return NextResponse.json(websites);
    }

    // ── fetch websites for this user ──────────────────────────────────────
    const websites = await db
        .select()
        .from(websitesTable)
        .where(
            websiteId
                ? and(
                    eq(websitesTable.userEmail, user.primaryEmailAddress!.emailAddress),
                    eq(websitesTable.websiteId, websiteId)
                )
                : eq(websitesTable.userEmail, user.primaryEmailAddress!.emailAddress)
        )
        .orderBy(sql`${websitesTable.id} DESC`);

    const result: any[] = [];

    for (const site of websites) {
        const siteTZ = getSafeTimeZone(site.timezone);

        // ── fetch page views for date range ───────────────────────────────
        const views = await db
            .select()
            .from(pageViewTable)
            .where(
                and(
                    eq(pageViewTable.websiteId, site.websiteId),
                    ...(fromUnix && toUnix
                        ? [
                            gte(sql`${pageViewTable.entryTime}::bigint`, fromUnix),
                            lte(sql`${pageViewTable.entryTime}::bigint`, toUnix),
                        ]
                        : [])
                )
            );

        // ── unique-visitor sets per dimension ─────────────────────────────
        const countryVisitors:  Record<string, Set<string>> = {};
        const cityVisitors:     Record<string, Set<string>> = {};
        const regionVisitors:   Record<string, Set<string>> = {};
        const deviceVisitors:   Record<string, Set<string>> = {};
        const osVisitors:       Record<string, Set<string>> = {};
        const browserVisitors:  Record<string, Set<string>> = {};
        const referralVisitors: Record<string, Set<string>> = {};
        const refParamsVisitors:Record<string, Set<string>> = {};
        const utmSourceVisitors:Record<string, Set<string>> = {};
        const urlVisitors:      Record<string, Set<string>> = {};

        const countryCodeMap:  Record<string, string> = {};
        const cityCodeMap:     Record<string, string> = {};
        const regionCodeMap:   Record<string, string> = {};

        const uniqueVisitors = new Set<string>();
        let totalActiveTime = 0;

        const addToSet = (
            map: Record<string, Set<string>>,
            key: string,
            visitorId: string
        ) => {
            if (!key || key.trim() === "") return;
            map[key] ??= new Set();
            map[key].add(visitorId);
        };

        views.forEach((v) => {
            if (!v.visitorId) return;

            uniqueVisitors.add(v.visitorId);

            if (v.totalActiveTime && v.totalActiveTime > 0) {
                totalActiveTime += v.totalActiveTime;
            }

            // geo
            if (v.country) {
                addToSet(countryVisitors, v.country, v.visitorId);
                if (v.countryCode)
                    countryCodeMap[v.country] = v.countryCode.toUpperCase();
            }
            if (v.city) {
                addToSet(cityVisitors, v.city, v.visitorId);
                if (v.countryCode)
                    cityCodeMap[v.city] = v.countryCode.toUpperCase();
            }
            if (v.region) {
                addToSet(regionVisitors, v.region, v.visitorId);
                if (v.countryCode)
                    regionCodeMap[v.region] = v.countryCode.toUpperCase();
            }

            // device / tech
            if (v.device)  addToSet(deviceVisitors,  v.device,  v.visitorId);
            if (v.os)      addToSet(osVisitors,       v.os,      v.visitorId);
            if (v.browser) addToSet(browserVisitors,  v.browser, v.visitorId);

            // traffic
            if (v.referrer)  addToSet(referralVisitors,  v.referrer,  v.visitorId);
            if (v.refParams) addToSet(refParamsVisitors, v.refParams, v.visitorId);
            if (v.utm_source)addToSet(utmSourceVisitors, v.utm_source,v.visitorId);
            if (v.url)       addToSet(urlVisitors,        v.url,      v.visitorId);
        });

        const toCountMap = (map: Record<string, Set<string>>) =>
            Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.size]));

        const totalVisitors  = uniqueVisitors.size;
        const totalSessions  = views.length;
        const avgActiveTime  =
            totalVisitors > 0 ? Math.round(totalActiveTime / totalVisitors) : 0;

        // ── last 24 h ─────────────────────────────────────────────────────
        const last24hCutoff = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
        const last24hVisitors = views.filter(
            (v) => v.entryTime && Number(v.entryTime) >= last24hCutoff
        ).length;

        // ── hourly visitors ───────────────────────────────────────────────
        const hourlyMap: Record<string, Set<string>> = {};
        const hourlyVisitors: any[] = [];

        if (views.length > 0) {
            const start = fromUnix
                ? new Date(fromUnix * 1000)
                : new Date(Math.min(...views.map((v) => Number(v.entryTime) * 1000)));
            const end = toUnix
                ? new Date(toUnix * 1000)
                : new Date(Math.max(...views.map((v) => Number(v.entryTime) * 1000)));

            let cursor = new Date(start);
            while (cursor <= end) {
                const local = toZonedTime(cursor, siteTZ);
                const date  = formatDateInTZ(local, siteTZ);
                const hour  = local.getHours();
                const key   = `${date}-${hour}`;

                hourlyMap[key] = new Set();
                hourlyVisitors.push({
                    date,
                    hour,
                    hourLabel: local.toLocaleString("en-US", {
                        hour12: true,
                        hour: "numeric",
                        timeZone: siteTZ,
                    }),
                    count: 0,
                });

                cursor.setHours(cursor.getHours() + 1);
            }

            views.forEach((v) => {
                if (!v.entryTime || !v.visitorId) return;
                const local = toZonedTime(
                    new Date(Number(v.entryTime) * 1000),
                    siteTZ
                );
                const date = formatDateInTZ(local, siteTZ);
                hourlyMap[`${date}-${local.getHours()}`]?.add(v.visitorId);
            });

            hourlyVisitors.forEach((h) => {
                h.count = hourlyMap[`${h.date}-${h.hour}`]?.size || 0;
            });
        }

        // ── daily visitors ────────────────────────────────────────────────
        const dailyMap: Record<string, Set<string>> = {};
        views.forEach((v) => {
            if (!v.entryTime || !v.visitorId) return;
            const local = toZonedTime(
                new Date(Number(v.entryTime) * 1000),
                siteTZ
            );
            const date = formatDateInTZ(local, siteTZ);
            dailyMap[date] ??= new Set();
            dailyMap[date].add(v.visitorId);
        });

        const dailyVisitors = Object.entries(dailyMap).map(([date, set]) => ({
            date,
            count: set.size,
        }));

        // ── assemble result ───────────────────────────────────────────────
        result.push({
            website: site,
            analytics: {
                totalVisitors,
                totalSessions,
                last24hVisitors,
                totalActiveTime,
                avgActiveTime,
                hourlyVisitors,
                dailyVisitors,

                // geo
                countries: formatCountries(toCountMap(countryVisitors), countryCodeMap),
                cities:    formatCities(toCountMap(cityVisitors), cityCodeMap),
                regions:   formatRegions(toCountMap(regionVisitors), regionCodeMap),

                // tech — formatWithLabel (no external images needed; frontend adds emoji)
                devices:  formatWithLabel(toCountMap(deviceVisitors)),
                os:       formatWithLabel(toCountMap(osVisitors)),
                browsers: formatWithLabel(toCountMap(browserVisitors)),

                // traffic
                referrals:  formatReferrals(toCountMap(referralVisitors)),
                refParams:  formatSimple(toCountMap(refParamsVisitors)),
                utmSources: formatSimple(toCountMap(utmSourceVisitors)),
                urls:       formatSimple(toCountMap(urlVisitors)),
            },
        });
    }

    return NextResponse.json(result);
}

// ─── PATCH — update domain ────────────────────────────────────────────────────

export async function PATCH(req: NextRequest) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { websiteId, domain } = await req.json();

        const updated = await db
            .update(websitesTable)
            .set({ domain })
            .where(
                and(
                    eq(websitesTable.websiteId, websiteId),
                    eq(
                        websitesTable.userEmail,
                        user.primaryEmailAddress?.emailAddress as string
                    )
                )
            )
            .returning();

        return NextResponse.json(updated[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}