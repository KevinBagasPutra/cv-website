import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated (simple check via cookie)
    const session = request.cookies.get('admin_session')

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all contacts
    const contacts = await db.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Fetch contacts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}
