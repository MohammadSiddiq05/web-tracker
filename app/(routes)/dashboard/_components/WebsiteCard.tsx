"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import { WebsiteInfoType, WebsiteType } from "@/configs/type";

import { Globe, Copy, Check } from "lucide-react";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import Link from "next/link";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type Props = {
  websiteInfo: WebsiteInfoType;
};

const WebsiteCard = ({ websiteInfo }: Props) => {
  const hourlyData = websiteInfo?.analytics?.hourlyVisitors;

  const chartData =
    hourlyData?.length == 1
      ? [
          {
            ...hourlyData[0],
            hour:
              Number(hourlyData[0].hour) - 1 >= 0
                ? Number(hourlyData[0].hour) - 1
                : 0,
            count: 0,
            hourLabel: `${Number(hourlyData[0].hour) - 1} AM/PM`,
          },
          hourlyData[0],
        ]
      : hourlyData;

  const [copied, setCopied] = useState(false);

 const scriptTag = `<script src="${window.location.origin}/analytic.js" data-website-id="${websiteInfo?.website?.websiteId}" data-domain="${websiteInfo?.website?.domain}" defer></script>`


  const handleCopy = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={"/dashboard/website/" + websiteInfo?.website?.websiteId}>
      <Card className="rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
            <Globe size={24} />
          </div>

          <div className="flex-1 overflow-hidden">
            <CardTitle className="text-lg font-bold truncate">
              {websiteInfo?.website?.domain}
            </CardTitle>

            <p className="text-sm text-gray-500 mt-1">
              {websiteInfo?.website?.timezone.toUpperCase()}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
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
                dataKey="data"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
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

        <CardFooter className="flex flex-col gap-3 items-start">
          <h2 className="text-sm">
            <strong>{websiteInfo?.analytics?.totalVisitors}</strong> Visitors
          </h2>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default WebsiteCard;
