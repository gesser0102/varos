import { PrismaClient, UserType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Limpar dados existentes
  await prisma.consultorClient.deleteMany()
  await prisma.user.deleteMany()

  // Criar consultores
  const consultor1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '(11) 98765-4321',
      userType: UserType.CONSULTOR,
    },
  })

  const consultor2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'janesmith@gmail.com',
      phone: '(21) 91234-5678',
      userType: UserType.CONSULTOR,
    },
  })

  console.log('✅ Consultores criados')

  // Criar clientes
  const clientes = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Maria Silva',
        email: 'maria.silva@email.com',
        phone: '(11) 91234-5678',
        userType: UserType.CLIENTE,
        cpf: '123.456.789-00',
        age: 28,
        cep: '01310-100',
        state: 'SP',
        address: 'Av. Paulista, 1000',
        complement: 'Apto 501',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Pedro Santos',
        email: 'pedro.santos@email.com',
        phone: '(11) 98765-4321',
        userType: UserType.CLIENTE,
        cpf: '234.567.890-11',
        age: 35,
        cep: '04551-010',
        state: 'SP',
        address: 'Rua dos Três Irmãos, 500',
        complement: 'Casa 2',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        phone: '(21) 91234-8765',
        userType: UserType.CLIENTE,
        cpf: '345.678.901-22',
        age: 42,
        cep: '20040-020',
        state: 'RJ',
        address: 'Av. Rio Branco, 200',
        complement: 'Sala 1002',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@email.com',
        phone: '(11) 97654-3210',
        userType: UserType.CLIENTE,
        cpf: '456.789.012-33',
        age: 31,
        cep: '01414-001',
        state: 'SP',
        address: 'Rua Augusta, 1500',
        complement: 'Loja 3',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Juliana Ferreira',
        email: 'juliana.ferreira@email.com',
        phone: '(21) 98765-1234',
        userType: UserType.CLIENTE,
        cpf: '567.890.123-44',
        age: 26,
        cep: '22640-102',
        state: 'RJ',
        address: 'Av. Atlântica, 3000',
        complement: 'Cobertura',
      },
    }),
  ])

  console.log('✅ Clientes criados')

  // Criar relacionamentos consultor-cliente
  await prisma.consultorClient.createMany({
    data: [
      { consultorId: consultor1.id, clientId: clientes[0].id },
      { consultorId: consultor1.id, clientId: clientes[1].id },
      { consultorId: consultor1.id, clientId: clientes[2].id },
      { consultorId: consultor2.id, clientId: clientes[3].id },
      { consultorId: consultor2.id, clientId: clientes[4].id },
    ],
  })

  console.log('✅ Relacionamentos criados')
  console.log('\n🎉 Seed completed successfully!')
  console.log(`\n📊 Summary:`)
  console.log(`   - ${2} Consultores`)
  console.log(`   - ${5} Clientes`)
  console.log(`   - ${5} Relacionamentos\n`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
