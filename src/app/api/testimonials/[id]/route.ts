import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const testimonial = await db.testimonial.findUnique({
      where: { id }
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Fetch testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

// PUT update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const testimonial = await db.testimonial.update({
      where: { id },
      data: body
    })

    return NextResponse.json(
      { message: 'Testimonial updated successfully', testimonial }
    )
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// DELETE testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.testimonial.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Testimonial deleted successfully' }
    )
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
