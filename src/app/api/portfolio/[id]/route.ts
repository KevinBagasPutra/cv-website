import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single portfolio item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const portfolio = await db.portfolio.findUnique({
      where: { id }
    })

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Fetch portfolio item error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio item' },
      { status: 500 }
    )
  }
}

// PUT update portfolio item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const portfolio = await db.portfolio.update({
      where: { id },
      data: body
    })

    return NextResponse.json(
      { message: 'Portfolio item updated successfully', portfolio }
    )
  } catch (error) {
    console.error('Update portfolio error:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    )
  }
}

// DELETE portfolio item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await db.portfolio.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Portfolio item deleted successfully' }
    )
  } catch (error) {
    console.error('Delete portfolio error:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    )
  }
}
