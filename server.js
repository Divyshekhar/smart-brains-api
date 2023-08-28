const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const image  = require('./controllers/image.js');





const db = knex({
    client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'hello',
    database : 'smart-brain'
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

app.post('/signin',(req,res) => {signin.handleSignin(req,res, db, bcrypt)} )

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})
  

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({
        id: id
    }).then(user=>{
        if(user.length){

            res.json(user[0])
        }
        else{
            res.status(400).json('Not Found')
        }
    }).catch(err => err.status(400).json('not found'))
  

})

app.put('/image', (req, res) => {image.handleImage(db, bcrypt,res,req)})
app.post('/imageurl', (res,req) => image.handleApicall(res,req))
app.listen(3000, () => {
    console.log('app is running on port 3000')
})
