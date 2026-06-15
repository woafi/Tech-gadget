import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  /* -------------------- CATEGORIES -------------------- */
  const categoryData = [
    { name: 'Smartphones', description: 'Latest smartphones and mobile devices' },
    { name: 'Laptops', description: 'High-performance laptops and notebooks' },
    { name: 'Headphones', description: 'Premium audio headphones and earbuds' },
    { name: 'Smartwatches', description: 'Smart wearables and fitness trackers' },
    { name: 'Accessories', description: 'Tech accessories and gadgets' },
  ]

  await prisma.category.createMany({
    data: categoryData,
    skipDuplicates: true,
  })

  const categories = await prisma.category.findMany()
  const cat = Object.fromEntries(categories.map(c => [c.name, c.id]))

  /* -------------------- PRODUCTS (20) -------------------- */
  const products = [
    // Smartphones (5)
    {
      name: 'iPhone 15 Pro Max',
      description: 'A17 Pro chip, titanium design',
      price: 1199.99,
      image: '/assets/products/iphone-15-pro.jpg',
      stock: 50,
      brand: 'Apple',
      model: '15 Pro Max',
      categoryId: cat['Smartphones'],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: '200MP camera with S Pen',
      price: 1299.99,
      image: '/assets/products/samsung-s24.jpg',
      stock: 45,
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      categoryId: cat['Smartphones'],
    },
    {
      name: 'Google Pixel 8 Pro',
      description: 'Tensor G3 AI photography',
      price: 999.99,
      image: '/assets/products/pixel-8-pro.jpg',
      stock: 40,
      brand: 'Google',
      model: 'Pixel 8 Pro',
      categoryId: cat['Smartphones'],
    },
    {
      name: 'OnePlus 12',
      description: 'Snapdragon 8 Gen 3 flagship',
      price: 799.99,
      image: '/assets/products/oneplus-12.jpg',
      stock: 35,
      brand: 'OnePlus',
      model: '12',
      categoryId: cat['Smartphones'],
    },
    {
      name: 'Xiaomi 14 Pro',
      description: 'Leica-powered premium phone',
      price: 899.99,
      image: '/assets/products/xiaomi-14-pro.jpg',
      stock: 30,
      brand: 'Xiaomi',
      model: '14 Pro',
      categoryId: cat['Smartphones'],
    },

    // Laptops (5)
    {
      name: 'MacBook Pro M3 16"',
      description: 'Apple M3 performance laptop',
      price: 2499.99,
      image: '/assets/products/macbook-pro-m3.jpg',
      stock: 30,
      brand: 'Apple',
      model: 'M3 16"',
      categoryId: cat['Laptops'],
    },
    {
      name: 'Dell XPS 15',
      description: '4K OLED premium Windows laptop',
      price: 1899.99,
      image: '/assets/products/dell-xps-15.jpg',
      stock: 25,
      brand: 'Dell',
      model: 'XPS 15',
      categoryId: cat['Laptops'],
    },
    {
      name: 'ASUS ROG Zephyrus G14',
      description: 'Gaming laptop Ryzen 9',
      price: 1699.99,
      image: '/assets/products/asus-rog-g14.jpg',
      stock: 20,
      brand: 'ASUS',
      model: 'G14',
      categoryId: cat['Laptops'],
    },
    {
      name: 'HP Spectre x360',
      description: 'Premium 2-in-1 laptop',
      price: 1599.99,
      image: '/assets/products/hp-spectre-x360.jpg',
      stock: 22,
      brand: 'HP',
      model: 'Spectre x360',
      categoryId: cat['Laptops'],
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      description: 'Business ultrabook',
      price: 1799.99,
      image: '/assets/products/lenovo-x1.jpg',
      stock: 28,
      brand: 'Lenovo',
      model: 'X1 Carbon',
      categoryId: cat['Laptops'],
    },

    // Headphones (4)
    {
      name: 'Sony WH-1000XM5',
      description: 'Industry-leading ANC',
      price: 399.99,
      image: '/assets/products/sony-wh1000xm5.jpg',
      stock: 60,
      brand: 'Sony',
      model: 'WH-1000XM5',
      categoryId: cat['Headphones'],
    },
    {
      name: 'AirPods Pro 2',
      description: 'Apple ANC earbuds',
      price: 249.99,
      image: '/assets/products/airpods-pro.jpg',
      stock: 80,
      brand: 'Apple',
      model: 'Pro 2',
      categoryId: cat['Headphones'],
    },
    {
      name: 'Bose QuietComfort Ultra',
      description: 'Immersive audio experience',
      price: 429.99,
      image: '/assets/products/bose-qc.jpg',
      stock: 35,
      brand: 'Bose',
      model: 'QC Ultra',
      categoryId: cat['Headphones'],
    },
    {
      name: 'Sennheiser Momentum 4',
      description: 'Audiophile wireless sound',
      price: 379.99,
      image: '/assets/products/sennheiser-m4.jpg',
      stock: 25,
      brand: 'Sennheiser',
      model: 'Momentum 4',
      categoryId: cat['Headphones'],
    },

    // Smartwatches (3)
    {
      name: 'Apple Watch Series 9',
      description: 'Advanced health features',
      price: 399.99,
      image: '/assets/products/apple-watch.jpg',
      stock: 55,
      brand: 'Apple',
      model: 'Series 9',
      categoryId: cat['Smartwatches'],
    },
    {
      name: 'Samsung Galaxy Watch 6',
      description: 'Fitness and sleep tracking',
      price: 299.99,
      image: '/assets/products/galaxy-watch.jpg',
      stock: 40,
      brand: 'Samsung',
      model: 'Watch 6',
      categoryId: cat['Smartwatches'],
    },
    {
      name: 'Garmin Fenix 7',
      description: 'Rugged multisport watch',
      price: 699.99,
      image: '/assets/products/garmin-fenix.jpg',
      stock: 20,
      brand: 'Garmin',
      model: 'Fenix 7',
      categoryId: cat['Smartwatches'],
    },

    // Accessories (3)
    {
      name: 'Anker PowerCore 20000',
      description: 'High-capacity power bank',
      price: 49.99,
      image: '/assets/products/anker.jpg',
      stock: 100,
      brand: 'Anker',
      model: '20000',
      categoryId: cat['Accessories'],
    },
    {
      name: 'Logitech MX Master 3S',
      description: 'Ergonomic wireless mouse',
      price: 99.99,
      image: '/assets/products/logitech-mx.jpg',
      stock: 70,
      brand: 'Logitech',
      model: '3S',
      categoryId: cat['Accessories'],
    },
    {
      name: 'Belkin USB-C Hub 7-in-1',
      description: 'Multiport USB-C adapter',
      price: 59.99,
      image: '/assets/products/belkin.jpg',
      stock: 120,
      brand: 'Belkin',
      model: '7-in-1',
      categoryId: cat['Accessories'],
    },
  ]

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  })

  /* -------------------- DEMO USER -------------------- */
//   const hashed = await bcrypt.hash('Demo123!', 10)

//   await prisma.user.upsert({
//     where: { email: 'demo@example.com' },
//     update: {},
//     create: {
//       email: 'demo@example.com',
//       password: hashed,
//       name: 'Demo User',
//     },
//   })

  console.log('✅ Seed completed successfully')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
