import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import WebsiteForm from "./_components/WebsiteFrom"

const AddWebsite = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-10">

      {/* Top Section */}
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <Link href="/dashboard">

          <Button
            variant="outline"
            className="
              mb-6
              rounded-xl
              px-5
              py-5
              flex items-center gap-2
              hover:scale-105
              transition-all
            "
          >

            <ArrowLeft size={18} />
            Dashboard

          </Button>

        </Link>

        {/* Heading */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            Add Website
          </h1>

          <p className="text-gray-500 mt-2 text-base">
            Add your website details to start tracking analytics,
            uptime and performance.
          </p>

        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-2 md:p-4">

          <WebsiteForm />

        </div>

      </div>

    </div>
  )
}

export default AddWebsite