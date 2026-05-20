"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react'

const Dashboard = () => {

  const [websiteList, setWebsiteList] = useState([])

  return (
    <div className='min-h-screen bg-gray-100 p-6 md:p-10'>

      {/* Top Section */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>
            My Websites
          </h1>
          <p className='text-gray-500 mt-1'>
            Track and manage all your websites in one place.
          </p>
        </div>

        <Button className='rounded-xl px-6 py-5 text-base shadow-md'>
          + Add Website
        </Button>
      </div>

      {/* Empty State */}
      {websiteList?.length === 0 ? (
        <div className='bg-white rounded-3xl shadow-sm border border-gray-200 p-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-16'>

          <Image
            src={'/website.png'}
            alt='website'
            height={220}
            width={220}
            className='mb-6 object-contain'
          />

          <h2 className='text-2xl font-bold text-gray-800 mb-3'>
            No Website Added Yet
          </h2>

          <p className='text-gray-500 max-w-md mb-6 leading-7'>
            Start tracking your websites by adding your first project.
            Monitor uptime, analytics and performance easily.
          </p>

          <Button className='rounded-xl px-8 py-5 text-base shadow-md'>
            + Add Your First Website
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>

          <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='bg-blue-100 p-3 rounded-xl'>
                🌐
              </div>

              <div>
                <h2 className='font-semibold text-lg'>
                  My Portfolio
                </h2>

                <p className='text-sm text-gray-500'>
                  www.myportfolio.com
                </p>
              </div>
            </div>

            <div className='flex justify-between items-center mt-6'>
              <span className='text-green-600 font-medium text-sm'>
                Active
              </span>

              <Button variant="outline" className='rounded-xl'>
                View Details
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default Dashboard