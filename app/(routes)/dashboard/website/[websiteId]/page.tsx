"use client";
import { LiveUserType, WebsiteInfoType, WebsiteType } from "@/configs/type";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormInput from "./_components/FormInput";
import PageViewAnalytic from "./_components/PageViewAnalytic";
import { format } from "date-fns";
import SourceWidget from "./_components/SourceWidget";

const WebsiteDetail = () => {
    const { websiteId } = useParams();
    const [websiteList, setWebsiteList] = useState<WebsiteType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfoType | null>();
    const [liveUser, setLiveUser] = useState<LiveUserType[]>([]);
    const [formData, setFormData] = useState<any>({
        analyticType: "hourly",
        fromDate: new Date(),
        toDate: new Date(),
    });

    useEffect(() => {
        GetWebsiteList();
    }, []);

    useEffect(() => {
        if (websiteId) {
            GetWebsiteAnalyticDetail();
        }
    }, [formData?.fromDate, formData?.toDate, websiteId]);

    useEffect(() => {
        if (!websiteId) return;

        GetLiveUser();

        const interval = setInterval(() => {
            GetLiveUser();
        }, 10000);

        return () => clearInterval(interval);
    }, [websiteId]);

    const GetWebsiteList = async () => {
        try {
            const websites = await axios.get("/api/website?websiteOnly=true");
            setWebsiteList(websites?.data);
        } catch (error) {
            console.error("Website list fetch failed:", error);
        }
    };

    const GetWebsiteAnalyticDetail = async () => {
        try {
            setLoading(true);
            const fromDate = format(formData?.fromDate, "yyyy-MM-dd");
            const toDate = formData?.toDate
                ? format(formData?.toDate, "yyyy-MM-dd")
                : fromDate;

            const websiteResult = await axios.get(
                `/api/website?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`
            );
            setWebsiteInfo(websiteResult?.data[0]);

            console.log("API RESPONSE:", websiteResult?.data);
            console.log("ANALYTICS:", websiteResult?.data[0]?.analytics);
            console.log("COUNTRIES:", websiteResult?.data[0]?.analytics?.countries);
        } catch (error) {
            console.error("Analytics fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const GetLiveUser = async () => {
        try {
            const result = await axios.get("/api/live?websiteId=" + websiteId);
            setLiveUser(result?.data);
        } catch (error) {
            console.error("Live user fetch failed:", error);
        }
    };

    return (
        <div className="mt-10 p-10">
            <FormInput
                websiteList={websiteList}
                setFormData={setFormData}
                setReloadData={() => GetWebsiteAnalyticDetail()}
            />
            <PageViewAnalytic
                websiteInfo={websiteInfo}
                loading={loading}
                analyticType={formData?.analyticType}
                liveUserCount={liveUser?.length}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <SourceWidget
                    websiteAnalytics={websiteInfo?.analytics}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default WebsiteDetail;