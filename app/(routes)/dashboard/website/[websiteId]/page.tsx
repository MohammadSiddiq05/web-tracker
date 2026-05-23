"use client"
import { WebsiteType } from "@/configs/type"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import FormInput from "./_components/FormInput"

const WebsiteDetail = () => {

    const {websiteId} = useParams()
    const [websiteList, setWebsiteList] = useState<WebsiteType[]>([])

    useEffect(()=>{
        GetWebsiteList()
    },[])

    const GetWebsiteList = async ()=>{
        const websites = await axios.get('/api/website?websiteOnly=true')
        setWebsiteList(websites?.data)
    }
  return (
    <div className="mt-10">
        <FormInput websiteList={websiteList}/>
    </div>
  )
}

export default WebsiteDetail