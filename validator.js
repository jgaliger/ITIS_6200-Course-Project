const Story = require('../models/story');
const {ObjectId} = require('mongoose').Types;

exports.validateId = (req,res,next)=>{
    let id = req.params.id;
    if (ObjectId.isValid(id)) {
        return next(); 
    } else {
        let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
    }
}

