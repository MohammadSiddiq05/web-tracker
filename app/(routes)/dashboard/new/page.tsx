import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Code2 } from "lucide-react";
import Link from "next/link";
import WebsiteForm from "./_components/WebsiteFrom";
import ScriptSection from "./_components/ScriptSection";

type Props = {
  searchParams: {
    step?: string;
    websiteId?: string;
    domain?: string;
  };
};

const AddWebsite = ({ searchParams }: Props) => {
  const isScriptStep = searchParams?.step === "script";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background px-4 py-8 md:px-10">
      
      <div className="max-w-6xl mx-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="rounded-2xl h-11 px-5 shadow-sm hover:shadow-md transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                !isScriptStep ? "bg-primary" : "bg-muted"
              }`}
            />
            <span>Add Website</span>

            <div className="w-8 h-[1px] bg-border" />

            <div
              className={`h-2.5 w-2.5 rounded-full ${
                isScriptStep ? "bg-primary" : "bg-muted"
              }`}
            />
            <span>Install Script</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[32px] border bg-card shadow-sm mb-8">
          
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

          <div className="relative p-8 md:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* Left Content */}
            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium shadow-sm mb-5">
                {isScriptStep ? (
                  <>
                    <Code2 className="h-4 w-4 text-primary" />
                    Script Installation
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 text-primary" />
                    Website Setup
                  </>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                {isScriptStep
                  ? "Install Tracking Script"
                  : "Add Your Website"}
              </h1>

              <p className="text-muted-foreground text-lg mt-4 leading-8 max-w-xl">
                {isScriptStep
                  ? "Copy and paste the tracking script into your website to start collecting analytics in real-time."
                  : "Connect your website with WebTrack and monitor visitors, sessions, devices, locations, and more."}
              </p>

              {!isScriptStep && (
                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="rounded-xl border bg-background px-4 py-2 text-sm shadow-sm">
                    Real-time Analytics
                  </div>

                  <div className="rounded-xl border bg-background px-4 py-2 text-sm shadow-sm">
                    Device Tracking
                  </div>

                  <div className="rounded-xl border bg-background px-4 py-2 text-sm shadow-sm">
                    Traffic Insights
                  </div>
                </div>
              )}
            </div>

            {/* Right Card */}
            <div className="w-full lg:w-[320px]">
              <div className="rounded-3xl border bg-background/80 backdrop-blur-sm p-6 shadow-sm">
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Step
                    </p>

                    <h3 className="text-xl font-bold mt-1">
                      {isScriptStep ? "Install Script" : "Website Details"}
                    </h3>
                  </div>

                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    {isScriptStep ? (
                      <Code2 className="h-7 w-7 text-primary" />
                    ) : (
                      <Globe className="h-7 w-7 text-primary" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Step 1
                    </span>

                    <span
                      className={`font-medium ${
                        !isScriptStep
                          ? "text-primary"
                          : "text-green-600"
                      }`}
                    >
                      {isScriptStep ? "Completed" : "In Progress"}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full bg-primary transition-all duration-500 ${
                        isScriptStep ? "w-full" : "w-1/2"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progress
                    </span>

                    <span className="font-semibold">
                      {isScriptStep ? "100%" : "50%"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-[32px] border bg-card shadow-sm overflow-hidden">
          
          <div className="p-4 md:p-8">
            {isScriptStep ? (
              <ScriptSection
                websiteId={searchParams.websiteId || ""}
                domain={searchParams.domain || ""}
              />
            ) : (
              <WebsiteForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWebsite;