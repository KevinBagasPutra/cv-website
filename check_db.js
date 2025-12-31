import Database from 'bun:sqlite'

const db = new Database('db/custom.db')

console.log('📋 Checking User table...\n')

try {
  // Get all users
  const users = db.query('SELECT * FROM User').all()
  console.log('Total Users:', users.length)
  
  if (users.length > 0) {
    users.forEach((user, index) => {
      console.log(`\nUser #${index + 1}:`)
      console.log('  Email:', user.email)
      console.log('  Name:', user.name)
      console.log('  Password:', user.password)
      console.log('  Role:', user.role)
      console.log('  Created:', user.createdAt)
    })
    
    // Check for admin user
    console.log('\n🔍 Searching for admin@kevinbagasputra.com...')
    const admin = users.find(u => u.email === 'admin@kevinbagasputra.com')
    
    if (admin) {
      console.log('\n✅ Admin User FOUND!')
      console.log('  Email:', admin.email)
      console.log('  Name:', admin.name)
      console.log('  Password:', admin.password)
      console.log('  Password matches "admin123":', admin.password === 'admin123')
      console.log('  Role:', admin.role)
      console.log('  ID:', admin.id)
    } else {
      console.log('\n❌ Admin User NOT FOUND in database!')
      console.log('  Email "admin@kevinbagasputra.com" does not exist')
    }
  } else {
    console.log('❌ NO USERS in database!')
  }
} catch (error) {
  console.error('❌ Error:', error.message)
}
