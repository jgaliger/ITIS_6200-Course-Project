const document = require('../models/document')
const {ObjectId} = require('mongoose').Types;

exports.isLoggedIn=(req,res,next)=>{
    if(req.session.user){
        return next();
    }
    else{
            req.flash('error', 'You need to log in first');
            return res.redirect('/users/login');
    }
}
exports.isAuthor = (req,res,next)=>{
    let id = req.params.id;
    document.findById(id)
    .then(document=>{
        if(document){
            if(document.author == req.session.user){
                return next();
            }else{
                let err = new Error('Unauthorized access to the resource');
                err.status=401;
                return next(err);
            }
        }
    })
.catch(err => next(err)); 
}
exports.validateId = (req,res,next)=>{
    let id = req.params.id;
    if (ObjectId.isValid(id)) {
        return next(); 
    } else {
        let err = new Error('Cannot find a document with id ' + id);
            err.status = 404;
            next(err);
    }
}