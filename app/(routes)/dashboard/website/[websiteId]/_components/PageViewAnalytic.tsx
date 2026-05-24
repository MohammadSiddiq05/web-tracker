"use client";

import { WebsiteInfoType } from "@/configs/type";

import CountItem from "./CountItem";

import { Separator } from "@/components/ui/separator";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Activity,
  Clock3,
  Eye,
  Users,
  Wifi,
} from "lucide-react";

type Props = {
  websiteInfo: WebsiteInfoType | undefined | null;
  loading?: boolean;
  analyticType: string;
  liveUserCount: number;
};

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const PageViewAnalytic = ({
  websiteInfo,
  loading,
  analyticType,
  liveUserCount,
}: Props) => {

  const webAnalytics = websiteInfo?.analytics;

  const chartData =
    analyticType === "hourly"
      ? webAnalytics?.hourlyVisitors
      : webAnalytics?.dailyVisitors;

  if (loading) {
    return (
      <div className="mt-7">
        <Skeleton className="w-full h-[420px] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="mt-7 space-y-6">

      {/* Analytics Card */}
      <Card className="rounded-3xl border bg-background shadow-sm overflow-hidden">

        {/* Header */}
        <CardHeader className="border-b bg-muted/30">

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div>
              <CardTitle className="text-2xl font-bold">
                Analytics Overview
              </CardTitle>

              <p className="text-sm text-muted-foreground mt-1">
                Track your visitors, engagement, and activity
              </p>
            </div>

            <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-2xl text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>

              {liveUserCount} Live Users
            </div>

          </div>

        </CardHeader>

        {/* Stats */}
        <CardContent className="p-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

            {/* Visitors */}
            <div className="rounded-2xl border bg-muted/30 p-5 hover:shadow-sm transition">

              <div className="flex items-center justify-between">

                <div className="bg-blue-500/10 p-3 rounded-2xl">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>

                <span className="text-xs text-muted-foreground">
                  Total
                </span>

              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">
                  Visitors
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {webAnalytics?.totalVisitors ?? 0}
                </h2>
              </div>

            </div>

            {/* Page Views */}
            <div className="rounded-2xl border bg-muted/30 p-5 hover:shadow-sm transition">

              <div className="flex items-center justify-between">

                <div className="bg-purple-500/10 p-3 rounded-2xl">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>

                <span className="text-xs text-muted-foreground">
                  Sessions
                </span>

              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">
                  Page Views
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {webAnalytics?.totalSessions ?? 0}
                </h2>
              </div>

            </div>

            {/* Total Active Time */}
            <div className="rounded-2xl border bg-muted/30 p-5 hover:shadow-sm transition">

              <div className="flex items-center justify-between">

                <div className="bg-orange-500/10 p-3 rounded-2xl">
                  <Clock3 className="w-5 h-5 text-orange-600" />
                </div>

                <span className="text-xs text-muted-foreground">
                  Total
                </span>

              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">
                  Active Time
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {Number(
                    (webAnalytics?.totalActiveTime ?? 0) / 60
                  ).toFixed(1)}
                  <span className="text-base ml-1 font-medium">
                    min
                  </span>
                </h2>
              </div>

            </div>

            {/* Avg Active Time */}
            <div className="rounded-2xl border bg-muted/30 p-5 hover:shadow-sm transition">

              <div className="flex items-center justify-between">

                <div className="bg-pink-500/10 p-3 rounded-2xl">
                  <Activity className="w-5 h-5 text-pink-600" />
                </div>

                <span className="text-xs text-muted-foreground">
                  Average
                </span>

              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">
                  Avg Time
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {Number(
                    (webAnalytics?.avgActiveTime ?? 0) / 60
                  ).toFixed(1)}
                  <span className="text-base ml-1 font-medium">
                    min
                  </span>
                </h2>
              </div>

            </div>

            {/* Live Users */}
            <div className="rounded-2xl border bg-muted/30 p-5 hover:shadow-sm transition">

              <div className="flex items-center justify-between">

                <div className="bg-green-500/10 p-3 rounded-2xl">
                  <Wifi className="w-5 h-5 text-green-600" />
                </div>

                <span className="text-xs text-green-600 font-medium">
                  LIVE
                </span>

              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">
                  Live Users
                </p>

                <h2 className="text-3xl font-bold mt-1 text-green-600">
                  {liveUserCount ?? 0}
                </h2>
              </div>

            </div>

          </div>

        </CardContent>

        <Separator />

        {/* Chart */}
        <CardContent className="p-6">

          <div className="mb-5">

            <h2 className="text-xl font-semibold">
              Visitor Activity
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              {analyticType === "hourly"
                ? "Hourly visitor analytics"
                : "Daily visitor analytics"}
            </p>

          </div>

          <ChartContainer
            config={chartConfig}
            className="h-[350px] w-full"
          >

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="fillVisitors"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.4}
                    />

                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="opacity-40"
                />

                <XAxis
                  dataKey={
                    analyticType === "hourly"
                      ? "hourLabel"
                      : "date"
                  }
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  interval="preserveStartEnd"
                  minTickGap={20}
                  tick={{
                    fontSize: 12,
                  }}
                  tickFormatter={(value) => {

                    if (analyticType === "hourly") {
                      return value;
                    }

                    return value.slice(5);
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid hsl(var(--border))",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#fillVisitors)"
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </ChartContainer>

        </CardContent>

      </Card>

    </div>
  );
};

export default PageViewAnalytic;