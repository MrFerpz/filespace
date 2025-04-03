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

async function newFolder(authorID, title) {
  return await prisma.folders.create({
    data: {
      title: title,
      authorID: authorID
    }
  })
}

async function getFolders(authorID) {
  const folders = await prisma.folders.findMany({
    where: {authorID: authorID}
  })
  return folders
}

module.exports = { prisma, createUser, findUser, getUserByID, getFolders, newFolder }
