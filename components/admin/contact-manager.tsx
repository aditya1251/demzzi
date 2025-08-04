"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Mail, Phone, User, Calendar, MessageSquare } from "lucide-react"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdDate: string
  timeAgo: string
}

export function ContactManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/admin/contacts")
        if (!res.ok) throw new Error("Failed to load messages")
        const data = await res.json()
        setMessages(data)
      } catch (error) {
        console.error("Error fetching contact messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const filteredMessages = messages.filter((message) =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Contact Messages</h1>
        <p className="text-sm text-gray-600">Review messages sent through the contact form</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">Loading messages...</CardContent>
          </Card>
        ) : filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">No messages found.</CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{message.subject}</h3>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {message.timeAgo}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedMessage(message)
                      setIsDialogOpen(true)
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {message.message}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl w-full">
          <DialogHeader>
            <DialogTitle className="text-lg">Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  {selectedMessage.name}
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  {selectedMessage.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  {selectedMessage.phone}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  Received: {new Date(selectedMessage.createdDate).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{selectedMessage.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
