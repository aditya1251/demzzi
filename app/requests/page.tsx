"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Search,
  RefreshCw,
  CreditCard,
  Eye,
  Upload,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { MobileNav } from "@/components/mobile-nav"

// Types
interface Service {
  id: string
  title: string
}

interface Submission {
  id: string
  submittedAt: string
  formData: Record<string, any>
}

type RequestStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING" | "NEW" | "CANCELLED"

interface Request {
  id: string
  status: RequestStatus
  createdAt: string
  service: Service
  submissions: Submission[]
}

const statusConfig: Record<
  RequestStatus,
  {
    label: string
    color: string
    textColor: string
    bgColor: string
    icon: React.ElementType
  }
> = {
  COMPLETED: {
    label: "Completed",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    icon: CheckCircle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: RefreshCw,
  },
  PENDING: {
    label: "Pending",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    icon: Clock,
  },
  NEW: {
    label: "New",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    icon: Clock,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    icon: CreditCard,
  },
}

export default function RequestsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [requests, setRequests] = useState<Request[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [openSubmissionModal, setOpenSubmissionModal] = useState<boolean>(false)
  const [activeRequest, setActiveRequest] = useState<Request | null>(null)

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id }),
    })
      .then((res) => res.json())
      .then((data: Request[]) => setRequests(data))
      .catch((err) => console.error("Failed to fetch requests", err))
  }, [session, router])

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: requests.length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
    inProgress: requests.filter((r) => r.status === "IN_PROGRESS").length,
    pending: requests.filter((r) => r.status === "PENDING").length,
  }

  const getStatusIcon = (status: RequestStatus) => {
    const config = statusConfig[status]
    const Icon = config?.icon
    return Icon ? <Icon className="w-5 h-5" /> : null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Your Requests</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white/10 p-4 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div>Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div>Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div>Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <div>In Progress</div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="px-4 py-4 bg-white shadow">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by service title or request ID"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              <Filter className="w-4 h-4 mr-1" />
              All
            </Button>
            {Object.keys(statusConfig).map((statusKey) => (
              <Button
                key={statusKey}
                variant={statusFilter === statusKey ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(statusKey)}
              >
                {statusConfig[statusKey as RequestStatus].label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* List */}
      <section className="px-4 py-6">
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const statusInfo = statusConfig[req.status]
            const hasSubmission = req.submissions.length > 0

            return (
              <Card key={req.id}>
                <CardContent className="p-4 flex flex-col lg:flex-row justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full ${statusInfo.color} flex items-center justify-center text-white`}>
                      {getStatusIcon(req.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{req.service.title}</h3>
                      <div className="text-sm text-gray-600">Request ID: {req.id}</div>
                      <div className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Badge className={`${statusInfo.bgColor} ${statusInfo.textColor} mt-2`} variant="outline">
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <Button
                      size="sm"
                      variant={hasSubmission ? "outline" : "default"}
                      className={hasSubmission ? "border-blue-600 text-blue-600" : "bg-blue-600 text-white"}
                      onClick={() => {
                        setActiveRequest(req)
                        setOpenSubmissionModal(true)
                      }}
                    >
                      {hasSubmission ? (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          View Submission
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-1" />
                          Submit
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredRequests.length === 0 && (
            <div className="text-center py-10">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No matching requests found</p>
            </div>
          )}
        </div>
      </section>

      {/* Submission Modal */}
      <Dialog open={openSubmissionModal} onOpenChange={setOpenSubmissionModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {activeRequest?.submissions.length > 0 ? "Submission Details" : "Submit Information"}
            </DialogTitle>
            <DialogDescription>
              {activeRequest?.service.title} — ID: {activeRequest?.id}
            </DialogDescription>
          </DialogHeader>

          {activeRequest?.submissions.length > 0 ? (
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-semibold">Submitted At:</p>
              <p>{new Date(activeRequest.submissions[0].submittedAt).toLocaleString()}</p>

              <p className="font-semibold mt-3">Form Data:</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(activeRequest.submissions[0].formData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-gray-500">
              <p className="text-sm">Form submission functionality coming soon.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  )
}
