"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle, Clock, AlertCircle, User, Calendar } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  clientName: string
  serviceType: string
  status: "pending" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  dueDate: string
  assignedTo: string
  createdDate: string
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "GST Registration for Rajesh Kumar",
      description: "Complete GST registration process including document verification",
      clientName: "Rajesh Kumar",
      serviceType: "GST Registration",
      status: "pending",
      priority: "high",
      dueDate: "2024-03-20",
      assignedTo: "Admin",
      createdDate: "2024-03-15",
    },
    {
      id: "2",
      title: "ITR Filing for Priya Sharma",
      description: "File income tax return for AY 2023-24",
      clientName: "Priya Sharma",
      serviceType: "ITR Filing",
      status: "in-progress",
      priority: "medium",
      dueDate: "2024-03-25",
      assignedTo: "Admin",
      createdDate: "2024-03-14",
    },
    {
      id: "3",
      title: "Trademark Registration for Amit Patel",
      description: "Process trademark registration application",
      clientName: "Amit Patel",
      serviceType: "Trademark Registration",
      status: "completed",
      priority: "low",
      dueDate: "2024-03-18",
      assignedTo: "Admin",
      createdDate: "2024-03-10",
    },
    {
      id: "4",
      title: "Company Registration for Sneha Reddy",
      description: "Register private limited company",
      clientName: "Sneha Reddy",
      serviceType: "Company Registration",
      status: "pending",
      priority: "high",
      dueDate: "2024-03-22",
      assignedTo: "Admin",
      createdDate: "2024-03-15",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const handleStatusChange = (taskId: string, newStatus: "pending" | "in-progress" | "completed") => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const statusCounts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Task Manager</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage and track task status with one-click updates</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{statusCounts.pending}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks by title or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`hover:shadow-lg transition-shadow ${isOverdue(task.dueDate) && task.status !== "completed" ? "border-red-200" : ""}`}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority} priority</Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1">{task.status}</span>
                        </Badge>
                        {isOverdue(task.dueDate) && task.status !== "completed" && (
                          <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">{task.clientName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500">Service: {task.serviceType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant={task.status === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(task.id, "pending")}
                    className="w-full sm:w-auto"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </Button>
                  <Button
                    variant={task.status === "in-progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(task.id, "in-progress")}
                    className="w-full sm:w-auto"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    In Progress
                  </Button>
                  <Button
                    variant={task.status === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(task.id, "completed")}
                    className="w-full sm:w-auto"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No tasks found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
