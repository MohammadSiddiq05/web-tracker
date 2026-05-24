"use client";

import * as React from "react";

import { format } from "date-fns";

import {
  CalendarIcon,
  ChevronDownIcon,
  RefreshCcw,
  Settings2,
  Globe,
  Activity,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";

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

import Link from "next/link";

import { Card } from "@/components/ui/card";

type Props = {
  websiteList: WebsiteType[];
  setFormData: any;
  setReloadData: any;
};

const FormInput = ({
  websiteList,
  setFormData,
  setReloadData,
}: Props) => {
  const { websiteId } = useParams();

  const today = new Date();

  const [analyticType, setAnalyticType] =
    React.useState<string>("hourly");

  const [date, setDate] = React.useState<DateRange>({
    from: today,
  });

  const router = useRouter();

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
      analyticType,
      fromDate: date?.from ?? today,
      toDate: date?.to ?? today,
    });
  }, [analyticType, date, setFormData]);

  return (
    <Card className="rounded-3xl border shadow-sm p-5 bg-background">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        
        {/* LEFT SIDE */}
        <div className="flex flex-wrap items-center gap-3">

          {/* WEBSITE SELECT */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>

            <Select
              value={(websiteId as string) || ""}
              onValueChange={(v) =>
                router.push("/dashboard/website/" + v)
              }
            >
              <SelectTrigger className="w-[240px] h-11 rounded-2xl border-muted-foreground/20">
                <SelectValue placeholder="Select Website" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Websites</SelectLabel>

                  {websiteList?.map((website) => (
                    <SelectItem
                      key={website?.id}
                      value={website?.websiteId}
                    >
                      {website.domain.replace("https://", "")}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* DATE PICKER */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-11 rounded-2xl justify-between px-4 ${
                  date?.to ? "w-[320px]" : "w-[240px]"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <CalendarIcon className="h-4 w-4 shrink-0" />

                  {date?.from ? (
                    date.to ? (
                      <span className="truncate text-sm">
                        {format(date.from, "PPP")} -{" "}
                        {format(date.to, "PPP")}
                      </span>
                    ) : (
                      <span className="text-sm">
                        {format(date.from, "PPP")}
                      </span>
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </div>

                <ChevronDownIcon className="h-4 w-4 opacity-60" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-4 rounded-2xl"
              align="start"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleToday}
                  className="rounded-xl"
                >
                  Today
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="rounded-xl"
                >
                  Reset
                </Button>
              </div>

              <Calendar
                mode="range"
                selected={date}
                defaultMonth={date?.from}
                onSelect={handleDateChange}
                className="rounded-xl border w-[300px]"
              />
            </PopoverContent>
          </Popover>

          {/* ANALYTICS TYPE */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>

            <Select
              value={analyticType}
              onValueChange={(value) =>
                setAnalyticType(value)
              }
            >
              <SelectTrigger className="w-[180px] h-11 rounded-2xl">
                <SelectValue placeholder="Analytics Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Analytics</SelectLabel>

                  <SelectItem value="hourly">
                    Hourly
                  </SelectItem>

                  <SelectItem value="daily">
                    Daily
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* REFRESH */}
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-2xl"
            onClick={() => setReloadData(true)}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* SETTINGS BUTTON */}
        <Link
          href={
            "/dashboard/website/" +
            websiteId +
            "/settings"
          }
        >
          <Button
            variant="default"
            className="h-11 rounded-2xl px-5 gap-2 shadow-sm"
          >
            <Settings2 className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default FormInput;