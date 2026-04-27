const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const encryption = require('./encryption');

encryption.alice.createKey();
encryption.bob.createKey();

encryption.alice.x3dh(encryption.bob);
encryption.bob.x3dh(encryption.alice);

encryption.alice.ratchet();
encryption.bob.ratchet();


const app = express();
let port = 3000;
let host = 'localhost';


app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/demos')
.then(()=>{
    app.listen(port, host, ()=>{
        console.log('Server is running: ', port);
    });
})



app.use(
    session({
        secret: "ajfeirf90aeu9eroejfoefj",
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    console.log(res.locals.errorMessages);
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//set up routes
app.get('/', (req, res)=>{
    res.render('main');
});

app.use('/documents', documentRoutes);

app.use('/users', userRoutes);

app.use('/public', express.static('public'));

app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

//app.use((err, req, res, next)=>{
//    console.log(err.stack);
//    if(!err.status) {
//        err.status = 500;
//        err.message = ("Internal Server Error");
//    }

//    res.status(err.status);
//    res.render('error', {error: err});
//});