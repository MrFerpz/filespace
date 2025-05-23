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
  }
  )
  return folders
}

async function getFolderByID(folderID) {
  const folder = await prisma.folders.findUnique({
    where: {
      id: folderID
    },
    include: {files: true}
  })
  return folder
}

async function deleteFolderByID(folderID) {
  await prisma.folders.delete({
    where : {
      id: folderID
    }
  })
  return
}

async function updateFolderTitle(folderID, newTitle) {
  await prisma.folders.update({
    where : {
      id: folderID
    },
    data : {
      title: newTitle
    }
  })
}

async function getFiles(folderID) {
  const files = await prisma.files.findMany({
    where: { parentFolderID: folderID }
  })
  return files
}

async function getFile(fileName) {
  const file = await prisma.files.findUnique({
    where: { title: fileName }
  })
  return file
}

async function addFile(folderID, userID, file) {
  await prisma.folders.update({
    where: { id: folderID },
    data: {
      files: {
        create: {
          title: file.originalname,
          userID: userID,
          storagePath: `public/${userID}/${file.originalname}`,
          mimeType: file.mimetype,
          size: file.size,
        },
      },
    },
  });
}


module.exports = { 
  prisma,
  createUser,
  findUser,
  getUserByID,
  getFolders,
  newFolder,
  getFolderByID,
  deleteFolderByID,
  updateFolderTitle,
  getFiles,
  getFile,
  addFile
}
