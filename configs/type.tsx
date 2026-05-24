export type WebsiteType = {
    id: number;
    websiteId: string;
    domain: string;
    timezone: string;
    enableLocalhostTracking: boolean;
    userEmail: string;
};

export type WebsiteInfoType = {
    website: WebsiteType;
    analytics: AnalyticsType;
};

export type AnalyticsType = {
    avgActiveTime: number;
    totalActiveTime: number;
    totalSessions: number;
    totalVisitors: number;

    hourlyVisitors: HourlyVisitorsType[];
    dailyVisitors: DailyVisitorsType[];

    referrals: ReferralsType[];
    refParams: RefParamsType[];

    countries: CountryType[];
    cities: CityType[];
    regions: RegionType[];

    devices: DeviceType[];
    os: OSType[];
    browsers: BrowserType[];

    urls: UrlType[];
    utmSources: UtmSourceType[];

    last24hVisitors: number;
};

export type RefParamsType = {
    name: string;
    uv: number;
};

export type HourlyVisitorsType = {
    count: number;
    date: string;
    hour: number;
    hourLabel: string;
};

export type DailyVisitorsType = {
    count: number;
    date: string;
};

export type ReferralsType = {
    domainName: string;
    uv: number;
    name: string;
};

export type CountryType = {
    name: string;
    uv: number;
    image: string;
};

export type CityType = {
    name: string;
    uv: number;
    image: string;
};

export type RegionType = {
    name: string;
    uv: number;
    image: string;
};

export type DeviceType = {
    name: string;
    uv: number;
    image: string;
};

export type OSType = {
    name: string;
    uv: number;
    image: string;
};

export type BrowserType = {
    name: string;
    uv: number;
    image: string;
};

export type UrlType = {
    name: string;
    uv: number;
};

export type UtmSourceType = {
    name: string;
    uv: number;
};

export type LiveUserType = {
    visitorId: string;
    websiteId: string;

    last_seen?: string;

    city?: string;
    region?: string;
    country?: string;
    countryCode?: string;

    lat?: string;
    lng?: string;

    device?: string;
    os?: string;
    browser?: string;
};

export const IMAGE_URL_FOR_DOMAINS =
    "https://icons.duckduckgo.com/ip3/<domain>.ico";