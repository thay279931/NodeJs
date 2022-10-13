require('dotenv').config();
const express = require('express');

// const multer = require('multer');
// const upload = multer({ dest: 'tmp_uploads/' });
const upload = require(__dirname + '/modules/upload-img');
const fs = require('fs').promises;
const app = express();

// app.get('/a.html', (req, res) => {
//     res.send(`<h2>假的</h2>`);
// });

app.set('view engine', 'ejs');
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

app.get('/my-params1/:action/:id', (req, res)=>{
    res.json(req.params);
    });

app.get('/my-params2/:action?/:id?', (req, res)=>{
        res.json(req.params);
        });

app.get('/my-params3/*/*?', (req, res)=>{
        res.json(req.params);
        });

app.get(/^\/m\/09\d{2}\-?\d{3}\-?\d{3}$/, (req, res)=>{
        let u = req.url.slice(3);
        u = u.split('?')[0];
        
        u = u.split('-').join('');
        res.send({mobile:u});
        })

app.use('/admin2',  require(__dirname + '/routes/admin2') );
app.use((req, res) => {
    // res.type('text/plain'); // 純文字
    // res.status(404).send('<p>找不到你要的頁面</p>')
    res.status(404).render('404')
});

const port = process.env.SERVER_PORT || 3002;
app.listen(port, () => {
    console.log(`server started, port: ${port}`);
});