import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, websiteType, description } = body

    // Validate required fields
    if (!name || !email || !websiteType || !description) {
      return NextResponse.json(
        { error: 'Name, email, website type, and description are required' },
        { status: 400 }
      )
    }

    // Create contact entry
    const contact = await db.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        websiteType,
        description
      }
    })

    return NextResponse.json(
      { message: 'Contact form submitted successfully', contact },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
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
