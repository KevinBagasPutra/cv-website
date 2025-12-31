import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Check password (in production, use bcrypt!)
    // Note: For demo purposes, direct comparison. In production, use bcrypt.compare()
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin yang dapat login.' },
        { status: 403 }
      )
    }

    // Create response with user data (exclude password)
    const { password: _, ...userWithoutPassword } = user

    // Create response
    const response = NextResponse.json({
      message: 'Login berhasil',
      user: userWithoutPassword
    })

    // Set cookie for session (simple demo)
    response.cookies.set('admin_session', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Gagal login. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
