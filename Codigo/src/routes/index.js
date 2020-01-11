const admin = require('firebase-admin');
const fetch = require("node-fetch");


var serviceAccount = require("../../practicasytwc-firebase-adminsdk-f8ly1-46d21f762c.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://practicasytwc.firebaseio.com"
});

const db = admin.database();

const { Router}= require('express');
const router = Router();

var json = null;

router.get('/', (req, res) => {
    db.ref('Usuarios').once('value', (snapshot) => {
       data = snapshot.val();
       json = data;
       res.render('index', {contacts: data})
    });
})

router.get('/busqueda', (req, res) => {
    res.render('busqueda')
})

router.post('/new-contact', (req, res) => {
    const newContact = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    }
    var id = "usuario" + Math.floor(Math.random() * (99 - 0 + 1) + 0) + Math.floor(Math.random() * (99 - 0 + 1) + 0) + Math.floor(Math.random() * (99 - 0 + 1) + 0);
    db.ref('Usuarios').child(id).set(newContact);
    res.redirect('/index.html?Nombre=' + req.body.firstname + '?Apellidos=' + req.body.lastname + '?Email=' + req.body.email );
});

router.get('/delete-contact/:id', (req, res) => {
    db.ref('Usuarios/' + req.params.id).remove();
    res.redirect('/');
});

router.post('/getValueContacs', (req, res) => {

    var objErrList = JSON.stringify(json);

        var jsonreal = JSON.parse(objErrList);

        for(var key in jsonreal)
        {
            if(jsonreal[key].email == req.body.email && jsonreal[key].password == req.body.password){
                res.redirect('/?Nombre=' + jsonreal[key].firstname + '?Apellidos=' + jsonreal[key].lastname);
            }
        }
        res.render('index', {fallos: "Usuario Incorrecto"});
    });

module.exports = router;