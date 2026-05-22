"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"
import axios from 'axios';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import { Globe, Loader2Icon, Plus, ShieldCheck } from "lucide-react"
import { useState } from "react"

import { useRouter } from "next/navigation";

const WebsiteForm = () => {

  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [timezone, setTimezone] = useState('');
  const [enableLocalhostTracking, setEnableLocalhostTracking] = useState(false)
  const [loading, setLoading] = useState(false)

  const onFormSubmit = async (e: any) => {
    e.preventDefault()

    setLoading(true)

    try {

      const result = await axios.post('/api/website', {
        domain,
        timezone,
        enableLocalhostTracking
      })

      const websiteId = result?.data?.[0]?.websiteId
      const websiteDomain = result?.data?.[0]?.domain

      router.push(
        `/dashboard/new?step=script&websiteId=${encodeURIComponent(websiteId)}&domain=${encodeURIComponent(websiteDomain)}`
      )


    } catch (error: any) {

      console.log(error)

      alert(
        error?.response?.data?.message || "Something went wrong"
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="flex justify-center items-center px-4 py-10">

      <Card className="w-full max-w-2xl rounded-3xl shadow-xl border border-gray-200">

        {/* Header */}
        <CardHeader className="space-y-3 p-8">

          <div className="flex items-center gap-3">

            <div className="bg-black text-white p-3 rounded-2xl">
              <Globe size={22} />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Add New Website
              </CardTitle>

              <p className="text-sm text-gray-500 mt-1">
                Start tracking your website performance and analytics.
              </p>
            </div>

          </div>

        </CardHeader>

        <Separator />

        {/* Form */}
        <CardContent className="p-8">

          <form
            onSubmit={(e) => onFormSubmit(e)}
            className="space-y-7"
          >

            {/* Domain */}
            <div className="space-y-3">

              <label className="text-sm font-semibold text-gray-700">
                Website Domain
              </label>

              <InputGroup className="w-full" >

                <InputGroupAddon className="gap-2 px-4">
                  <Globe size={18} />
                  <span>https://</span>
                </InputGroupAddon>

                <InputGroupInput
                  type="text"
                  placeholder="mywebsite.com"
                  className="h-12 text-base"
                  required
                  value={domain.replace("https://", "")}
                  onChange={(e) => setDomain('https://' + e.target.value)}
                />

              </InputGroup>

            </div>

            {/* Timezone */}
            <div className="space-y-3">

              <label className="text-sm font-semibold text-gray-700">
                Timezone
              </label>

              <Select required onValueChange={(value) => setTimezone(value)} value={timezone}>

                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>

                <SelectContent>

                  <SelectGroup>
                    <SelectLabel>Asia</SelectLabel>

                    <SelectItem value="pkt">
                      Pakistan Standard Time
                    </SelectItem>

                    <SelectItem value="jst">
                      Japan Standard Time
                    </SelectItem>

                    <SelectItem value="kst">
                      Korea Standard Time
                    </SelectItem>

                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel>Europe</SelectLabel>

                    <SelectItem value="gmt">
                      Greenwich Mean Time
                    </SelectItem>

                    <SelectItem value="cet">
                      Central European Time
                    </SelectItem>

                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel>America</SelectLabel>

                    <SelectItem value="est">
                      Eastern Standard Time
                    </SelectItem>

                    <SelectItem value="pst">
                      Pacific Standard Time
                    </SelectItem>

                  </SelectGroup>

                </SelectContent>

              </Select>

            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-4">

              <Checkbox className="mt-1" onCheckedChange={(value) =>
                setEnableLocalhostTracking(value === true)
              } />

              <div>

                <div className="flex items-center gap-2">

                  <ShieldCheck
                    size={18}
                    className="text-green-600"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Enable Localhost Tracking
                  </h3>

                </div>

                <p className="text-sm text-gray-500 mt-1 leading-6">
                  Track localhost activity while developing your
                  website locally.
                </p>

              </div>

            </div>

            {/* Button */}
            <Button
              type="submit" disabled={loading}
              className="w-full h-12 rounded-2xl text-base font-semibold"
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <Plus />}
              Add Website
            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}

export default WebsiteForm