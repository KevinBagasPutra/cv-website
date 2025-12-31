import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const service = await db.service.findUnique({
      where: { id }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Fetch service error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PUT update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const service = await db.service.update({
      where: { id },
      data: body
    })

    return NextResponse.json(
      { message: 'Service updated successfully', service }
    )
  } catch (error) {
    console.error('Update service error:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.service.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Service deleted successfully' }
    )
  } catch (error) {
    console.error('Delete service error:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
