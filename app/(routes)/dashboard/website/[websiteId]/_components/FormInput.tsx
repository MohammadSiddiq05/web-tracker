"use client";

import * as React from "react";

import { format } from "date-fns";

import {
    CalendarIcon,
    ChevronDownIcon,
    RefreshCcw,
    Settings,
} from "lucide-react";

import { useParams } from "next/navigation";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { WebsiteType } from "@/configs/type";

import { DateRange } from "react-day-picker";

type Props = {
    websiteList: WebsiteType[];
    setFormData: any
};
const FormInput = ({
    websiteList,
    setFormData,
}: Props) => {

    const { websiteId } = useParams();

    const today = new Date();

    const [analyticType, setAnalyticType] =
        React.useState<string>("hourly");

    const [date, setDate] =
        React.useState<DateRange>({
            from: today,
        });

    const handleDateChange = (
        range: DateRange | undefined
    ) => {

        if (!range) return;

        if (range.from && !range.to) {

            setDate({
                from: range.from,
            });

            return;
        }

        setDate({
            from: range.from,
            to: range.to,
        });
    };

    const handleToday = () => {

        setDate({
            from: today,
        });
    };

    const handleReset = () => {

        setDate({
            from: today,
        });
    };

    React.useEffect(() => {

        setFormData({
            analyticType : analyticType,
            fromDate: date?.from ?? today,
            toDate: date?.to ?? today,
        });

    }, [
        analyticType,
        date,
        setFormData
    ]);

    return (

        <div className="flex items-center gap-4 flex-wrap justify-between">

            {/* Website Select */}
            <div className="flex items-center gap-3">
                <Select
                    value={
                        (websiteId as string) || ""
                    }
                >

                    <SelectTrigger className="w-full max-w-52">

                        <SelectValue placeholder="Select Website" />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectGroup>

                            <SelectLabel>
                                Website
                            </SelectLabel>

                            {websiteList?.map(
                                (website) => (

                                    <SelectItem
                                        key={website?.id}
                                        value={
                                            website?.websiteId
                                        }
                                    >

                                        {website.domain.replace(
                                            "https://",
                                            ""
                                        )}

                                    </SelectItem>
                                )
                            )}

                        </SelectGroup>

                    </SelectContent>

                </Select>

                {/* Date Picker */}

                <Popover>

                    <PopoverTrigger asChild>

                        <Button
                            variant="outline"
                            data-empty={!date}
                            className={`justify-between text-left font-normal gap-2 ${date?.to
                                ? "w-[320px]"
                                : "w-[240px]"
                                }`}
                        >

                            <div className="flex items-center gap-2 truncate">

                                <CalendarIcon className="h-4 w-4 shrink-0" />

                                {date?.from ? (

                                    date.to ? (

                                        <span className="truncate">

                                            {format(
                                                date.from,
                                                "PPP"
                                            )}{" "}
                                            -{" "}
                                            {format(
                                                date.to,
                                                "PPP"
                                            )}

                                        </span>

                                    ) : (

                                        format(
                                            date.from,
                                            "PPP"
                                        )
                                    )

                                ) : (

                                    <span>
                                        Pick a date
                                    </span>
                                )}

                            </div>

                            <ChevronDownIcon className="h-4 w-4 shrink-0" />

                        </Button>

                    </PopoverTrigger>

                    <PopoverContent
                        className="w-auto p-3"
                        align="start"
                    >

                        <div className="flex justify-between items-center mb-3 gap-2">

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToday}
                            >

                                Today

                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                            >

                                Reset

                            </Button>

                        </div>

                        <Calendar
                            mode="range"
                            selected={date}
                            defaultMonth={date?.from}
                            onSelect={handleDateChange}
                            className="rounded-md border w-[240px]"
                        />

                    </PopoverContent>

                </Popover>

                {/* Analytics Type */}

                <Select
                    value={analyticType}
                    onValueChange={(value) =>
                        setAnalyticType(value)
                    }
                >

                    <SelectTrigger className="w-full max-w-52">

                        <SelectValue placeholder="Select Type" />

                    </SelectTrigger>

                    <SelectContent>

                        <SelectGroup>

                            <SelectLabel>
                                Analytics Type
                            </SelectLabel>

                            <SelectItem value="hourly">
                                Hourly
                            </SelectItem>

                            <SelectItem value="daily">
                                Daily
                            </SelectItem>

                        </SelectGroup>

                    </SelectContent>

                </Select>

                <Button variant={'outline'}>
                    <RefreshCcw />
                </Button>

            </div>

            <Button variant={'outline'}><Settings /></Button>
        </div>
    );
};

export default FormInput;