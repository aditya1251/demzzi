"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, DollarSign, Percent, CheckCircle } from "lucide-react"

interface PricingPlan {
  id: string
  serviceName: string
  category: string
  basePrice: number
  discountedPrice: number
  discountPercentage: number
  features: string[]
  isActive: boolean
  description: string
}

export function PricingManager() {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([
    {
      id: "1",
      serviceName: "GST Registration",
      category: "Tax Services",
      basePrice: 3999,
      discountedPrice: 2999,
      discountPercentage: 25,
      features: ["Quick Processing", "Expert Guidance", "Document Support", "Follow-up Support"],
      isActive: true,
      description: "Complete GST registration service with expert guidance",
    },
    {
      id: "2",
      serviceName: "ITR Filing",
      category: "Tax Services",
      basePrice: 1999,
      discountedPrice: 1499,
      discountPercentage: 25,
      features: ["All ITR Forms", "Tax Optimization", "Refund Tracking", "Expert Review"],
      isActive: true,
      description: "Professional income tax return filing service",
    },
    {
      id: "3",
      serviceName: "Trademark Registration",
      category: "Legal Services",
      basePrice: 11999,
      discountedPrice: 8999,
      discountPercentage: 25,
      features: ["Brand Protection", "Legal Support", "Renewal Reminders", "Certificate Delivery"],
      isActive: true,
      description: "Complete trademark registration and protection service",
    },
  ])

  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const categories = ["Tax Services", "Legal Services", "Business Services", "Compliance Services", "Other"]

  const handleAddPlan = () => {
    setEditingPlan({
      id: "",
      serviceName: "",
      category: "Tax Services",
      basePrice: 0,
      discountedPrice: 0,
      discountPercentage: 0,
      features: [""],
      isActive: true,
      description: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditPlan = (plan: PricingPlan) => {
    setEditingPlan({ ...plan })
    setIsDialogOpen(true)
  }

  const handleSavePlan = () => {
    if (!editingPlan) return

    // Calculate discount percentage
    const discountPercentage =
      editingPlan.basePrice > 0
        ? Math.round(((editingPlan.basePrice - editingPlan.discountedPrice) / editingPlan.basePrice) * 100)
        : 0

    const updatedPlan = { ...editingPlan, discountPercentage }

    if (editingPlan.id) {
      // Update existing plan
      setPricingPlans(pricingPlans.map((p) => (p.id === editingPlan.id ? updatedPlan : p)))
    } else {
      // Add new plan
      const newPlan = {
        ...updatedPlan,
        id: Date.now().toString(),
      }
      setPricingPlans([...pricingPlans, newPlan])
    }

    setIsDialogOpen(false)
    setEditingPlan(null)
  }

  const handleDeletePlan = (id: string) => {
    setPricingPlans(pricingPlans.filter((p) => p.id !== id))
  }

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingPlan) return
    const newFeatures = [...editingPlan.features]
    newFeatures[index] = value
    setEditingPlan({ ...editingPlan, features: newFeatures })
  }

  const addFeature = () => {
    if (!editingPlan) return
    setEditingPlan({ ...editingPlan, features: [...editingPlan.features, ""] })
  }

  const removeFeature = (index: number) => {
    if (!editingPlan) return
    const newFeatures = editingPlan.features.filter((_, i) => i !== index)
    setEditingPlan({ ...editingPlan, features: newFeatures })
  }

  const categoryTotals = categories
    .map((category) => ({
      category,
      count: pricingPlans.filter((p) => p.category === category).length,
      avgPrice:
        pricingPlans.filter((p) => p.category === category).length > 0
          ? Math.round(
              pricingPlans.filter((p) => p.category === category).reduce((sum, p) => sum + p.discountedPrice, 0) /
                pricingPlans.filter((p) => p.category === category).length,
            )
          : 0,
    }))
    .filter((item) => item.count > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Pricing Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Set and update service pricing with discount management</p>
        </div>
        <Button onClick={handleAddPlan} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Pricing Plan
        </Button>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categoryTotals.map((item) => (
          <Card key={item.category}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                  <p className="text-lg font-bold text-gray-800">{item.count} services</p>
                  <p className="text-sm text-green-600">Avg: ₹{item.avgPrice.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {pricingPlans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{plan.serviceName}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{plan.category}</p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {plan.discountPercentage > 0 && (
                      <span className="text-lg text-gray-500 line-through">₹{plan.basePrice.toLocaleString()}</span>
                    )}
                    <span className="text-3xl font-bold text-green-600">₹{plan.discountedPrice.toLocaleString()}</span>
                  </div>
                  {plan.discountPercentage > 0 && (
                    <Badge className="bg-red-100 text-red-800 mt-2">
                      <Percent className="w-3 h-3 mr-1" />
                      {plan.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 text-center">{plan.description}</p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800 text-sm">Features:</h4>
                  <ul className="space-y-1">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-sm text-gray-500">+{plan.features.length - 4} more features</li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-gray-500">ID: {plan.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Pricing Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingPlan?.id ? "Edit Pricing Plan" : "Add New Pricing Plan"}
            </DialogTitle>
          </DialogHeader>

          {editingPlan && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Service Name</Label>
                  <Input
                    value={editingPlan.serviceName}
                    onChange={(e) => setEditingPlan({ ...editingPlan, serviceName: e.target.value })}
                    placeholder="Enter service name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>
                  <Select
                    value={editingPlan.category}
                    onValueChange={(value) => setEditingPlan({ ...editingPlan, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  placeholder="Enter service description"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Base Price (₹)</Label>
                  <Input
                    type="number"
                    value={editingPlan.basePrice}
                    onChange={(e) => setEditingPlan({ ...editingPlan, basePrice: Number(e.target.value) })}
                    placeholder="Enter base price"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Discounted Price (₹)</Label>
                  <Input
                    type="number"
                    value={editingPlan.discountedPrice}
                    onChange={(e) => setEditingPlan({ ...editingPlan, discountedPrice: Number(e.target.value) })}
                    placeholder="Enter discounted price"
                  />
                </div>
              </div>

              {editingPlan.basePrice > 0 && editingPlan.discountedPrice > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Discount:{" "}
                    {Math.round(((editingPlan.basePrice - editingPlan.discountedPrice) / editingPlan.basePrice) * 100)}%
                    {editingPlan.discountedPrice > editingPlan.basePrice && (
                      <span className="text-red-600 ml-2">⚠️ Discounted price is higher than base price</span>
                    )}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Features</Label>
                {editingPlan.features.map((feature, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter feature"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={editingPlan.features.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature} className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingPlan.isActive}
                  onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isActive">Pricing plan is active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePlan} className="bg-green-600 hover:bg-green-700">
                  Save Pricing Plan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
