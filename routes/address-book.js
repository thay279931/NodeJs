const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../modules/db_connect2');


router.use((req, res, next)=>{
    next();
});

// CRUD

router.get('/', async (req, res)=>{
    const t_sql = "SELECT COUNT(1) totalRows FROM address_book";
    const [totalRows] = await db.query(t_sql)

    res.json(totalRows);
});

module.exports = router;