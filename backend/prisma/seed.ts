import { PrismaClient, userrole_role } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hash('Admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@detaildeal.com' },
    update: {},
    create: {
      login: 'admin',
      password: adminPassword,
      userrole: {
        create: [{ role: userrole_role.ADMIN }]
      },
      fullName: 'Администратор',
      email: 'admin@detaildeal.com',
      isActive: true,
    },
  });

  // Create manager user
  const managerPassword = await hash('Manager123');
  const manager = await prisma.user.upsert({
    where: { email: 'manager@detaildeal.com' },
    update: {},
    create: {
      login: 'manager',
      password: managerPassword,
      userrole: {
        create: [{ role: userrole_role.MANAGER }]
      },
      fullName: 'Менеджер',
      email: 'manager@detaildeal.com',
      isActive: true,
    },
  });

  // Create sample customer
  const customerPassword = await hash('Customer123');
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      login: 'customer',
      password: customerPassword,
      userrole: {
        create: [{ role: userrole_role.CUSTOMER }]
      },
      fullName: 'Иван Петров',
      email: 'customer@example.com',
      phone: '+7 (999) 123-45-67',
      isActive: true,
    },
  });

  // Create sample executor
  const executorPassword = await hash('Executor123');
  const executor = await prisma.user.upsert({
    where: { email: 'executor@example.com' },
    update: {},
    create: {
      login: 'executor',
      password: executorPassword,
      userrole: {
        create: [{ role: userrole_role.EXECUTOR }]
      },
      fullName: 'Алексей Смирнов',
      email: 'executor@example.com',
      phone: '+7 (999) 765-43-21',
      isActive: true,
    },
  });

  // Create executor profile
  const profile = await prisma.profile.upsert({
    where: { userId: executor.id },
    update: {},
    create: {
      userId: executor.id,
      companyName: 'ООО "МеталлПрофи"',
      specializations: JSON.stringify(['Токарные работы', 'Фрезерные работы', 'Сверлильные работы']),
      experience: 15,
      description: 'Профессиональная металлообработка с использованием современного оборудования. Выполняем работы любой сложности.',
      website: 'https://metallprofi.ru  ',
      isPublic: true,
      showContactInfo: true,
      rating: 4.8,
      totalReviews: 25,
      completedDeals: 150,
    },
  });

  // Create sample equipment
  await prisma.equipment.createMany({
    data: [
      {
        profileId: profile.id,
        name: 'Токарный станок CNC',
        type: 'Токарный станок',
        model: 'DMG MORI NLX 2500',
        year: 2020,
        description: 'Современный токарный станок с ЧПУ для высокоточных работ',
        images: JSON.stringify(['equipment1.jpg', 'equipment2.jpg']),
      },
      {
        profileId: profile.id,
        name: 'Фрезерный станок',
        type: 'Фрезерный станок',
        model: 'HAAS VF-2',
        year: 2019,
        description: 'Вертикальный фрезерный станок с ЧПУ',
        images: JSON.stringify(['equipment3.jpg']),
      },
    ],
  });

  // Create sample portfolio items
  await prisma.portfolioItem.createMany({
    data: [
      {
        profileId: profile.id,
        title: 'Деталь для авиационной промышленности',
        description: 'Высокоточная обработка детали из титанового сплава',
        category: 'Авиационная промышленность',
        materials: JSON.stringify(['Титан', 'Титановый сплав']),
        images: JSON.stringify(['portfolio1.jpg', 'portfolio2.jpg']),
      },
      {
        profileId: profile.id,
        title: 'Корпус редуктора',
        description: 'Изготовление корпуса редуктора из алюминиевого сплава',
        category: 'Машиностроение',
        materials: JSON.stringify(['Алюминий', 'Алюминиевый сплав']),
        images: JSON.stringify(['portfolio3.jpg']),
      },
    ],
  });

  // Create sample deal
  const deal = await prisma.deal.create({
    data: {
      customerId: customer.id,
      title: 'Изготовление вала редуктора',
      description: 'Требуется изготовить вал редуктора по чертежу. Материал - сталь 40Х, точность обработки 6-7 квалитет.',
      category: 'Токарные работы',
      materials: JSON.stringify(['Сталь 40Х']),
      specifications: 'Точность обработки 6-7 квалитет, шероховатость Ra 1.6',
      budget: 15000,
      currency: 'RUB',
      estimatedTime: 5,
      location: 'Москва',
      isUrgent: false,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('Test accounts created (login with email):');
  console.log('👤 Admin: admin@detaildeal.com / Admin123');
  console.log('👤 Manager: manager@detaildeal.com / Manager123');
  console.log('👤 Customer: customer@example.com / Customer123');
  console.log('👤 Executor: executor@example.com / Executor123');
  console.log('');
  console.log('You can now start the application and test with these accounts.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
