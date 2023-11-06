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

app.post('/api/customer/login/all', async (req, res) => {
    const { email, password} = req.body;
    let conn;
    conn = await pool.getConnection();
    const rows = await conn.query('select email, password from customer where email = ? and password = ?', [email, password])
    console.log(rows);
    const jsonS = JSON.stringify(rows);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(jsonS);
});

app.post('/api/customer/login', async (req, res) => {
    const { email, password } = req.body;
    let conn;

    try {
        conn = await pool.getConnection();
        const result = await conn.query('SELECT email, password FROM customer WHERE email = ? AND password = ?', [email, password]);

        if (result.length === 1) {
            // res.status(200).json({ message: 'Login successful' });
            console.log(result);
            const jsonS = JSON.stringify(result);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(jsonS);
        } else {
            res.status(401).json({ message: 'Login failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (conn) conn.release();
    }
});


app.get('/api/baskets', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    const rows = await conn.query('select * from basket')
    console.log(rows);
});

app.get('/api/product', async (req, res) => {
    let conn;
    conn = await pool.getConnection();
    const rows = await conn.query('select * from product')
    console.log(rows);
});



app.listen('8080', () => {
    console.log('Server is running on port 8080');
})