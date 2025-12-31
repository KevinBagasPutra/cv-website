import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.portfolio.deleteMany()
  await prisma.service.deleteMany()
  await prisma.testimonial.deleteMany()

  // Seed Portfolio
  const portfolioData = [
    {
      title: 'Sistem Informasi Penjualan Toko Kayu UD.FR',
      description: 'Sistem informasi penjualan berbasis website dengan metode FIFO untuk manajemen stok dan penjualan toko kayu.',
      technologies: 'Laravel,MySQL,PHP,JavaScript',
      category: 'E-Commerce',
      featured: true
    },
    {
      title: 'Aplikasi Gofood Simple untuk Kantin',
      description: 'Aplikasi pemesanan makanan untuk kantin dengan integrasi WhatsApp untuk order dan pembayaran.',
      technologies: 'PHP,MySQL,WhatsApp API',
      category: 'Mobile App',
      featured: false
    },
    {
      title: 'Sistem Informasi Pengendalian Persediaan Ayam',
      description: 'Sistem informasi penjualan dan pembelian ayam dengan metode EOQ (Economic Order Quantity).',
      technologies: 'PHP,MySQL,JavaScript',
      category: 'Inventory System',
      featured: false
    },
    {
      title: 'Sistem Informasi Apotek Berbasis Web',
      description: 'Sistem manajemen apotek untuk pencatatan penjualan obat dan pengelolaan stok obat.',
      technologies: 'Laravel,MySQL,PHP',
      category: 'Healthcare',
      featured: false
    },
    {
      title: 'Sistem Pakar Kerusakan Mobil',
      description: 'Sistem pakar untuk mendeteksi kerusakan mobil menggunakan metode Naïve Bayes berbasis web.',
      technologies: 'PHP,MySQL,Naïve Bayes',
      category: 'Expert System',
      featured: false
    },
    {
      title: 'Sistem Informasi Pembelajaran Daring',
      description: 'Platform pembelajaran online untuk guru dan siswa dengan fitur materi, tugas, dan ujian.',
      technologies: 'Laravel,MySQL,PHP',
      category: 'Education',
      featured: false
    }
  ]

  for (const project of portfolioData) {
    await prisma.portfolio.create({ data: project })
  }
  console.log('✅ Portfolio seeded')

  // Seed Services
  const servicesData = [
    {
      title: 'Company Profile Website',
      description: 'Website profesional untuk mempresentasikan perusahaan Anda dengan desain modern dan responsif.',
      price: 'Mulai Rp 3.000.000',
      features: 'Responsive Design,SEO Optimization,Contact Form,Social Media Integration,3 Months Support'
    },
    {
      title: 'Website UMKM',
      description: 'Website untuk UMKM dengan fitur katalog produk dan sistem pemesanan online.',
      price: 'Mulai Rp 2.500.000',
      features: 'Product Catalog,Order System,WhatsApp Integration,Admin Panel,Training Included'
    },
    {
      title: 'Sistem Informasi',
      description: 'Sistem informasi khusus sesuai kebutuhan bisnis Anda untuk efisiensi operasional.',
      price: 'Mulai Rp 5.000.000',
      features: 'Custom Features,Database Design,User Management,Report Generation,1 Year Support'
    },
    {
      title: 'Website Maintenance',
      description: 'Layanan perawatan website untuk memastikan website Anda selalu update dan berjalan lancar.',
      price: 'Mulai Rp 500.000/bulan',
      features: 'Regular Updates,Security Monitoring,Backup,Performance Optimization,Technical Support'
    }
  ]

  for (const service of servicesData) {
    await prisma.service.create({ data: service })
  }
  console.log('✅ Services seeded')

  // Seed Testimonials
  const testimonialsData = [
    {
      name: 'Ahmad Faisal',
      company: 'Toko Kayu UD.FR',
      role: 'Owner',
      content: 'Sistem informasi yang dibuat sangat membantu dalam manajemen stok dan penjualan. Fitur FIFO sangat berguna untuk bisnis kami.',
      rating: 5,
      featured: true
    },
    {
      name: 'Siti Rahayu',
      company: 'Klinik Gigi Sehat',
      role: 'Manager',
      content: 'Sistem pendataan pasien sangat rapi dan mudah digunakan. Timnya sangat profesional dan responsif.',
      rating: 5,
      featured: true
    },
    {
      name: 'Budi Santoso',
      company: 'Micro Electronics',
      role: 'IT Manager',
      content: 'Kerja sama yang sangat baik dalam mendukung infrastruktur IT perusahaan. Sangat direkomendasikan!',
      rating: 5,
      featured: true
    }
  ]

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({ data: testimonial })
  }
  console.log('✅ Testimonials seeded')

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@kevinbagasputra.com',
      name: 'Kevin Bagas Putra',
      password: 'admin123', // In production, this should be hashed
      role: 'admin'
    }
  })
  console.log('✅ Admin user created')

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
