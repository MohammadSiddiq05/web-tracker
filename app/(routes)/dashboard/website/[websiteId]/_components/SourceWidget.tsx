import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsType, IMAGE_URL_FOR_DOMAINS } from "@/configs/type";

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
    XAxis,
    YAxis,
} from "recharts";

import {
    ChartConfig,
    ChartTooltip,
    ChartTooltipContent,
    ChartContainer,
} from "@/components/ui/chart";

type Props = {
    websiteAnalytics: AnalyticsType | undefined;
    loading: boolean;
};

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

const SourceWidget = ({
    websiteAnalytics,
    loading,
}: Props) => {

    // REFERRAL LABEL
    const ReferralLabel = (props: any) => {

        const {
            x,
            y,
            height,
            payload,
        } = props;

        const domain = payload?.domainName?.trim() || payload?.name?.trim() || "direct";

        const imageUrl =

            IMAGE_URL_FOR_DOMAINS.replace(
                "<domain>",
                domain.replace(
                    "https://",
                    ""
                )
            );

        return (
            <g
                transform={`translate(${x + 8}, ${y + height / 2 - 8})`}
            >
                <image
                    href={imageUrl}
                    width={16}
                    height={16}
                />

                <text
                    x={24}
                    y={12}
                    fontSize={12}
                    fill="white"
                >
                    {domain}
                </text>
            </g>
        );
    };

    // REF PARAM LABEL
    const RefParamLabel = (props: any) => {

        const {
            x,
            y,
            height,
            payload,
        } = props;

        return (
            <g
                transform={`translate(${x + 8}, ${y + height / 2 - 8})`}
            >
                <text
                    x={0}
                    y={12}
                    fontSize={12}
                    fill="white"
                >
                    {payload?.name}
                </text>
            </g>
        );
    };

    return (
        <div className="w-full">
            <Card className="rounded-3xl border shadow-sm">

                <CardContent className="p-5">

                    <Tabs
                        defaultValue="source"
                        className="w-full"
                    >

                        <TabsList className="mb-5">

                            <TabsTrigger value="source">
                                Source
                            </TabsTrigger>

                            <TabsTrigger value="referral">
                                Ref Params
                            </TabsTrigger>

                        </TabsList>

                        {/* SOURCE TAB */}
                        <TabsContent value="source">

                            <ChartContainer
                                config={chartConfig}
                                className="h-[320px] w-full"
                            >

                                <BarChart
                                    accessibilityLayer
                                    data={
                                        websiteAnalytics?.referrals || []
                                    }
                                    layout="vertical"
                                    margin={{
                                        left: 20,
                                        right: 40,
                                        top: 10,
                                        bottom: 10,
                                    }}
                                >

                                    <CartesianGrid
                                        horizontal={false}
                                    />

                                    <YAxis
                                        dataKey="domainName"
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
                                        content={
                                            <ChartTooltipContent />
                                        }
                                    />

                                    <Bar
                                        dataKey="uv"
                                        fill="var(--primary)"
                                        radius={10}
                                    >

                                        <LabelList
                                            dataKey="domainName"
                                            position="insideLeft"
                                            content={
                                                <ReferralLabel />
                                            }
                                        />

                                        <LabelList
                                            dataKey="uv"
                                            position="right"
                                            fill="currentColor"
                                            fontSize={12}
                                        />

                                    </Bar>

                                </BarChart>

                            </ChartContainer>

                        </TabsContent>

                        {/* REF PARAMS TAB */}
                        <TabsContent value="referral">

                            <ChartContainer
                                config={chartConfig}
                                className="h-[320px] w-full"
                            >

                                <BarChart
                                    accessibilityLayer
                                    data={
                                        websiteAnalytics?.refParams || []
                                    }
                                    layout="vertical"
                                    margin={{
                                        left: 20,
                                        right: 40,
                                        top: 10,
                                        bottom: 10,
                                    }}
                                >

                                    <CartesianGrid
                                        horizontal={false}
                                    />

                                    <YAxis
                                        dataKey="name"
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
                                        content={
                                            <ChartTooltipContent />
                                        }
                                    />

                                    <Bar
                                        dataKey="uv"
                                        fill="var(--primary)"
                                        radius={10}
                                    >

                                        <LabelList
                                            dataKey="name"
                                            position="insideLeft"
                                            content={
                                                <RefParamLabel />
                                            }
                                        />

                                        <LabelList
                                            dataKey="uv"
                                            position="right"
                                            fill="currentColor"
                                            fontSize={12}
                                        />

                                    </Bar>

                                </BarChart>

                            </ChartContainer>

                        </TabsContent>

                    </Tabs>

                </CardContent>

            </Card>
        </div>
    );
};

export default SourceWidget;