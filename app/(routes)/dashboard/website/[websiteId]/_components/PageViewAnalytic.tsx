"use client";

import { WebsiteInfoType } from "@/configs/type";
import CountItem from "./CountItem";
import { Separator } from "@/components/ui/separator";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
    ChartContainer,
    type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    websiteInfo: WebsiteInfoType | undefined | null;
    loading?: boolean;
    analyticType: string
};

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;




const PageViewAnalytic = ({ websiteInfo, loading, analyticType }: Props) => {
    const webAnalytics = websiteInfo?.analytics;


    return (
        <div className="mt-7">
            {!loading ? <Card className="rounded-3xl border border-gray-200 shadow-sm">

                {/* Stats Row */}
                <CardContent className="p-5 flex items-center gap-6 flex-wrap">

                    <CountItem label="Visitors" value={webAnalytics?.totalVisitors} />

                    <Separator orientation="vertical" className="h-12" />

                    <CountItem
                        label="Total Page Views"
                        value={webAnalytics?.totalSessions}
                    />

                    <Separator orientation="vertical" className="h-12" />

                    <CountItem
                        label="Total Active Time"
                        value={Number((webAnalytics?.totalActiveTime ?? 0) / 60).toFixed(1) + " min"}
                    />

                    <Separator orientation="vertical" className="h-12" />

                    <CountItem
                        label="Avg Active Time"
                        value={Number((webAnalytics?.avgActiveTime ?? 0) / 60).toFixed(1) + " min"}
                    />

                    <Separator orientation="vertical" className="h-12" />

                    <CountItem label="Live Users" value={"11"} />

                </CardContent>

                {/* Chart */}
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={analyticType == 'hourly' ? webAnalytics?.hourlyVisitors : webAnalytics?.dailyVisitors}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 10,
                                bottom: 10,
                            }}

                        >
                            <defs>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--primary)"
                                        stopOpacity={0.8}
                                    />

                                    <stop
                                        offset="95%"
                                        stopColor="var(--primary)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} />

                            <XAxis
                                dataKey={
                                    analyticType === "hourly"
                                        ? "hourLabel"
                                        : "date"
                                }
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                interval={0}
                                tickFormatter={(value) => {

                                    if (analyticType === "hourly") {
                                        return value;
                                    }

                                    return value.slice(5);
                                }}
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                allowDecimals={false}
                            />
                            <Area
                                dataKey="count"
                                type="natural"
                                fill="url(#fillDesktop)"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                fillOpacity={1}
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>

            </Card> : <div>
                <Skeleton className="w-full h-80 rounded-2xl" />
            </div>}
        </div>
    );
};

export default PageViewAnalytic;