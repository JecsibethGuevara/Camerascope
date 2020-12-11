const express = require('express');
const router = express.Router();
const passport = require('passport');
const sqlite3 = require('sqlite3').verbose();

const db = require('../public/database/db')

router.get('/', (req, res)=>{
    res.render('portals/Login');
})

router.post('/', async(req, res) =>{
  
    await db.all(`SELECT * FROM Users WHERE Username = "${req.body.username}" AND Password = "${req.body.password}" `, (err, rows) => {
        var x =0;       
        if(err){
            console.log(err)
            throw err;
        }
        else if(!rows){
            res.status(400);
            console.log('error one');
            return;
        }
        else{
            rows.forEach((row)=>{
                console.log(row) 
                if (row.Username ===`${req.body.username}` && row.Password === `${req.body.password}`) {
                        x = 1; 
                             
                    }
                else {
                    x = 2;
                    console.log(row)
                }
            })
            if (x === 1) {
                res.redirect('/Index');
                console.log(rows)
            }
            else {
                res.redirect('/'); 
            }

        }
    })
   
})

router.post('/savetodb', async(req, res) =>{
    try{
        let name = `${req.body.patient}Image`
        const sql = `INSERT INTO Images(ImgId,ImgData,ImgName, IdPaciente, Comentario) VALUES (?, ?, ?, ?, ?)`
        const img = [null, req.body.image, name, req.body.patient, null];
        const result = db.all(sql, img);
        console.log('saved')
    }catch (e) { console.error(e.message); }
});

router.get('/Cameras', async(req,res)=>{
    await db.all(`SELECT * FROM Pacientes`, (err, rows) => {      
        if(err){
            console.log(err)
            throw err;
        }
        else if(!rows){
            res.status(400);
            console.log('error one');
            return;
        }
        else{
            
            res.render('portals/newCameras', {rows})
        }
    })
})

router.get('/Index', (req,res)=>{
    res.render('portals/Index')
})

router.get('/registrar', (req,res)=>{
    res.render('portals/createUser')
})

router.get('/Pacientes', async(req,res)=>{
    await db.all(`SELECT * FROM Pacientes`, (err, rows) => {
               
        if(err){
            console.log(err)
            throw err;
        }
        else if(!rows){
            res.status(400);
            console.log('error one');
            return;
        }
        else{
            res.render('portals/pacientes', {rows})
        }
    })
})

router.post('/addPacient', async(req,res)=>{
    try{
        const sql = `INSERT INTO Pacientes(Name,Surname,IdPaciente,Caso,Telefono,Edad,FechaNacimiento,FechaConsulta) VALUES(?,?,?,?,?,?,?,?)`;
        const user = [req.body.Nombre, req.body.Apellido, req.body.Cedula, req.body.Descripcion, req.body.telefono, req.body.edad, req.body.nacimiento, req.body.consulta];
        const result = await db.all(sql, user);
        res.redirect('/Pacientes')
    } catch (e) { console.error(e.message); }
})

router.get('/deletepatient/:id', async(req,res)=>{
    try{
        const sql = `DELETE FROM Pacientes WHERE IdPaciente = (?)`;
        const {id}  = req.params;
        const result = await db.all(sql,id);
        res.redirect('/Pacientes')
    } catch(e) {console.error(e.message)}
})

router.get('/expediente/:id', async(req,res)=>{


    const{id} = req.params;
    await db.all(`SELECT * FROM Pacientes WHERE Pacientes.IdPaciente = ${id}`, (err, rows) => {
        const{id} = req.params;
        if(err){
            console.log(err) 
            throw err;
        }
        else if(!rows){
            res.status(400);
            console.log('error one');
            return;
        }
        else{
            console.log(rows)
             db.all(`SELECT * FROM Images WHERE Images.IdPaciente = ${id}`, (err, rowss) => {
                const{id} = req.params;
                if(err){
                    console.log(err) 
                    throw err;
                }
                else if(!rows){
                    res.status(400);
                    console.log('error one');
                    return;
                }
                else{
                    row = {...rows, ...rowss}
                    res.render('portals/expediente', {rows, rowss})
                }
            })
        }
    })
})

router.get('/UserList', async(req,res)=>{
   
    await db.all(`SELECT * FROM Users `, (err, rows) => {
           
        if(err){
            console.log(err)
            throw err;
        }
        else if(!rows){
            res.status(400);
            console.log('error one');
            return;
        }
        else{
            res.render('portals/Userlist', {rows})
        }
    })
   
})

router.get('/Gallery', async(req,res)=>{
   
    await db.all(`SELECT * FROM Images`, (err, rows) => {
        var x =0;       
        if(err){
            console.log(err)
            throw err;
        }
        else if(!rows){
            res.status(400);
            console.log('error one');
            return;
        }
        else{
            
            res.render('portals/gallery', {rows})
        }
    })
   
})

router.get('/delete/:id', async(req,res)=>{
    try{
        const sql = `DELETE FROM Users WHERE Id = (?)`;
        const {id}  = req.params;
        const result = await db.all(sql,id);
        console.log('deleted')
    } catch(e) {console.error(e.message)}
})

router.get('/deleteImg/:id', async(req,res)=>{
    try{
        const sql = `DELETE FROM Images WHERE ImgId = (?)`;
        const {id}  = req.params;
        const result = await db.all(sql,id);
        res.redirect('/Gallery')
    } catch(e) {console.error(e.message)}
})

router.post('/registrar', async(req,res)=>{
    try{
        const sql = `INSERT INTO Users(Name, Username, Password) VALUES(?,?,?)`;
        const user = [req.body.name, req.body.username, req.body.password];
        const result = await db.all(sql, user);
        res.redirect('/Configuracion')
    } catch (e) { console.error(e.message); }
      
});

router.get('/Configuracion', (req,res)=>{
    res.render('portals/Configuraciones')
})


module.exports = router