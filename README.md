# My CV - Professional Portfolio Website

## Project Overview
A professional portfolio website for Kevin Bagas Putra, S.Kom - a Freelance Web Developer specializing in Laravel and MySQL development.

## Technologies Used

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Lucide React** - Beautiful and consistent icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **SQLite** - Embedded database (can be migrated to MySQL/PostgreSQL)

### Other Tools
- **ESLint** - Code linting and formatting
- **GitHub** - Version control and deployment

## Features Implemented

### 1. Main Landing Page (/)
- **Hero Section**
  - Professional avatar with initials "KB"
  - Name and tagline
  - CTA buttons: "Hire Me", "View Portfolio", "WhatsApp"
  - Contact information (Email, Phone, Location)
  - "Available for Hire" badge

- **Navigation**
  - Fixed header with smooth scroll navigation
  - Mobile-responsive hamburger menu
  - Sticky navigation bar with backdrop blur

- **About Me Section**
  - Professional profile summary
  - Education details (STMIK Indonesia Padang)
  - Achievements (GPA, Certificates)
  - Work Experience timeline

- **Skills Section**
  - Backend Development: PHP, Laravel, MySQL, PostgreSQL, SQL Server
  - Frontend Development: HTML, CSS, JavaScript, Tailwind CSS
  - Networking & Infrastructure: LAN/WAN, Server Management, Cloud, Security
  - Other Skills: Data Analytics, Adobe Premiere, Photoshop, Canva
  - Progress bars for skill levels
  - Soft Skills badges

- **Portfolio Section**
  - 6 featured projects
  - Project cards with title, description, technologies
  - Category badges and featured indicators
  - Responsive grid layout

- **Services Section**
  - Company Profile Website
  - Website UMKM
  - Sistem Informasi
  - Website Maintenance
  - Price displays
  - Feature lists with checkmarks

- **Testimonials Section**
  - Client testimonials with ratings
  - 5-star rating system
  - Company and role information

- **Contact Form**
  - Form fields: Name, Email, Phone, Website Type, Description
  - Client-side validation
  - Success/error alerts
  - Form submission to backend API

- **Footer**
  - Quick links
  - Contact information
  - Social media links (WhatsApp, GitHub, LinkedIn)
  - Copyright notice

### 2. Backend API Routes

#### Contact API (`/api/contact`)
**Methods:**
- `GET` - Fetch all contact form submissions
- `POST` - Submit new contact form

**Validation:**
- Name, email, website type, and description are required
- Email format validation
- Phone is optional

**Features:**
- Form data stored in SQLite database
- Response with success/error messages
- Timestamps for each submission

#### Portfolio API (`/api/portfolio`)
**Methods:**
- `GET` - Fetch all portfolio items
- `POST` - Create new portfolio item

**Fields:**
- Title
- Description
- Technologies (comma-separated)
- Image URL (optional)
- Project URL (optional)
- Category
- Featured flag

#### Portfolio Item API (`/api/portfolio/[id]`)
**Methods:**
- `GET` - Fetch single portfolio item
- `PUT` - Update portfolio item
- `DELETE` - Delete portfolio item

#### Services API (`/api/services`)
**Methods:**
- `GET` - Fetch all active services
- `POST` - Create new service

**Fields:**
- Title
- Description
- Price
- Features (comma-separated)
- Icon (optional)
- Active flag

#### Service Item API (`/api/services/[id]`)
**Methods:**
- `GET` - Fetch single service
- `PUT` - Update service
- `DELETE` - Delete service

#### Testimonials API (`/api/testimonials`)
**Methods:**
- `GET` - Fetch all testimonials
- `POST` - Create new testimonial

**Fields:**
- Name
- Company (optional)
- Role (optional)
- Content
- Rating (1-5 stars)
- Image URL (optional)
- Featured flag

#### Testimonial Item API (`/api/testimonials/[id]`)
**Methods:**
- `GET` - Fetch single testimonial
- `PUT` - Update testimonial
- `DELETE` - Delete testimonial

