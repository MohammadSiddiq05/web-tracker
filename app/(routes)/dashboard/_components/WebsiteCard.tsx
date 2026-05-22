import { Button } from '@/components/ui/button'

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import {
    ChartConfig,
    ChartContainer,
} from '@/components/ui/chart'

import { WebsiteType } from '@/configs/type'

import {
    Globe,
    ArrowRight,
} from 'lucide-react'

import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
} from "recharts"

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

type Props = {
    website: WebsiteType
}

const WebsiteCard = ({ website }: Props) => {

    return (

        <Card className='rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300'>

            <CardHeader className='flex flex-row items-center gap-4 space-y-0'>

                <div className='bg-blue-100 text-blue-600 p-3 rounded-2xl'>
                    <Globe size={24} />
                </div>

                <div className='flex-1 overflow-hidden'>

                    <CardTitle className='text-lg font-bold truncate'>
                        {website.domain}
                    </CardTitle>

                    <p className='text-sm text-gray-500 mt-1'>
                        {website.timezone.toUpperCase()}
                    </p>

                </div>

            </CardHeader>

            <CardContent>

                <ChartContainer
                    config={chartConfig}
                    className="h-[200px] w-full"
                >

                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >

                        <defs>

                            <linearGradient
                                id="fillDesktop"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >

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
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) =>
                                value.slice(0, 3)
                            }
                        />

                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--primary)"
                            strokeWidth={3}
                            fillOpacity={1}
                        />

                    </AreaChart>

                </ChartContainer>

            </CardContent>

            <CardFooter>

                <h2 className='text-sm'><strong>24</strong> Visitors</h2>


            </CardFooter>

        </Card>
    )
}

export default WebsiteCard