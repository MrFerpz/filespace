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

module.exports = { prisma, createUser }
