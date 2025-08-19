import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;


    const page = await prisma.servicePageDetails.findUnique({
        where: { serviceId: id },
        include: { content: true },
    });


    const content = (page?.content || []).map((c) => ({
        id: c.id,
        title: c.title,
        content: c.content,
        image: c.image,
        order: c.order,
    }));


    return NextResponse.json({ content });
}