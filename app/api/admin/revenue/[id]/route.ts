import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

interface Context {
  params: { id: string }
}

// PATCH — update a single revenue entry
export async function PATCH(req: Request, { params }: Context) {
  const { id } = params
  const data = await req.json()
  const { amount, label, note, createdAt, source, userId } = data

  try {
    // Optional: Prevent updating soft-deleted entries
    const existing = await prisma.revenue.findUnique({
      where: { id },
    })

    if (!existing || existing.isDeleted) {
      return NextResponse.json({ error: "Revenue entry not found or deleted" }, { status: 404 })
    }

    const updated = await prisma.revenue.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(label !== undefined && { label }),
        ...(note !== undefined && { note }),
        ...(createdAt !== undefined && { createdAt: new Date(createdAt) }),
        ...(source !== undefined && { source }),
        ...(userId !== undefined && { userId }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update revenue:", error)
    return NextResponse.json({ error: "Failed to update revenue" }, { status: 500 })
  }
}

// DELETE — soft-delete a revenue entry by ID
export async function DELETE(_req: Request, { params }: Context) {
  const { id } = params

  try {
    await prisma.revenue.update({
      where: { id },
      data: { isDeleted: true },
    })

    return NextResponse.json({ message: "Revenue entry soft-deleted" })
  } catch (error) {
    console.error("Failed to soft-delete revenue:", error)
    return NextResponse.json({ error: "Failed to delete revenue" }, { status: 500 })
  }
}
