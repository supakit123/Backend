const http = require('http');
const express = require('express'), bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const mariadb = require('mariadb');
const { log } = require('console');

const pool = mariadb.createPool({
    host : 'localhost',
    user : 'root',
    password : '123',
    database : 'store'
});

app.get('/api/customers', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    const rows = await conn.query('select * from customer')
    console.log(rows);
});

app.post('/api/customer/login', async (req, res) => {
    const { email, password} = req.body;
    let conn;
    conn = await pool.getConnection();
    const rows = await conn.query('select email, password from customer where email = ? and password = ?', [email, password])
    console.log(rows);
    const jsonS = JSON.stringify(rows);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(jsonS);
});

app.get('/api/baskets', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    const rows = await conn.query('select * from basket')
    console.log(rows);
});

app.listen('8080', () => {
    console.log('Server is running on port 8080');
})