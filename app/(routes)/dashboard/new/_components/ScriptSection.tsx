'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  websiteId: string
  domain: string
}

const ScriptSection = ({ websiteId, domain }: Props) => {

  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const scriptTag = `<script
    defer
    data-website-id='${websiteId}'
    data-domain='${domain}'
    src="http://localhost:3000/analytics.js">
</script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptTag)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex justify-center items-center px-4 py-10">

      <div className="w-full max-w-lg space-y-5">

        {/* Heading */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Install the WebTrack Script
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Copy and paste the following script into the &lt;head&gt; section of your website's HTML.
          </p>
        </div>

        {/* Script Box */}
        <div className="relative bg-gray-900 rounded-2xl p-5">

          {/* Copy Icon Button */}
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            {copied
              ? <Check size={18} className="text-green-400" />
              : <Copy size={18} />
            }
          </button>

          {/* Script Text */}
          <pre className="text-sm leading-7 font-mono whitespace-pre-wrap break-all">
            <span className="text-white">{'<script'}</span>
            {'\n    '}
            <span className="text-white">defer</span>
            {'\n    '}
            <span className="text-white">{'data-website-id=\''}</span>
            <span className="text-yellow-400">{websiteId}</span>
            <span className="text-white">{"'"}</span>
            {'\n    '}
            <span className="text-white">{'data-domain=\''}</span>
            <span className="text-green-400">{domain}</span>
            <span className="text-white">{"'"}</span>
            {'\n    '}
            <span className="text-white">{'src="'}</span>
            <span className="text-blue-400">http://localhost:3000/analytics.js</span>
            <span className="text-white">{'>"'}</span>
            {'\n'}
            <span className="text-white">{'</script>'}</span>
          </pre>

        </div>

        {/* Button */}
        <Button
          className="w-full h-12 rounded-2xl text-base font-semibold bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/dashboard')}
        >
          Ok, I've installed the script
        </Button>

      </div>

    </div>
  )
}

export default ScriptSection