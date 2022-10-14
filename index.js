require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const db = require(__dirname + '/modules/db_connect2');
const sessionStore = new MysqlStore({}, db);
// const multer = require('multer');
// const upload = multer({ dest: 'tmp_uploads/' });
const upload = require(__dirname + '/modules/upload-img');
const fs = require('fs').promises;
const app = express();


// app.get('/a.html', (req, res) => {
//     res.send(`<h2>假的</h2>`);
// });

app.set('view engine', 'ejs');

// top-level middleware
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: "thghtyhnyjscjuju",
    store: sessionStore,
    cookie: {
        maxAge: 1200000,
    }
}));
// routes
app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));

// top-level middleware
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    // res.send(`<h2>泥好</h2>`);
    res.render('main', { NAME: 'ethen' });
});

app.get('/sales-json', (req, res) => {
    const sales = require(__dirname + '/data/sales');
    console.log(sales);
    res.render(`sales-json`, { sales });
});


const urlencodedParser = express.urlencoded({ extended: false });
app.post('/try-post', urlencodedParser, (req, res) => {
    res.json(req.body);
});

app.get('/json-test', (req, res) => {
    // res.send({ name: '小新', age: 30 });
    res.json({ name: '小新', age: 30 });
});

app.get('/try-qs', (req, res) => {
    // res.send({ name: '小新', age: 30 });
    res.json(req.query);
});

app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
});
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
});

app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    res.json(req.file);
    // if (req.file && req.file.originalname) {
    //     await fs.rename(req.file.path, `public/imgs/${req.file.originalname}`);

    // } else {
    //     res.json({msg:'沒有上傳檔案'});
    // }
});

app.post('/try-upload2', upload.array('photos'), async (req, res) => {
    res.json(req.files);
    // if (req.file && req.file.originalname) {
    //     await fs.rename(req.file.path, `public/imgs/${req.file.originalname}`);

    // } else {
    //     res.json({msg:'沒有上傳檔案'});
    // }
});

app.get('/my-params1/:action/:id', (req, res) => {
    res.json(req.params);
});

app.get('/my-params2/:action?/:id?', (req, res) => {
    res.json(req.params);
});

app.get('/my-params3/*/*?', (req, res) => {
    res.json(req.params);
});

app.get(/^\/m\/09\d{2}\-?\d{3}\-?\d{3}$/, (req, res) => {
    let u = req.url.slice(3);
    u = u.split('?')[0];

    u = u.split('-').join('');
    res.send({ mobile: u });
})

app.use('/admin2', require(__dirname + '/routes/admin2'));

const myMiddle = (req, res, next) => {
    res.locals = { ...res.locals, ethen: '哈囉' };
    res.locals.derrrr = 123;
    // res.myPersonal = {...res.locals, shinder:'哈囉'}; // 不建議
    next();
};

app.get('/try-middle', [myMiddle], (req, res) => {
    res.json(res.locals);
});

app.get('/try-session', (req, res) => {
    req.session.aaa ||= 0; // 預設值 
    req.session.aaa++;
    res.json(req.session);
});

app.get('/try-date', (req, res) => {
    const now = new Date();
    const m = moment();

    res.send({
        t1: now,
        t2: now.toString(),
        t3: now.toDateString(),
        t4: now.toLocaleString(),
        m: m.format('YYYY-MM-DD HH:mm:ss'),
    })
});

app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m = moment('06/10/22', 'DD/MM/YY');
    res.json({
        m,
        m1: m.format(fm),
        m2: m.tz('Europe/London').format(fm)
    });
});

app.get('/try-db', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM address_book LIMIT 5");
    res.json(rows);
});

app.use((req, res) => {
    // res.type('text/plain'); // 純文字
    // res.status(404).send('<p>找不到你要的頁面</p>')
    res.status(404).render('404')
});

const port = process.env.SERVER_PORT || 3002;
app.listen(port, () => {
    console.log(`server started, port: ${port}`);
});