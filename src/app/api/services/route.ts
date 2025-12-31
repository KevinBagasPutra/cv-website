import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all services
export async function GET() {
  try {
    const services = await db.service.findMany({
      where: {
        active: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Fetch services error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, features, icon } = body

    // Validate required fields
    if (!title || !description || !features) {
      return NextResponse.json(
        { error: 'Title, description, and features are required' },
        { status: 400 }
      )
    }

    const service = await db.service.create({
      data: {
        title,
        description,
        price: price || null,
        features: Array.isArray(features) ? features.join(',') : features,
        icon: icon || null
      }
    })

    return NextResponse.json(
      { message: 'Service created successfully', service },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
