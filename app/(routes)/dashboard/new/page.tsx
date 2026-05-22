import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import WebsiteForm from "./_components/WebsiteFrom"
import ScriptSection from "./_components/ScriptSection"

type Props = {
  searchParams: {
    step?: string
    websiteId?: string
    domain?: string
  }
}

const AddWebsite = ({ searchParams }: Props) => {

  const isScriptStep = searchParams?.step === 'script'

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-10">

      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <Link href="/dashboard">

          <Button
            variant="outline"
            className="mb-6 rounded-xl px-5 py-5 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Button>

        </Link>

        {/* Heading */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            {isScriptStep ? 'Install Tracking Script' : 'Add Website'}
          </h1>

          <p className="text-gray-500 mt-2 text-base">
            {isScriptStep
              ? 'Copy and paste this script in your website to start tracking.'
              : 'Add your website details to start tracking analytics, uptime and performance.'
            }
          </p>

        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-2 md:p-4">

          {isScriptStep
            ? <ScriptSection
                websiteId={searchParams.websiteId || ''}
                domain={searchParams.domain || ''}
              />
            : <WebsiteForm />
          }

        </div>

      </div>

    </div>
  )
}

export default AddWebsite