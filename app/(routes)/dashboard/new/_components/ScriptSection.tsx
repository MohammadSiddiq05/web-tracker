"use client";

import { useState } from "react";

import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

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
import Link from "next/link";
import { toast } from "sonner";

type Props = {
  websiteId: string;
  domain: string;
};

const ScriptSection = ({ websiteId, domain }: Props) => {
  const script = `<script
  defer
  data-website-id="${websiteId}"
  data-domain="${domain}"
    src="${process.env.NEXT_PUBLIC_HOST_URL}/analytics.js">
</script>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    toast.success("Script copied to clipboard");
  };

  return (
    <div className="flex justify-center items-center px-4 py-10">
      <Card className="w-full max-w-3xl rounded-3xl shadow-sm border">
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Install the WebTrack Script
          </CardTitle>

          <CardDescription>
            <p>
              Copy and paste the following script inside your website&apos;s{" "}
              {"<head>"} tag.
            </p>
          </CardDescription>
        </CardHeader>

        <Separator />

        {/* Content */}
        <CardContent>
          {/* Code Block */}
          <div className="w-full mt-5 relative">
            <SyntaxHighlighter
              language="javascript"
              style={oneDark}
              customStyle={{
                borderRadius: 16,
                padding: 20,
                fontSize: 14,
              }}
            >
              {script}
            </SyntaxHighlighter>

            {/* Copy Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Button */}
          <Link href={"/dashboard"}>
            <Button className="w-full mt-7 h-11 rounded-xl">
              Ok, I&apos;ve Installed the Script
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScriptSection;
