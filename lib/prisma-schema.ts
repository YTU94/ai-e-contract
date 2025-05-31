// Prisma Schema 示例
// 在实际项目中，这应该是 prisma/schema.prisma 文件

export const prismaSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String
  company       String?
  image         String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts  Account[]
  sessions  Session[]
  contracts Contract[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Contract {
  id          String        @id @default(cuid())
  title       String
  content     String        @db.Text
  status      ContractStatus @default(DRAFT)
  type        String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  userId      String
  
  user        User          @relation(fields: [userId], references: [id])
  signatures  Signature[]
}

model Signature {
  id         String   @id @default(cuid())
  contractId String
  signerName String
  signerEmail String
  signedAt   DateTime @default(now())
  signature  String   @db.Text
  
  contract   Contract @relation(fields: [contractId], references: [id])
}

enum UserRole {
  USER
  ADMIN
}

enum ContractStatus {
  DRAFT
  PENDING
  SIGNED
  COMPLETED
  CANCELLED
}
`
