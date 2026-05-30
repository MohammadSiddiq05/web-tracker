"use client";

import {
    Globe,
    Link2,
    MapPin,
    Monitor,
    Flag,
    Cpu,
    Chrome,
    BarChart2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { AnalyticsType } from "@/configs/type";

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
    console.log("COUNTRIES:", websiteAnalytics?.countries);
    console.log("CITIES:", websiteAnalytics?.cities);
    const CustomLabel = (props: any, type: "domain" | "image" | "text") => {
        const { x, y, height, payload } = props;

    // Custom label renderer for bar chart
    const CustomLabel = (
        props: any,
        type: "domain" | "flag" | "emoji" | "text",
        emojiMap?: Record<string, string>,
        fallbackEmoji?: string
    ) => {
        const { x, y, height, value, payload } = props;
        const centerY = y + height / 2;
        const name: string = payload?.name || value || "";

        if (type === "domain") {
            const rawDomain = payload?.domainName?.trim() || name || "direct";
            const faviconUrl = `https://icons.duckduckgo.com/ip3/${rawDomain
                .replace("https://", "")
                .replace("http://", "")}.ico`;

            return (
                <g>
                    <image
                        href={faviconUrl}
                        x={x + 10}
                        y={centerY - 10}
                        width={20}
                        height={20}
                        clipPath="circle(50%)"
                    />
                    <text
                        x={x + 38}
                        y={centerY + 4}
                        fontSize={12}
                        fill="white"
                        fontWeight={500}
                    >
                        {rawDomain || "direct"}
                    </text>
                </g>
            );
        }

        if (type === "flag") {
            const flagUrl = payload?.image || "";
            return (
                <g>
                    {flagUrl && (
                        <image
                            href={flagUrl}
                            x={x + 10}
                            y={centerY - 10}
                            width={24}
                            height={16}
                            rx={3}
                        />
                    )}
                    <text
                        x={x + (flagUrl ? 42 : 10)}
                        y={centerY + 4}
                        fontSize={12}
                        fill="white"
                        fontWeight={500}
                    >
                        {name}
                    </text>
                </g>
            );
        }

        if (type === "emoji" && emojiMap) {
            const emoji = getEmoji(emojiMap, name, fallbackEmoji);
            return (
                <g>
                    <text x={x + 10} y={centerY + 5} fontSize={15}>
                        {emoji}
                    </text>
                    <text
                        x={x + 36}
                        y={centerY + 4}
                        fontSize={12}
                        fill="white"
                        fontWeight={500}
                    >
                        {name}
                    </text>
                </g>
            );
        }

        // plain text
        return (
            <text
                x={x + 12}
                y={centerY + 4}
                fontSize={12}
                fill="white"
                fontWeight={500}
            >
                {name}
            </text>
        );
    };

    // Reusable horizontal bar chart
    const RenderChart = ({
        data,
        dataKey,
        labelType,
        emojiMap,
        fallbackEmoji,
        emptyLabel,
    }: {
        data: any[] | undefined;
        dataKey: string;
        labelType: "domain" | "flag" | "emoji" | "text";
        emojiMap?: Record<string, string>;
        fallbackEmoji?: string;
        emptyLabel: string;
    }) => {
        if (loading) return <LoadingSkeleton />;
        if (!data || data.length === 0) return <EmptyState label={emptyLabel} />;

        // Sort descending and take top 8
        const sorted = [...data]
            .sort((a, b) => b.uv - a.uv)
            .slice(0, 8);

        return (
            <ChartContainer config={chartConfig} className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        accessibilityLayer
                        data={sorted}
                        layout="vertical"
                        margin={{ left: 20, right: 55, top: 8, bottom: 8 }}
                        barCategoryGap={10}
                    >
                        <defs>
                            <linearGradient
                                id="barGradient"
                                x1="0" y1="0" x2="1" y2="0"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="var(--primary)"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="var(--primary)"
                                    stopOpacity={0.5}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            horizontal={false}
                            strokeDasharray="4 4"
                            opacity={0.1}
                        />

                        <YAxis dataKey={dataKey} type="category" hide />
                        <XAxis dataKey="uv" type="number" hide />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />

                        <Bar
                            dataKey="uv"
                            fill="url(#barGradient)"
                            radius={[12, 12, 12, 12]}
                            minPointSize={60}
                        >
                            <LabelList
                                dataKey={dataKey}
                                position="insideLeft"
                                content={(props) =>
                                    CustomLabel(props, labelType, emojiMap, fallbackEmoji)
                                }
                            />
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
    };

    // Stats summary row
    const StatPill = ({ label, value }: { label: string; value: number }) => (
        <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-muted/40 min-w-[80px]">
            <span className="text-lg font-bold tabular-nums">{value}</span>
            <span className="text-[11px] text-muted-foreground">{label}</span>
        </div>
    );

    const tabs = [
        {
            value: "source",
            icon: <Link2 className="h-3.5 w-3.5" />,
            label: "Sources",
            count: websiteAnalytics?.referrals?.length ?? 0,
        },
        {
            value: "countries",
            icon: <Globe className="h-3.5 w-3.5" />,
            label: "Countries",
            count: websiteAnalytics?.countries?.length ?? 0,
        },
        {
            value: "cities",
            icon: <MapPin className="h-3.5 w-3.5" />,
            label: "Cities",
            count: websiteAnalytics?.cities?.length ?? 0,
        },
        {
            value: "devices",
            icon: <Monitor className="h-3.5 w-3.5" />,
            label: "Devices",
            count: websiteAnalytics?.devices?.length ?? 0,
        },
        {
            value: "os",
            icon: <Cpu className="h-3.5 w-3.5" />,
            label: "OS",
            count: websiteAnalytics?.os?.length ?? 0,
        },
        {
            value: "browsers",
            icon: <Chrome className="h-3.5 w-3.5" />,
            label: "Browsers",
            count: websiteAnalytics?.browsers?.length ?? 0,
        },
        {
            value: "params",
            icon: <Flag className="h-3.5 w-3.5" />,
            label: "Params",
            count: websiteAnalytics?.refParams?.length ?? 0,
        },
    ];

    return (
        <div className="w-full">
            <Card className="rounded-[30px] border shadow-sm overflow-hidden">

                {/* HEADER */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Traffic Insights
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sources, locations, devices &amp; browsers
                        </p>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Globe className="h-7 w-7 text-primary" />
                    </div>
                </div>

                <CardContent className="px-6 pb-6 pt-0">

                    {/* SUMMARY PILLS */}
                    {websiteAnalytics && (
                        <div className="flex gap-2 flex-wrap mb-5">
                            <StatPill
                                label="Countries"
                                value={websiteAnalytics.countries?.length ?? 0}
                            />
                            <StatPill
                                label="Cities"
                                value={websiteAnalytics.cities?.length ?? 0}
                            />
                            <StatPill
                                label="Sources"
                                value={websiteAnalytics.referrals?.length ?? 0}
                            />
                            <StatPill
                                label="Devices"
                                value={websiteAnalytics.devices?.length ?? 0}
                            />
                            <StatPill
                                label="Browsers"
                                value={websiteAnalytics.browsers?.length ?? 0}
                            />
                        </div>
                    )}

                    <Tabs defaultValue="source" className="w-full">

                        {/* TAB LIST — scrollable on small screens */}
                        <TabsList className="flex w-full overflow-x-auto rounded-2xl h-auto p-1 mb-5 bg-muted/60 gap-1 no-scrollbar">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="rounded-xl gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap flex-shrink-0 data-[state=active]:shadow-sm"
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="ml-1 text-[10px] bg-primary/15 text-primary rounded-full px-1.5 py-0.5 font-semibold tabular-nums">
                                            {tab.count}
                                        </span>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* SOURCES */}
                        <TabsContent value="source">
                            <RenderChart
                                data={websiteAnalytics?.referrals}
                                dataKey="domainName"
                                labelType="domain"
                                emptyLabel="referral source"
                            />
                        </TabsContent>

                        {/* COUNTRIES */}
                        <TabsContent value="countries">
                            <RenderChart
                                data={websiteAnalytics?.countries}
                                dataKey="name"
                                labelType="flag"
                                emptyLabel="country"
                            />
                        </TabsContent>

                        {/* CITIES */}
                        <TabsContent value="cities">
                            <RenderChart
                                data={websiteAnalytics?.cities}
                                dataKey="name"
                                labelType="flag"
                                emptyLabel="city"
                            />
                        </TabsContent>

                        {/* DEVICES */}
                        <TabsContent value="devices">
                            <RenderChart
                                data={websiteAnalytics?.devices}
                                dataKey="name"
                                labelType="emoji"
                                emojiMap={DEVICE_ICONS}
                                fallbackEmoji="🖥️"
                                emptyLabel="device"
                            />
                        </TabsContent>

                        {/* OS */}
                        <TabsContent value="os">
                            <RenderChart
                                data={websiteAnalytics?.os}
                                dataKey="name"
                                labelType="emoji"
                                emojiMap={OS_ICONS}
                                fallbackEmoji="💻"
                                emptyLabel="OS"
                            />
                        </TabsContent>

                        {/* BROWSERS */}
                        <TabsContent value="browsers">
                            <RenderChart
                                data={websiteAnalytics?.browsers}
                                dataKey="name"
                                labelType="emoji"
                                emojiMap={BROWSER_ICONS}
                                fallbackEmoji="🌐"
                                emptyLabel="browser"
                            />
                        </TabsContent>

                        {/* PARAMS */}
                        <TabsContent value="params">
                            <RenderChart
                                data={websiteAnalytics?.refParams}
                                dataKey="name"
                                labelType="text"
                                emptyLabel="UTM param"
                            />
                        </TabsContent>

                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default SourceWidget;