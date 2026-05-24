export type WebsiteType = {
    id: number;
    websiteId: string;
    domain: string;
    timezone: string;
    enableLocalhostTracking: boolean;
    userEmail: string;
}

export type WebsiteInfoType = {
    website: WebsiteType;
    analytics: AnalyticsType;
}

export type AnalyticsType = {
    avgActiveTime: number;
    totalActiveTime: number;
    totalSessions: number;
    totalVisitors: number;
    hourlyVisitors: HourlyVisitorsType[];
    dailyVisitors: DailyVisitorsType[];
    referrals: ReferralsType[];
    refParams: RefParamsType[];
}

export type RefParamsType = {
    name: string;
    uv: number;
}

export type HourlyVisitorsType = {
    count: number;
    date: string;
    hour: number;
    hourLabel: string;
}

export type DailyVisitorsType = {
    count: number;
    date: string;
}

export type ReferralsType = {
    domainName: string; 
    uv: number;
    name: string;
}

export const IMAGE_URL_FOR_DOMAINS = 'https://icons.duckduckgo.com/ip3/<domain>.ico';  

export type LiveUser = {
    visitorId : string,
    websiteId : string
}