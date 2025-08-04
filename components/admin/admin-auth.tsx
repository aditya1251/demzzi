"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Eye, EyeOff } from "lucide-react"

interface AdminAuthProps {
  onAuthenticated: () => void
}

export function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication (in real app, this would be an API call)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.username === "admin" && credentials.password === "admin123") {
      localStorage.setItem("adminToken", "admin-authenticated")
      onAuthenticated()
    } else {
      setError("Invalid credentials. Use admin/admin123")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-green-50 to-green-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm sm:text-base text-gray-600">Sign in to manage DEMZZI</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="Enter username"
                required
                className="h-12 sm:h-14 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter password"
                  required
                  className="h-12 sm:h-14 pr-12 text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm sm:text-base text-center">{error}</div>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 sm:h-14 bg-green-600 hover:bg-green-700 text-white font-semibold text-base"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm sm:text-base text-gray-500">
            <p>Demo credentials:</p>
            <p>Username: admin | Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
