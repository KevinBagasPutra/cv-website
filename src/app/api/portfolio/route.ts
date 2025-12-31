import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all portfolio items
export async function GET() {
  try {
    const portfolio = await db.portfolio.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Fetch portfolio error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

// POST new portfolio item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, technologies, imageUrl, projectUrl, category, featured } = body

    // Validate required fields
    if (!title || !description || !technologies || !category) {
      return NextResponse.json(
        { error: 'Title, description, technologies, and category are required' },
        { status: 400 }
      )
    }

    const portfolio = await db.portfolio.create({
      data: {
        title,
        description,
        technologies: Array.isArray(technologies) ? technologies.join(',') : technologies,
        imageUrl: imageUrl || null,
        projectUrl: projectUrl || null,
        category,
        featured: featured || false
      }
    })

    return NextResponse.json(
      { message: 'Portfolio item created successfully', portfolio },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create portfolio error:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    )
  }
}
