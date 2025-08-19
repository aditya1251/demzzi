import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function POST(request: Request, { params }: { params: { id: string } }) {


    const { id } = params;
    const body = await request.json();
    const sections = Array.isArray(body.content) ? body.content : [];
    
    // Upsert a ServicePageDetails row for this serviceId (serviceId is unique in your schema)
    const page = await prisma.servicePageDetails.upsert({
        where: { serviceId: id },
        create: { serviceId: id },
        update: {},
    });


    // Replace existing ContentSection rows for the page in a transaction
    await prisma.$transaction(async (tx) => {
        await tx.contentSection.deleteMany({ where: { pageId: page.id } });


        if (sections.length) {
            // Build createMany payload
            const createMany = sections.map((s: any, idx: number) => ({
                id: s.id, // if id is present and is a proper cuid, Prisma will accept it — otherwise leave undefined
                pageId: page.id,
                title: s.title || `Section ${idx + 1}`,
                content: s.content || { type: 'doc', content: [{ type: 'paragraph' }] },
                image: s.image || null,
                order: s.order ?? idx + 1,
            }));


            // Using createMany for speed. If you need returned rows, use create in a loop.
            await tx.contentSection.createMany({ data: createMany });
        }
    });


    // update Service.updatedAt implicitly by touching the row
    await prisma.service.update({ where: { id }, data: { updatedAt: new Date() } }).catch(() => { });


    return NextResponse.json({ ok: true })
}