const express = require('express')
const app = express()
const cors = require('cors')

const dfInfo = require('../DB/dbinfo')


const { Client } = require('pg') //DB사용을 위함
const { RowDescriptionMessage } = require('pg-protocol/dist/messages')
const dbInfo = require('../DB/dbinfo')
app.use(cors())

//Post를 쓰려면 이 2줄이 필요하다.
app.use(express.json())
app.use(express.urlencoded({extended:false}))
//서버에서 pg를 다운로드한다.

//()=> 화살표 함수

app.get('/Kor',(req, res)=>{//req는 아이디, 페스워드, res는 다시 받아오는 값
    res.send('한국어')
    console.log('You just activated this site great!!')
})

app.get('/eng',(req, res)=>{//req는 아이디, 페스워드, res는 다시 받아오는 값
    res.send('영어22')
    console.log('You just activated this site great!!')
})

app.get('/jap',(req, res)=>{//req는 아이디, 페스워드, res는 다시 받아오는 값
    res.send('일본어')
    console.log('You just activated this site great!!')
    console.log(req)
})

//0809
app.get('/language_all/',(req, res)=>{
    console.log('langudate')
    console.log(dbInfo)

    const client = new Client(dbInfo)
    client.connect()
    client.query('select language, msg from public."Language"',(err, result)=>{
        res.send(result.rows)
    })
    
})

app.post('/mod', (req, res)=>{
    const lan_mod = req.body.lan_mod
    const lan = req.body.lan
    console.log(lan)
    const msg = req.body.msg

    const client = new Client(dbInfo)
    client.connect()
    client.query('update public."Language" set language = $1, msg = $2 where language = $3',[lan, msg, lan_mod],(err, result)=>{
        res.send(result.rows)
    })


    console.log(lan, msg)
})

//0809
// app.post('/reg', (req, res)=>{
    
//     console.log('dafsdfas')

//     const lan = req.body.lan
//     const msg = req.body.msg

//     const client = new Client(dbInfo)
//     client.connect()
//     client.query('insert into public."Language" values ($1, $2)',[lan,msg],(err, result)=>{
//         console.log(result)
//         if(err) {
//             console.log('ERRor', err)
//         } else {
//             res.send('OK')
//         }
//     })

// })
app.post('/Reg', (req, res)=>{
    console.log('왔냐왔냐')
    const lan = req.body.lan
    const msg = req.body.msg

    const client = new Client(dbInfo)
    client.connect()
    client.query('INSERT INTO public."Language" VALUES ($1 ,$2)',[lan,msg],(err, result)=>{
        if(err){
            console.log('Error', err)
        }else{
            res.send('OK')
        }
    })
})


app.post('/del', (req, res)=> {
    const item = req.body.item
    console.log(item)

    const client = new Client(dbInfo)
    client.connect()
    client.query('delete from public."Language" where language = $1',[item],(err, result)=>{
        if(err) {
            console.log('ERRER', err)
        } else {
            res.send('OK')
        }

    })    


})

app.get('/language/:lan',(req, res)=>{
    const lan = req.params.lan

    const client = new Client(dbInfo)
    client.connect()
    client.query('select language, msg from public."Language" where language = $1',[lan],(err, result)=>{
        res.send(result.rows)
    })

})

//app.get('/language/:lan',(req, res)=>{
app.post('/language/',(req, res)=>{

    const lan = req.body.lan
    const msg1 = req.body.msg  
    //const lan = req.params.lan get방식
    console.log('/language/:lan',lan)
    const nums = []
    nums[0] = 1
    nums[1] = 2

    const dbInfo = {
        user:'postgres'
        ,password:'4222'
        ,port:5432
        ,host:'localhost'
        ,database:'Test_0802'

    }

    //디비연결객체생성
    const client = new Client(dbInfo)
    client.connect().then(()=>{
        console.log('디비연결성공')
    })
    

    client.query('select msg from public."Language" where language = $1',[lan],(err, result)=>{
        // if(err) {
        //     console.log('err',err)
        // } else {
        //     console.log('result', result.rows[0].msg)
        //     console.log(result.rowCount)

        //     res.send(result.rows[0].msg)


        // }
        console.log(result.rowCount)

        if(err) {
            console.log('ERRRR',err)
        } else {
            if(result.rowCount==0) { // DB결과값 없는 경우
                console.log(lan)

                client.query('INSERT INTO public."Language" VALUES($1, $2)',[lan,msg1],(err, result)=>{
                    if(err) {
                        console.log('ERROR', err)
                    } else {
                        client.query('SELECT msg from public."Language" WHERE language = $1',[lan],(err, result)=>{
                            res.send(result.rows[0].msg)
                                
                        })


                        console.log(result)
                    }
                    

                })


            } else { //결과값 있는 경우
                res.send(result.rows[0].msg)
                console.log(result.rows[0].msg)
            }
        }
        
    })

    

})

//0818 추가 헤로쿠에서 가능하게
app.listen(process.env.PORT || 3000, ()=> {
    console.log('Start Server on Port 3000')


})
//서버가 만들어졌다.
//get은 많은 정보를 보낼수 없다 post는 많은 정보를 보낸다.





