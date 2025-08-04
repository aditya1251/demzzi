import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

type Context = {
  params: {
    id: string
  }
}

export async function GET(_req: Request, { params }: Context) {
  const { id } = params

  // Optional: verify the request is not soft-deleted
  const request = await prisma.request.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  })

  if (!request) {
    return NextResponse.json({ error: "Request not found or has been deleted" }, { status: 404 })
  }

  const submissions = await prisma.submission.findMany({
    where: {
      requestId: id,
      isDeleted: false, // 🧹 exclude soft-deleted submissions
    },
    orderBy: {
      submittedAt: "desc",
    },
  })

  const formatted = submissions.map((submission) => ({
    service: submission.serviceId,
    submittedAt: submission.submittedAt.toLocaleString(),
    formData: submission.formData,
  }))

  return NextResponse.json({ submissions: formatted })
}