### 3. Admin Panel (`/admin`)

**Features:**
- Tabbed interface for managing different content types
- **Contacts Tab**
  - View all contact form submissions
  - Status badges (pending, contacted, completed)
  - Date tracking
  - Update contact status

- **Portfolio Tab**
  - View all portfolio projects
  - Add new project dialog
  - Edit existing projects
  - Delete projects with confirmation
  - Technology tags display
  - Featured flag management

- **Services Tab**
  - View all services
  - Add new service dialog
  - Edit existing services
  - Delete services with confirmation
  - Active/Inactive status
  - Price display
  - Feature list management

- **Testimonials Tab**
  - View all testimonials
  - Add new testimonial dialog
  - Edit existing testimonials
  - Delete testimonials with confirmation
  - Star rating display
  - Featured flag management
  - Client and company information

### 4. Database Schema

#### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  role      String   @default("user") // admin or user
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Contact Model
```prisma
model Contact {
  id            String   @id @default(cuid())
  name          String
  email         String
  phone         String?
  websiteType   String
  description   String
  status        String   @default("pending") // pending, contacted, completed
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### Portfolio Model
```prisma
model Portfolio {
  id          String   @id @default(cuid())
  title       String
  description String
  technologies String
  imageUrl    String?
  projectUrl  String?
  category    String
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Service Model
```prisma
model Service {
  id          String   @id @default(cuid())
  title       String
  description String
  price       String?
  features    String
  icon        String?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Testimonial Model
```prisma
model Testimonial {
  id          String   @id @default(cuid())
  name        String
  company     String?
  role        String?
  content     String
  rating      Int      @default(5)
  imageUrl    String?
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 5. SEO Optimization

#### Metadata (layout.tsx)
- Title tag optimized for search engines
- Meta description with keywords
- Open Graph tags for social media sharing
- Twitter Card tags
- Robots meta tags
- Google Search Console verification ready
- Language set to Indonesian (id)

#### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://kevinbagasputra.github.io/my-cv/sitemap.xml
```

#### sitemap.xml
- URL listing for search engines
- Last modification dates
- Change frequency settings
- Priority settings

### 6. WhatsApp Integration

**Features:**
- Direct WhatsApp link in hero section
- WhatsApp icon in footer
- Pre-filled message for consultations
- Phone number: +62 896-6666-4656
- Custom message: "Halo, saya ingin konsultasi mengenai pembuatan website"

### 7. Security Features

- Input validation on all forms
- XSS prevention through React
- CSRF protection (built into Next.js)
- SQL injection prevention (via Prisma ORM)
- Secure API endpoints

### 8. Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly buttons (minimum 44px)
- Hamburger menu for mobile
- Responsive grid layouts
- Flexible padding and spacing

### 9. Performance Optimization

- Lazy loading images
- Code splitting (Next.js automatic)
- Optimized fonts (Geist Sans & Mono)
- CSS-in-JS with Tailwind
- Efficient re-renders with React hooks

## Project Structure

```
my-project/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js               # Database seed script
├── public/
│   ├── robots.txt              # SEO: Search engine directives
│   └── sitemap.xml            # SEO: Site map
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── contact/
│   │   │   │   └── route.ts
│   │   │   ├── portfolio/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── services/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── testimonials/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── admin/
│   │   │   └── page.tsx         # Admin panel
│   │   ├── layout.tsx           # Root layout with SEO
│   │   ├── page.tsx             # Main landing page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/
│   │   └── use-toast.ts        # Toast notification hook
│   ├── lib/
│   │   ├── db.ts                # Prisma client
│   │   └── utils.ts            # Utility functions
│   └── styles/
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts          # Tailwind configuration
└── next.config.mjs             # Next.js configuration
```

## Installation & Setup

### Prerequisites
- Node.js 18+ or Bun runtime
- Package manager (npm, yarn, or bun)

### Installation Steps

1. **Clone or Download Project**
   ```bash
   git clone <repository-url>
   cd my-project
   ```

2. **Install Dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Setup Environment Variables**
   Create `.env` file:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Initialize Database**
   ```bash
   bun run db:push
   bun run db:seed
   ```

5. **Start Development Server**
   ```bash
   bun run dev
   ```

6. **Access Application**
   - Open http://localhost:3000
   - Admin panel: http://localhost:3000/admin

## Database Management

### Migrations
```bash
# Push schema to database
bun run db:push

# Create migration
bun run db:migrate

# Reset database
bun run db:reset
```

### Seeding Data
```bash
# Run seed script to populate initial data
bun run db:seed
```

The seed script includes:
- 6 Portfolio projects
- 4 Services
- 3 Testimonials
- 1 Admin user (admin@kevinbagasputra.com / admin123)

## Deployment Guide

### Production Build
```bash
bun run build
```

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### Deployment Options

1. **Vercel** (Recommended for Next.js)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod
   ```

3. **Self-hosted (VPS)**
   ```bash
   # Build and start
   bun run build
   bun run start
   ```

## API Documentation

### Contact Form

**POST /api/contact**
```json
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+62 812 3456 7890",
  "websiteType": "Company Profile",
  "description": "I need a website for my company..."
}

Response:
{
  "message": "Contact form submitted successfully",
  "contact": {
    "id": "clxxxxx",
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

### Portfolio CRUD

**POST /api/portfolio**
```json
Request Body:
{
  "title": "My Project",
  "description": "Project description...",
  "technologies": ["Laravel", "MySQL", "PHP", "JavaScript"],
  "imageUrl": "https://example.com/image.jpg",
  "projectUrl": "https://example.com",
  "category": "E-Commerce",
  "featured": true
}
```

**PUT /api/portfolio/[id]**
```json
Request Body:
{
  "title": "Updated Title",
  "description": "Updated description...",
  ...
}
```

**DELETE /api/portfolio/[id]**
- Returns: `{ "message": "Portfolio item deleted successfully" }`

## Customization

### Changing Colors
Edit `tailwind.config.ts` and update the `primary` color:
```typescript
{
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(222.2, 47.4%, 11.2%)',
          foreground: 'hsl(210, 40%, 98%)',
          ...
        }
      }
    }
  }
}
```

### Adding New Content

1. **Portfolio Projects**: Use admin panel or directly in database
2. **Services**: Use admin panel to add/edit services
3. **Testimonials**: Collect from clients and add via admin

## Maintenance

### Regular Tasks
- Update portfolio with new projects
- Respond to contact form submissions
- Update testimonials from clients
- Review and update SEO metadata
- Check analytics and user feedback

### Performance Monitoring
- Monitor page load times
- Check for broken links
- Review form submission rates
- Track conversion metrics

## Future Enhancements

### Potential Features
1. **Authentication System**
   - Login with NextAuth.js
   - Protected admin routes
   - Role-based access control

2. **Multi-language Support**
   - English/Indonesian toggle
   - Content translation

3. **Blog Section**
   - Technical articles
   - Case studies
   - Development tips

4. **Advanced Analytics**
   - Visitor tracking
   - Page view analytics
   - Conversion tracking

5. **Client Portal**
   - Dashboard for clients to view project status
   - Document sharing
   - Communication hub

## Troubleshooting

### Common Issues

**Dev server not reflecting changes:**
```bash
# Clear Next.js cache
rm -rf .next
# Restart dev server
bun run dev
```

**Database connection issues:**
```bash
# Regenerate Prisma client
bun run db:generate
# Check DATABASE_URL in .env
```

**Build errors:**
```bash
# Check TypeScript compilation
bun run lint
# Verify all imports are correct
```

## Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Community
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Prisma Discord](https://pris.ly/discord)
- [React Community](https://react.dev/community)

## License

© 2025 Kevin Bagas Putra. All rights reserved.

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Prisma](https://www.prisma.io/)
