"use client";

import {
  Globe,
  Link2,
  MapPin,
  Monitor,
  Flag,
} from "lucide-react";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  AnalyticsType,
  IMAGE_URL_FOR_DOMAINS,
} from "@/configs/type";

type Props = {
  websiteAnalytics: AnalyticsType | undefined;
  loading: boolean;
};

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const SourceWidget = ({ websiteAnalytics }: Props) => {

  // CUSTOM LABEL
  const CustomLabel = (
    props: any,
    type: "domain" | "image" | "text"
  ) => {

    const {
      x,
      y,
      height,
      payload,
    } = props;

    let imageUrl = "";
    let text = payload?.name || "";

    // DOMAIN ICONS
    if (type === "domain") {

      const domain =
        payload?.domainName?.trim() ||
        payload?.name?.trim() ||
        "direct";

      text = domain;

      imageUrl =
        IMAGE_URL_FOR_DOMAINS.replace(
          "<domain>",
          domain
            .replace("https://", "")
            .replace("http://", "")
        );
    }

    // IMAGE TYPES
    if (type === "image") {

      imageUrl = payload?.image || "/placeholder.png";

      text = payload?.name || "";
    }

    return (
      <g
        transform={`translate(${x + 12}, ${y + height / 2 - 11})`}
      >
        {/* IMAGE */}
        {type !== "text" && (
          <foreignObject
            x={0}
            y={0}
            width={22}
            height={22}
          >
            <div
              className="
                h-[22px]
                w-[22px]
                rounded-full
                overflow-hidden
                bg-white
                border
                shadow-sm
                flex
                items-center
                justify-center
              "
            >
              <img
                src={imageUrl}
                alt={text}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            </div>
          </foreignObject>
        )}

        {/* TEXT */}
        <text
          x={type !== "text" ? 32 : 0}
          y={15}
          fontSize={12}
          fill="white"
          fontWeight={500}
          className="capitalize"
        >
          {text}
        </text>
      </g>
    );
  };

  // REUSABLE CHART
  const RenderChart = ({
    data,
    dataKey,
    labelType,
  }: any) => (

    <ChartContainer
      config={chartConfig}
      className="h-[340px] w-full"
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          accessibilityLayer
          data={data || []}
          layout="vertical"
          margin={{
            left: 20,
            right: 50,
            top: 10,
            bottom: 10,
          }}
          barCategoryGap={14}
        >

          {/* GRADIENT */}
          <defs>
            <linearGradient
              id="barGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="var(--primary)"
                stopOpacity={1}
              />

              <stop
                offset="100%"
                stopColor="var(--primary)"
                stopOpacity={0.6}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            horizontal={false}
            strokeDasharray="4 4"
            opacity={0.12}
          />

          <YAxis
            dataKey={dataKey}
            type="category"
            hide
          />

          <XAxis
            dataKey="uv"
            type="number"
            hide
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />

          <Bar
            dataKey="uv"
            fill="url(#barGradient)"
            radius={[14, 14, 14, 14]}
          >

            {/* LEFT LABEL */}
            <LabelList
              dataKey={dataKey}
              position="insideLeft"
              content={(props) =>
                CustomLabel(props, labelType)
              }
            />

            {/* RIGHT VALUE */}
            <LabelList
              dataKey="uv"
              position="right"
              fill="currentColor"
              fontSize={12}
              fontWeight={700}
            />

          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  return (
    <div className="w-full">

      <Card
        className="
          rounded-[30px]
          border
          shadow-sm
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            px-6
            pt-6
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
              "
            >
              Traffic Insights
            </h2>

            <p
              className="
                text-sm
                text-muted-foreground
                mt-1
              "
            >
              Analyze visitors, traffic sources,
              countries and devices.
            </p>

          </div>

          <div
            className="
              h-14
              w-14
              rounded-2xl
              bg-primary/10
              flex
              items-center
              justify-center
            "
          >
            <Globe className="h-7 w-7 text-primary" />
          </div>

        </div>

        <CardContent className="p-6">

          <Tabs
            defaultValue="source"
            className="w-full"
          >

            {/* TAB LIST */}
            <TabsList
              className="
                grid
                grid-cols-5
                w-full
                rounded-2xl
                h-12
                mb-6
                bg-muted/60
              "
            >

              <TabsTrigger
                value="source"
                className="rounded-xl gap-2"
              >
                <Link2 className="h-4 w-4" />
                Sources
              </TabsTrigger>

              <TabsTrigger
                value="params"
                className="rounded-xl gap-2"
              >
                <Flag className="h-4 w-4" />
                Params
              </TabsTrigger>

              <TabsTrigger
                value="countries"
                className="rounded-xl gap-2"
              >
                <Globe className="h-4 w-4" />
                Countries
              </TabsTrigger>

              <TabsTrigger
                value="cities"
                className="rounded-xl gap-2"
              >
                <MapPin className="h-4 w-4" />
                Cities
              </TabsTrigger>

              <TabsTrigger
                value="devices"
                className="rounded-xl gap-2"
              >
                <Monitor className="h-4 w-4" />
                Devices
              </TabsTrigger>

            </TabsList>

            {/* SOURCES */}
            <TabsContent value="source">
              <RenderChart
                data={websiteAnalytics?.referrals}
                dataKey="domainName"
                labelType="domain"
              />
            </TabsContent>

            {/* PARAMS */}
            <TabsContent value="params">
              <RenderChart
                data={websiteAnalytics?.refParams}
                dataKey="name"
                labelType="text"
              />
            </TabsContent>

            {/* COUNTRIES */}
            <TabsContent value="countries">
              <RenderChart
                data={websiteAnalytics?.countries}
                dataKey="name"
                labelType="image"
              />
            </TabsContent>

            {/* CITIES */}
            <TabsContent value="cities">
              <RenderChart
                data={websiteAnalytics?.cities}
                dataKey="name"
                labelType="image"
              />
            </TabsContent>

            {/* DEVICES */}
            <TabsContent value="devices">
              <RenderChart
                data={websiteAnalytics?.devices}
                dataKey="name"
                labelType="image"
              />
            </TabsContent>

          </Tabs>

        </CardContent>

      </Card>

    </div>
  );
};

export default SourceWidget;