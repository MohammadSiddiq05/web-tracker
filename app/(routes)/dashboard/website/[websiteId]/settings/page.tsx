"use client";

import { Button } from "@/components/ui/button";
import { WebsiteType } from "@/configs/type";
import axios from "axios";
import {
    ArrowLeft,
    Loader2,
    Trash2,
    Copy,
    Globe,
    ShieldAlert,
    Settings2,
    CheckCircle2,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";

import Link from "next/link";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const WebsiteSettings = () => {
    const { websiteId } = useParams();

    const router = useRouter();

    const [websiteDetail, setWebsiteDetail] = useState<WebsiteType>();

    const [websiteDomain, setWebsiteDomain] = useState<string>("");

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [copied, setCopied] = useState(false);


    useEffect(() => {
        GetWebsiteDetail();
    }, []);

    const GetWebsiteDetail = async () => {
        try {
            const result = await axios.get(
                "/api/website?websiteId=" +
                websiteId +
                "&websiteOnly=true"
            );

            setWebsiteDetail(result?.data);

            setWebsiteDomain(result?.data?.domain);

        } catch (error) {
            toast.error("Failed to load website");
        }
    };

    const script = useMemo(
        () => `<script
  defer
  data-website-id="${websiteId}"
  data-domain="${websiteDetail?.domain ?? ""}"
  src="${process.env.NEXT_PUBLIC_HOST_URL}/analytics.js">
</script>`,
        [websiteId, websiteDetail?.domain]
    );

    const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);                         
    toast.success("Script copied successfully");
    setTimeout(() => setCopied(false), 2000); 
};

    const handleDeleteWebsite = async () => {
        try {
            setLoading(true);

            await axios.delete("/api/website", {
                data: {
                    websiteId,
                },
            });

            toast.success("Website deleted successfully");

            router.replace("/dashboard");

        } catch (error) {
            toast.error("Failed to delete website");
        } finally {
            setLoading(false);
        }
    };
    const handleSaveDomain = async () => {
        try {
            setSaving(true);

            await axios.patch("/api/website", {
                websiteId,
                domain: websiteDomain,
            });

            toast.success("Domain updated successfully");
            GetWebsiteDetail();

        } catch (error) {
            toast.error("Failed to update domain");
        } finally {
            setSaving(false);
        }
    };
    return (
        <div className="min-h-screen bg-muted/30 p-6 lg:p-10">

            {/* Top Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">

                <div>
                    <Link href="/dashboard">
                        <Button
                            variant="outline"
                            className="rounded-xl"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>

                    <div className="mt-5">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Website Settings
                        </h1>

                        <p className="text-muted-foreground mt-1">
                            Manage your tracking script and website settings
                        </p>
                    </div>
                </div>

                <div className="bg-background border rounded-2xl px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-3">

                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <Globe className="w-6 h-6 text-primary" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-lg">
                                {websiteDetail?.domain?.replace("https://", "")}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Website ID: {websiteId}
                            </p>
                        </div>

                    </div>
                </div>

            </div>

            {/* Tabs */}
            <Tabs
                defaultValue="general"
                className="mt-8 w-full"
            >

                <TabsList className="grid w-full max-w-md grid-cols-2 rounded-2xl h-12">
                    <TabsTrigger value="general">
                        <Settings2 className="w-4 h-4 mr-2" />
                        General
                    </TabsTrigger>

                    <TabsTrigger value="danger">
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Danger Zone
                    </TabsTrigger>
                </TabsList>

                {/* GENERAL TAB */}
                <TabsContent value="general">

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

                        {/* SCRIPT CARD */}
                        <Card className="rounded-3xl border shadow-sm">

                            <CardHeader>
                                <CardTitle className="text-xl">
                                    Tracking Script
                                </CardTitle>

                                <CardDescription>
                                    Add this script inside your website&apos;s{" "}
                                    {"<head>"} tag
                                </CardDescription>
                            </CardHeader>

                            <Separator />

                            <CardContent className="pt-6">

                                <div className="relative">

                                    <SyntaxHighlighter
                                        language="html"
                                        style={oneDark}
                                        customStyle={{
                                            borderRadius: 20,
                                            padding: 24,
                                            fontSize: 14,
                                            margin: 0,
                                        }}
                                    >
                                        {script}
                                    </SyntaxHighlighter>

                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={handleCopy}
                                        className="absolute top-4 right-4 rounded-xl"
                                    >
                                        {copied
                                            ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            : <Copy className="w-4 h-4" />
                                        }
                                    </Button>

                                </div>

                                <div className="mt-5 flex items-center gap-2 text-sm text-green-600 font-medium">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Script ready to install
                                </div>

                            </CardContent>

                        </Card>

                        {/* DOMAIN CARD */}
                        <Card className="rounded-3xl border shadow-sm">

                            <CardHeader>
                                <CardTitle className="text-xl">
                                    Website Domain
                                </CardTitle>

                                <CardDescription>
                                    Update your website domain used for analytics tracking
                                </CardDescription>
                            </CardHeader>

                            <Separator />

                            <CardContent className="pt-6">

                                <div className="space-y-4">

                                    <div>
                                        <label className="text-sm font-medium">
                                            Domain
                                        </label>

                                        <Input
                                            className="mt-2 h-12 rounded-xl"
                                            placeholder="https://example.com"
                                            value={websiteDomain}
                                            onChange={(e) =>
                                                setWebsiteDomain(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="bg-muted rounded-2xl p-4">
                                        <p className="text-sm text-muted-foreground">
                                            Public Website ID
                                        </p>

                                        <p className="font-mono text-sm mt-1 break-all">
                                            {websiteId}
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleSaveDomain}
                                        disabled={saving}
                                        className="w-full h-11 rounded-xl"
                                    >
                                        {saving ? (
                                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                        ) : null}

                                        Save Changes
                                    </Button>

                                </div>

                            </CardContent>

                        </Card>

                    </div>

                </TabsContent>

                {/* DANGER TAB */}
                <TabsContent value="danger">

                    <Card className="rounded-3xl border-red-200 mt-6 shadow-sm">

                        <CardHeader>
                            <CardTitle className="text-red-600 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5" />
                                Danger Zone
                            </CardTitle>

                            <CardDescription>
                                Permanently delete this website and all analytics data
                            </CardDescription>
                        </CardHeader>

                        <Separator />

                        <CardContent className="pt-6">

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                                <div>
                                    <h2 className="font-semibold text-lg">
                                        Delete Website
                                    </h2>

                                    <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                                        This action cannot be undone. All page views,
                                        visitors, analytics, and tracking data will be permanently removed.
                                    </p>
                                </div>

                                <AlertDialog>

                                    <AlertDialogTrigger asChild>

                                        <Button
                                            variant="destructive"
                                            className="rounded-xl h-11 px-6"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Website
                                        </Button>

                                    </AlertDialogTrigger>

                                    <AlertDialogContent className="rounded-3xl">

                                        <AlertDialogHeader>

                                            <AlertDialogTitle>
                                                Delete this website?
                                            </AlertDialogTitle>

                                            <AlertDialogDescription>
                                                This will permanently delete your website
                                                and all analytics data associated with it.
                                            </AlertDialogDescription>

                                        </AlertDialogHeader>

                                        <AlertDialogFooter>

                                            <AlertDialogCancel className="rounded-xl">
                                                Cancel
                                            </AlertDialogCancel>

                                            <AlertDialogAction
                                                onClick={handleDeleteWebsite}
                                                className="bg-red-600 hover:bg-red-700 rounded-xl"
                                            >
                                                {loading ? (
                                                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                )}

                                                Delete Permanently
                                            </AlertDialogAction>

                                        </AlertDialogFooter>

                                    </AlertDialogContent>

                                </AlertDialog>

                            </div>

                        </CardContent>

                    </Card>

                </TabsContent>

            </Tabs>

        </div>
    );
};

export default WebsiteSettings;