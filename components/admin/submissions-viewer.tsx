"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Search, Filter, Calendar, User, Phone, Mail } from "lucide-react"

interface Submission {
  id: string
  formType: string
  submittedAt: string
  status: "pending" | "processing" | "completed" | "rejected"
  data: Record<string, string>
  applicantName: string
  applicantEmail: string
  applicantPhone: string
}

export function SubmissionsViewer() {
  const [submissions] = useState<Submission[]>([
    {
      id: "SUB001",
      formType: "gst",
      submittedAt: "2024-01-15T10:30:00Z",
      status: "completed",
      data: {
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "9876543210",
        businessName: "Kumar Enterprises",
        businessType: "Private Limited Company",
        state: "Maharashtra",
        pinCode: "400001",
        annualTurnover: "₹75 Lakhs - ₹1.5 Crores",
      },
      applicantName: "Rajesh Kumar",
      applicantEmail: "rajesh@example.com",
      applicantPhone: "9876543210",
    },
    {
      id: "SUB002",
      formType: "itr",
      submittedAt: "2024-01-14T15:45:00Z",
      status: "processing",
      data: {
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "9876543211",
        pan: "ABCDE1234F",
        aadhar: "1234-5678-9012",
        incomeType: "Salary",
        annualIncome: "₹5 - ₹10 Lakhs",
        state: "Delhi",
      },
      applicantName: "Priya Sharma",
      applicantEmail: "priya@example.com",
      applicantPhone: "9876543211",
    },
    {
      id: "SUB003",
      formType: "gst",
      submittedAt: "2024-01-13T09:15:00Z",
      status: "pending",
      data: {
        name: "Amit Patel",
        email: "amit@example.com",
        phone: "9876543212",
        businessName: "Patel Trading Co.",
        businessType: "Partnership",
        state: "Gujarat",
        pinCode: "380001",
        annualTurnover: "₹20 Lakhs - ₹75 Lakhs",
      },
      applicantName: "Amit Patel",
      applicantEmail: "amit@example.com",
      applicantPhone: "9876543212",
    },
    {
      id: "SUB004",
      formType: "itr",
      submittedAt: "2024-01-12T14:20:00Z",
      status: "rejected",
      data: {
        name: "Sunita Singh",
        email: "sunita@example.com",
        phone: "9876543213",
        pan: "FGHIJ5678K",
        aadhar: "9876-5432-1098",
        incomeType: "Business/Profession",
        annualIncome: "₹10 - ₹15 Lakhs",
        state: "Uttar Pradesh",
      },
      applicantName: "Sunita Singh",
      applicantEmail: "sunita@example.com",
      applicantPhone: "9876543213",
    },
  ])

  const [filteredSubmissions, setFilteredSubmissions] = useState(submissions)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formTypeFilter, setFormTypeFilter] = useState("all")

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsDialogOpen(true)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterSubmissions(term, statusFilter, formTypeFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterSubmissions(searchTerm, status, formTypeFilter)
  }

  const handleFormTypeFilter = (formType: string) => {
    setFormTypeFilter(formType)
    filterSubmissions(searchTerm, statusFilter, formType)
  }

  const filterSubmissions = (search: string, status: string, formType: string) => {
    let filtered = submissions

    if (search) {
      filtered = filtered.filter(
        (sub) =>
          sub.applicantName.toLowerCase().includes(search.toLowerCase()) ||
          sub.applicantEmail.toLowerCase().includes(search.toLowerCase()) ||
          sub.id.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((sub) => sub.status === status)
    }

    if (formType !== "all") {
      filtered = filtered.filter((sub) => sub.formType === formType)
    }

    setFilteredSubmissions(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportSubmissions = () => {
    const csvContent = [
      ["ID", "Form Type", "Applicant Name", "Email", "Phone", "Status", "Submitted At"],
      ...filteredSubmissions.map((sub) => [
        sub.id,
        sub.formType.toUpperCase(),
        sub.applicantName,
        sub.applicantEmail,
        sub.applicantPhone,
        sub.status,
        formatDate(sub.submittedAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "submissions.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Form Submissions</h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage all form submissions</p>
        </div>
        <Button onClick={exportSubmissions} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={formTypeFilter} onValueChange={handleFormTypeFilter}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="All Forms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                <SelectItem value="gst">GST Registration</SelectItem>
                <SelectItem value="itr">ITR Filing</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-500 flex items-center justify-center sm:justify-start p-3 bg-gray-50 rounded-lg">
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-medium">{filteredSubmissions.length}</span>
              <span className="hidden sm:inline ml-1">of {submissions.length} submissions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-4">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{submission.applicantName}</div>
                    <div className="text-sm text-gray-500 font-mono">{submission.id}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="uppercase text-xs">
                    {submission.formType}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleViewSubmission(submission)} className="p-2">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{submission.applicantEmail}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span>{submission.applicantPhone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={statusColors[submission.status]}>{submission.status}</Badge>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(submission.submittedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden lg:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-800">ID</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Form Type</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Applicant</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Contact</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Submitted</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{submission.id}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="uppercase">
                        {submission.formType}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{submission.applicantName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{submission.applicantEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{submission.applicantPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusColors[submission.status]}>{submission.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(submission.submittedAt)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSubmission(submission)}
                        className="hover:bg-green-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">No submissions found</div>
              <div className="text-sm text-gray-500">Try adjusting your search or filter criteria</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Submission Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Submission Details - {selectedSubmission?.id}</DialogTitle>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4 sm:space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Form Type</div>
                  <Badge variant="outline" className="uppercase text-xs">
                    {selectedSubmission.formType}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Status</div>
                  <Badge className={statusColors[selectedSubmission.status]}>{selectedSubmission.status}</Badge>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Submitted At</div>
                  <div className="text-xs sm:text-sm font-medium">{formatDate(selectedSubmission.submittedAt)}</div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500 mb-1">Submission ID</div>
                  <div className="text-xs sm:text-sm font-mono">{selectedSubmission.id}</div>
                </div>
              </div>

              {/* Form Data */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Submitted Information</h3>
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries(selectedSubmission.data).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-2">
                      <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </div>
                      <div className="text-sm sm:text-base text-gray-800 break-words">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Close
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">Update Status</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
