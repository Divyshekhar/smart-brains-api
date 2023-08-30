import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt-nodejs';
import knex from 'knex';

import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleImage from './controllers/image.js';
import handleApicall from './controllers/image.js';







const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PW,
        database: process.env.DATABASE_DB
    }
})

db.select('*').from('users').then(data => {
    console.log(data);
})

const app = express();

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {

    res.send('success');
})

app.post('/signin', (req, res) => { handleSignin(req, res, db, bcrypt) })

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({
        id: id
    }).then(user => {
        if (user.length) {

            res.json(user[0])
        }
        else {
            res.status(400).json('Not Found')
        }
    }).catch(err => err.status(400).json('not found'))


})

app.put('/image', (req, res) => { handleImage(db, bcrypt, res, req) })
app.post('/imageurl', (res, req) => handleApicall(res, req))
app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`)
})
