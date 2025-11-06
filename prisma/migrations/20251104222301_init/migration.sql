-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CONSULTOR', 'CLIENTE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "userType" "UserType" NOT NULL,
    "cpf" TEXT,
    "age" INTEGER,
    "cep" TEXT,
    "state" TEXT,
    "address" TEXT,
    "complement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultor_clients" (
    "id" TEXT NOT NULL,
    "consultorId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultor_clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE INDEX "users_userType_idx" ON "users"("userType");

-- CreateIndex
CREATE INDEX "consultor_clients_consultorId_idx" ON "consultor_clients"("consultorId");

-- CreateIndex
CREATE INDEX "consultor_clients_clientId_idx" ON "consultor_clients"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "consultor_clients_consultorId_clientId_key" ON "consultor_clients"("consultorId", "clientId");

-- AddForeignKey
ALTER TABLE "consultor_clients" ADD CONSTRAINT "consultor_clients_consultorId_fkey" FOREIGN KEY ("consultorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultor_clients" ADD CONSTRAINT "consultor_clients_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
