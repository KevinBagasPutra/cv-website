import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single contact
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = request.cookies.get('admin_session')
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const contact = await db.contact.findUnique({
      where: { id }
    })

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Fetch contact error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

// PUT update contact (status)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = request.cookies.get('admin_session')
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const contact = await db.contact.update({
      where: { id },
      data: {
        status: body.status || 'pending',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Contact status updated successfully',
      contact
    })
  } catch (error) {
    console.error('Update contact error:', error)
    return NextResponse.json(
      { error: 'Failed to update contact status' },
      { status: 500 }
    )
  }
}

// DELETE contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated
    const session = request.cookies.get('admin_session')
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    await db.contact.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Contact deleted successfully'
    })
  } catch (error) {
    console.error('Delete contact error:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
