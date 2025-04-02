const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function createUser(username, email, password) {
  return await prisma.user.create({
    data: {
      name: username,
      email: email,
      password: password
    }
  })
}

async function findUser(email) {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    })
    return user
}

// async function flushDB() {
//   await prisma.user.deleteMany({});
// }

async function getUserByID(id) {
  const user = await prisma.user.findUnique({
    where: { id: id }
  })
  return user
}

module.exports = { prisma, createUser, findUser, getUserByID }
