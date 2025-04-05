const prismaClient = require('../db/prisma');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js')

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLIC_ANON_KEY);

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

async function filesPageGet(req, res) {
    const folderID = Number(req.params.folderID);
    const userID = req.user.id;

    // read all files in that folder from supabase
    const { data, error } = await supabase.storage.from('filespace')
    .list(`public/${userID}/${folderID}`, {
        sortBy: { column: 'name', order: 'asc' }});

        if (error) {
            console.log(error)
        }
    
    res.render("files", { files: data, userID: userID, folderID: folderID })
}

async function fileInfoPageGet(req, res) {
    const fileName = req.params.fileName;
    const userID = req.user.id;
    const folderID = req.params.folderID;

    const { data, error } = await supabase.storage.from('filespace').list(`public/${userID}/${folderID}`);

    if (error) {
        console.error(error);
        return res.status(500).send("Could not list files");
    }

    const file = data.find(f => f.name === fileName);
    if (!file) {
        return res.status(404).send("File not found");
    }

    res.render("file-info", { file: file, userID : userID, folderID: folderID });
}

async function updateFilePageGet(req, res) {
    const fileName = req.params.fileName;
    const userID = req.user.id;
    const folderID = req.params.folderID;

    const { data, error } = await supabase.storage.from('filespace').list(`public/${userID}/${folderID}`);

    if (error) {
        console.error(error);
        return res.status(500).send("Could not list files");
    }

    const file = data.find(f => f.name === fileName);
    if (!file) {
        return res.status(404).send("File not found");
    }

    res.render("update-file", { file: file, userID : userID, folderID: folderID })
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

async function updateFolderPageGet(req, res) {
    const folderID = Number(req.params.folderID);
    const folder = await prismaClient.getFolderByID(folderID);
    res.render("update-folder", {folder: folder});
}

async function updateFolderPost(req, res) {
    const newTitle = req.body.title;
    const folderID = Number(req.params.folderID);
    await prismaClient.updateFolderTitle(folderID, newTitle);
    res.redirect("/folders");
}

async function updateFilePost(req, res) {
    const newTitle = req.body.fileTitle;
    const oldTitle = req.params.fileName;
    const folderID = req.params.folderID;
    const folderName = req.params.folderName;
    const userID = req.user.id;

    const bucket = 'filespace';
    const oldPath = `public/${userID}/${folderID}/${oldTitle}`;
    const newPath = `public/${userID}/${folderID}/${newTitle}`;
    
        try {
            // download the file
            const { data: fileData, error: downloadError } = await supabase.storage
                .from(bucket)
                .download(oldPath);
    
            if (downloadError) {
                console.error("Download error:", downloadError);
                return res.status(500).send("Error downloading original file.");
            }
    
            // upload it to the new location
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(newPath, fileData, {
                    contentType: 'application/octet-stream', // generic, or adjust based on type if stored
                    upsert: false
                });
    
            if (uploadError) {
                console.error("Upload error:", uploadError);
                return res.status(500).send("Error uploading file with new name.");
            }
    
            // Step 3: delete the old file
            const { error: deleteError } = await supabase.storage
                .from(bucket)
                .remove([oldPath]);
    
            if (deleteError) {
                console.error("Delete error:", deleteError);
                return res.status(500).send("File uploaded but failed to delete original.");
            }
    
            // redirect to files page
            res.redirect(`/folders/${folderName}/${folderID}`);
    
        } catch (err) {
            console.error("Unexpected error:", err);
            res.status(500).send("Unexpected server error.");
        }
    }
    
async function deleteFilePost(req, res) {
    const folderID = req.params.folderID;
    const folderName = req.params.folderName;
    const userID = req.user.id;
    const filename = req.params.fileName;

    const { data: fileData, error: downloadError } = await supabase.storage
                .from('filespace').remove(`public/${userID}/${folderID}/${filename}`);

    res.redirect(`/folders/${folderName}/${folderID}`)
}


async function newFilePost(req, res) {
    // define variables from params and from the multer step earlier
    const folderID = Number(req.params.folderID);
    const userID = req.user.id;
    const file = req.file;

    // add metadata to prisma DB and assign file ID
    await prismaClient.addFile(folderID, userID, file);
    console.log("file metadata added to db")

    // upload file to supabase
    const { data: uploadData, error: uploadError} = await supabase.storage.from('filespace')
        .upload(`public/${userID}/${folderID}/${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false,

    })

    if (uploadError) {
        console.log(uploadError)
    }

    // otherwise continue
    console.log("file uploaded to supabase")

    // read all files in that folder from supabase
    const { data, error } = await supabase.storage.from('filespace')
    .list(`public/${userID}/${folderID}`, {
        sortBy: { column: 'name', order: 'asc' }});

        if (error) {
            console.log(error)
        }
    
    console.log(data);

    res.render("files", { 
        files: data, 
        userID: userID, 
        folderID: folderID,
     })
}

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
    deleteFolderPost,
    updateFolderPageGet,
    updateFolderPost,
    fileInfoPageGet,
    newFilePost,
    updateFilePageGet,
    updateFilePost,
    deleteFilePost
}