"use client";

import { Button } from "@/components/ui/button";

import { WebsiteInfoType } from "@/configs/type";

import axios from "axios";

import Image from "next/image";

import Link from "next/link";

import { useEffect, useState } from "react";

import WebsiteCard from "./_components/WebsiteCard";

import { Skeleton } from "@/components/ui/skeleton";

import { format } from "date-fns";

import {
  Globe,
  Plus,
  Sparkles,
  Activity,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const [websiteList, setWebsiteList] =
    useState<WebsiteInfoType[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetUserWebsites();
  }, []);

  const GetUserWebsites = async () => {
    try {
      setLoading(true);

      const today = format(
        new Date(),
        "yyyy-MM-dd"
      );

      const result = await axios.get(
        "/api/website?from=" +
          today +
          "&to=" +
          today
      );

      setWebsiteList(result?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">

      {/* HERO SECTION */}
      <div className="relative overflow-hidden border-b bg-background">

        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

        <div className="relative px-6 py-10 md:px-10 lg:px-14">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}
            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm shadow-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  Real-time Website Analytics
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                My Websites
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Track visitors, page views, live users,
                devices, referrals, and performance
                insights for all your websites in one
                powerful dashboard.
              </p>

              {/* STATS */}
              <div className="mt-6 flex flex-wrap gap-4">

                <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Websites
                      </p>

                      <h3 className="text-xl font-bold">
                        {websiteList?.length || 0}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background px-5 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10">
                      <Activity className="h-5 w-5 text-green-600" />
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Analytics Active
                      </p>

                      <h3 className="text-xl font-bold">
                        Live Tracking
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              <Link href={"/dashboard/new"}>
                <Button className="h-12 rounded-2xl px-6 text-base shadow-sm">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Website
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 py-8 md:px-10 lg:px-14">

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="rounded-3xl border bg-background p-5 shadow-sm"
              >
                {/* HEADER */}
                <div className="mb-6 flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-2xl" />

                  <div className="flex-1">
                    <Skeleton className="mb-2 h-5 w-3/4 rounded-lg" />

                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                  </div>
                </div>

                {/* GRAPH */}
                <Skeleton className="h-40 w-full rounded-2xl" />

                {/* FOOTER */}
                <div className="mt-6 flex items-center justify-between">
                  <Skeleton className="h-5 w-20 rounded-lg" />

                  <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          websiteList?.length === 0 && (
            <div className="mx-auto mt-12 max-w-4xl rounded-[32px] border bg-background p-10 shadow-sm">

              <div className="grid items-center gap-10 lg:grid-cols-2">

                {/* LEFT */}
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Sparkles className="h-4 w-4" />
                    Get Started
                  </div>

                  <h2 className="text-4xl font-bold tracking-tight">
                    No Website Added Yet
                  </h2>

                  <p className="mt-4 text-base leading-7 text-muted-foreground">
                    Add your first website and start
                    tracking live visitors, traffic
                    sources, page views, devices,
                    countries, and much more with
                    beautiful analytics.
                  </p>

                  <div className="mt-8">
                    <Link href={"/dashboard/new"}>
                      <Button className="h-12 rounded-2xl px-6 text-base shadow-sm">
                        <Plus className="mr-2 h-5 w-5" />
                        Add Your First Website

                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex justify-center">
                  <div className="relative">

                    <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />

                    <Image
                      src={"/website.png"}
                      alt="website"
                      height={320}
                      width={320}
                      className="relative object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* WEBSITES GRID */}
        {!loading &&
          websiteList?.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="text-2xl font-bold">
                    Your Websites
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Overview of all tracked domains
                  </p>
                </div>

                <div className="rounded-2xl border bg-background px-4 py-2 text-sm shadow-sm">
                  {websiteList.length} website
                  {websiteList.length > 1
                    ? "s"
                    : ""}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">

                {websiteList.map(
                  (website, index) => (
                    <WebsiteCard
                      key={index}
                      websiteInfo={website}
                    />
                  )
                )}
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default Dashboard;