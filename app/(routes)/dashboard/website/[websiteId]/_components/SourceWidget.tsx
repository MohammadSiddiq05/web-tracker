import { Card, CardContent } from '@/components/ui/card'
import { AnalyticsType, IMAGE_URL_FOR_DOMAINS } from '@/configs/type'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart'
type Props = {
    websiteAnalytics: AnalyticsType | undefined,
    loading: boolean
}

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
    label: {
        color: "var(--background)",
    },
} satisfies ChartConfig

const SourceWidget = ({ websiteAnalytics, loading }: Props) => {


    const BarLabelWithImage = (props: any) => {

        const {
            x,
            y,
            height,
            value,
        } = props;

        const imageUrl =
            IMAGE_URL_FOR_DOMAINS?.replace(
                "<domain>",
                value
            );

        return (

            <g
                transform={`translate(${x + 8}, ${y + height / 2 - 8})`}
            >

                {/* SVG Image */}
                <image
                    href={imageUrl}
                    width={16}
                    height={16}
                />

                {/* SVG Text */}
                <text
                    x={24}
                    y={12}
                    fontSize={12}
                    fill="#ffffff"
                >

                    {value}

                </text>

            </g>
        );
    };

    return (
        <div>
            <Card>
                <CardContent className="p-5">

                    <Tabs
                        defaultValue="source"
                        className="w-full"
                    >

                        <TabsList>

                            <TabsTrigger value="source">
                                Source
                            </TabsTrigger>

                            <TabsTrigger value="referral">
                                Referrals
                            </TabsTrigger>

                        </TabsList>

                        {/* SOURCE TAB */}
                        <TabsContent value="source">

                            <ChartContainer
                                config={chartConfig}
                                className="h-[300px] w-full mt-5"
                            >

                                <BarChart
                                    accessibilityLayer
                                    data={websiteAnalytics?.referrals || []}
                                    layout="vertical"
                                    margin={{
                                        left: 20,
                                        right: 20,
                                    }}
                                >

                                    <CartesianGrid
                                        horizontal={false}
                                    />

                                    <YAxis
                                        dataKey="domainName"
                                        type="category"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        width={80}
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
                                        radius={8}
                                        opacity={0.7}
                                    >

                                        <LabelList
                                            dataKey="uv"
                                            position="right"
                                            fontSize={12}
                                            content={<BarLabelWithImage />}
                                        />

                                    </Bar>

                                </BarChart>

                            </ChartContainer>

                        </TabsContent>

                        {/* REFERRAL TAB */}
                        <TabsContent value="referral">

                            <div className="mt-5 text-sm text-muted-foreground">
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[300px] w-full mt-5"
                                >

                                    <BarChart
                                        accessibilityLayer
                                        data={websiteAnalytics?.refParams || []}
                                        layout="vertical"
                                        margin={{
                                            left: 20,
                                            right: 20,
                                        }}
                                    >

                                        <CartesianGrid
                                            horizontal={false}
                                        />

                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            width={80}
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
                                            radius={8}
                                            opacity={0.7}
                                        >

                                            <LabelList
                                                dataKey="uv"
                                                position="right"
                                                fontSize={12}
                                                content={<BarLabelWithImage />}
                                            />

                                        </Bar>

                                    </BarChart>

                                </ChartContainer>


                            </div>

                        </TabsContent>

                    </Tabs>

                </CardContent>
            </Card>
        </div>
    )
}

export default SourceWidget