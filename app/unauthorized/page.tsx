"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const UnauthorizedPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">Sorry, you don't have permission to access this page.</p>
        <Button 
          onClick={() => router.push('/')}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Go Back to Home
        </Button>
      </div>
    </div>
  )
}

export default UnauthorizedPage