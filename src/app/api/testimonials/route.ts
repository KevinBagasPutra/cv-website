import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all testimonials
export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Fetch testimonials error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, company, role, content, rating, imageUrl, featured } = body

    // Validate required fields
    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      )
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        company: company || null,
        role: role || null,
        content,
        rating: rating || 5,
        imageUrl: imageUrl || null,
        featured: featured || false
      }
    })

    return NextResponse.json(
      { message: 'Testimonial created successfully', testimonial },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
