"use client"
import { WebsiteInfoType, WebsiteType } from "@/configs/type"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import FormInput from "./_components/FormInput"
import PageViewAnalytic from "./_components/PageViewAnalytic"
import { format } from "date-fns"
const WebsiteDetail = () => {

    const { websiteId } = useParams()
    const [websiteList, setWebsiteList] = useState<WebsiteType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfoType | null>()
    const [formData, setFormData] = useState<any>({
        analyticType: "hourly",
        fromDate: new Date(),
        toDate: new Date(),
    })
    useEffect(() => {
        GetWebsiteList()
        GetWebsiteAnalyticDetail();
    }, [])



    const GetWebsiteList = async () => {
        const websites = await axios.get('/api/website?websiteOnly=true')
        setWebsiteList(websites?.data)
    }

    const GetWebsiteAnalyticDetail = async () => {
        setLoading(true)
        const fromDate = format(formData?.fromDate, 'yyyy-MM-dd')
        const toDate = formData?.to ? format(formData?.toDate, 'yyyy-MM-dd') : fromDate;
        const websiteResult = await axios.get(
            `/api/website?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`
        )
        setWebsiteInfo(websiteResult?.data[0])
        setLoading(false)
    }


    useEffect(() => {
        GetWebsiteAnalyticDetail();
    }, [formData?.fromDate, formData?.toDate])

    return (
        <div className="mt-10">
            <FormInput websiteList={websiteList} setFormData={setFormData} />
            <PageViewAnalytic websiteInfo={websiteInfo} loading={loading} analyticType={formData?.analyticType} />
        </div>
    )
}

export default WebsiteDetail