const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function createUser(username, email, password) {
  return await prisma.User.create({
    data: {
      name: username,
      email: email,
      password: password
    }
  })
}

async function findUser(email) {
    const user = await prisma.User.findUnique({
        where: {
            email: email,
        }
    })
    return user
}

module.exports = { prisma, createUser, findUser }
