const db = require('../db/pool');

function indexPageGet(req, res) {
    res.render("/")
}

module.exports = {
    indexPageGet
}