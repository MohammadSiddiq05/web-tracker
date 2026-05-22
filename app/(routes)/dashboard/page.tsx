"use client"

import { Button } from '@/components/ui/button'
import { WebsiteType } from '@/configs/type'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import WebsiteCard from './_components/WebsiteCard'
import { Skeleton } from '@/components/ui/skeleton'


const Dashboard = () => {

  const [websiteList, setWebsiteList] = useState<WebsiteType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    GetUserWebsites()
  }, [])

  const GetUserWebsites = async () => {

    try {

      setLoading(true)

      const result = await axios.get('/api/website');

      setWebsiteList(result?.data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }
  }

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

        <Link href={'/dashboard/new'}>

          <Button className='rounded-xl px-6 py-5 text-base shadow-md'>
            + Add Website
          </Button>

        </Link>

      </div>

      {loading && (

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>

          {[1, 2, 3, 4, 5, 6].map((item) => (

            <div
              key={item}
              className='bg-white rounded-2xl border border-gray-200 shadow-sm p-5'
            >

              <div className='flex items-center gap-4 mb-6'>

                <Skeleton className='h-12 w-12 rounded-xl' />

                <div className='flex-1'>

                  <Skeleton className='h-4 w-3/4 rounded-md mb-2' />

                  <Skeleton className='h-3 w-1/2 rounded-md' />

                </div>

              </div>

              <div className='flex justify-between items-center'>

                <Skeleton className='h-4 w-16 rounded-md' />

                <Skeleton className='h-10 w-28 rounded-xl' />

              </div>

            </div>

          ))}

        </div>

      )}
      {/* Empty State */}
      {!loading && websiteList?.length === 0 ? (

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
          </p>

          <Link href={'/dashboard/new'}>

            <Button className='rounded-xl px-8 py-5 text-base shadow-md'>
              + Add Your First Website
            </Button>

          </Link>

        </div>

      ) : (

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>

          {websiteList.map((website, index) => (

            <WebsiteCard
              key={index}
              website={website}
            />

          ))}

        </div>

      )}

    </div>
  )
}

export default Dashboard