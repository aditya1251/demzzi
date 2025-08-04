import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FieldType } from '@prisma/client';

// GET /api/admin/services/[id]/form
export async function GET(
  req: NextRequest,
  context: { params: { id?: string } }
) {
  const serviceId = context.params?.id;

  if (!serviceId) {
    return NextResponse.json({ error: 'Missing service ID' }, { status: 400 });
  }

  try {
    const fields = await prisma.serviceFormField.findMany({
      where: {
        serviceId,
        isDeleted: false, // ⬅️ exclude soft-deleted fields
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(fields);
  } catch (error) {
    console.error('[GET_FORM_FIELDS]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/admin/services/[id]/form
export async function PUT(
  req: NextRequest,
  context: { params: { id?: string } }
) {
  const serviceId = context.params?.id;

  if (!serviceId) {
    return NextResponse.json({ error: 'Missing service ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { fields } = body;

    if (!Array.isArray(fields)) {
      return NextResponse.json({ error: 'Invalid fields payload' }, { status: 400 });
    }

    await prisma.serviceFormField.deleteMany({
      where: { serviceId },
    });

    // Create new fields (they will be marked as isDeleted: false by default)
    await prisma.serviceFormField.createMany({
      data: fields.map((field: any, index: number) => ({
        serviceId,
        label: field.label,
        name: field.name,
        type: field.type as FieldType,
        required: field.required || false,
        placeholder: field.placeholder || '',
        options: field.options || [],
        order: index,
        isFixed: field.isFixed || false,
        isDeleted: false, // explicitly mark as active
      })),
    });

    return NextResponse.json({ message: 'Form updated successfully' });
  } catch (error) {
    console.error('[PUT_FORM_FIELDS]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
