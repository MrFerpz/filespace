const prismaClient = require('../db/prisma');
const bcrypt = require('bcryptjs');

// GET requests
function indexPageGet(req, res) {
    res.render("index", {message: "Hello there!"})
}

function signUpPageGet(req, res) {
    res.render("signup")
}

function loginPageGet(req, res) {
    res.render("login")
}

function loginFailPageGet(req, res) {
    res.render("login-fail")
}

function loginSuccessPageGet(req, res) {
    res.render("login-success")
}

async function foldersPageGet(req, res) {
    const authorID = req.user.id;
    const folders = await prismaClient.getFolders(authorID);
    res.render("folders", {folders: folders});
}

function filesPageGet(req, res) {
    const title = req.params.foldername;
    res.render("files",
    // replace with DB call shortly
    {files: ["bob paisley"],
    title: title})
}

//---------------------------//

// POST requests
async function userSignUpPost(req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, 10);
    try {
        prismaClient.createUser(username, email, password);
    } catch(error) {
        console.log(error);
        const message = "Sorry, you couldn't sign up this time."
        res.render("index", {message: message});
    }
    const message = "Successfully signed up.";
    res.render("index", {message: message});
}

async function newFolderPost(req, res) {
    const authorID = req.user.id;
    const title = req.body.title;

    await prismaClient.newFolder(authorID, title);
    const folders = await prismaClient.getFolders(authorID);
    console.log(folders);
    res.render("folders", {folders: folders});
}

async function folderInfoPageGet(req, res) {
    const folderID = Number(req.params.folderID);
    const folder = await prismaClient.getFolderByID(folderID);
    res.render("folder-info", {folder: folder})
}

async function deleteFolderPost(req, res) {
    const folderID = Number(req.params.folderID);
    const authorID = Number(req.user.id);
    await prismaClient.deleteFolderByID(folderID);
    const folders = await prismaClient.getFolders(authorID);
    res.render("folders", {folders: folders});
}

// async function updateFolderGet(req, res) {

// }

// async function updateFolderPost(req, res) {

// }

module.exports = {
    indexPageGet,
    userSignUpPost,
    signUpPageGet,
    loginPageGet,
    loginFailPageGet,
    loginSuccessPageGet,
    foldersPageGet,
    filesPageGet,
    newFolderPost,
    folderInfoPageGet,
    deleteFolderPost
}