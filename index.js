
const express = require('express');
const mysql = require('mysql2')
const app = express();
const PORT = 3100;
require('dotenv').config()

const bodyParser = require('body-parser')

const pass=process.env.pass_ms

const name='root'

app.use(bodyParser.json())
const router = require('./dbproxy.js')
app.use('/', router)

global.con = mysql.createConnection(
    {
        host:'localhost',
        user:`${name}`,
        password: `${pass}`,
        database:'try1'
    }
)

con.connect((err)=>{
    if(err)
    {
        console.log(err)
    }
    else{
        console.log("connected")
    }
})


//To get information by the id
app.get('/:collection/:id', (req,res)=> 
{
    con.query(`Select * from ${req.params.table} where id = '${req.params.id}'`,(err,result,fields)=>
    {
        if(err)
        {
            console.log(err)
        }
        else{
            res.send(result)
        }
    })
})

//To update information by the id
app.post('/:collection/:id',(req,res)=>
{
    let updatequery=`Update ${req.params.table} set `
    const data =req.body
    Object.keys(data).map((colName)=>
    {
        updatequery+=`${colName} = '${data[colName]}' ,`
    })

    updatequery=updatequery.slice(0,-1)

    updatequery+= `where id='${req.params.id}'`
    con.query(updatequery,(err,result)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.send("Updated")
        }
    })
})

//To delete information by the id
app.delete('/:collection/:id',(req,res)=>
{

    con.query(`delete from ${req.params.table} where id='${req.params.id}'`,(err,result)=>
    {
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.send("Deleted")
        }
    })
})


app.listen(PORT);
