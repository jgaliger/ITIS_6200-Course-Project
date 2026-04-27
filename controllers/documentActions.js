const model = require('../models/document')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const encryption = require('../encryption')
const user = require('../models/user')



exports.main = (req,res,next) => {
    model.find({author: req.session.user,pending: false})
    .then(document=>res.render('./document/main', {document}))
};

exports.create = (req, res, next) => {
    let document = new model(req.body);
    document.author = req.session.user;
    const file = fs.readFileSync(req.file.path);
    const { encFile, tag, messageKey, IV } = encryption.alice.send(file);
    document.content = encFile;
    document.tag = tag;
    document.messageKey = messageKey;
    document.IV = IV;
    document.filePath = req.file.path;

    document.save()
        .then(() => {res.redirect('/documents')})
        .catch(err => next(err));
};

exports.send = async (req,res,next) =>{
    const id = req.params.id;
    const document = await model.findById(id);
    console.log(document)
    const recipient = await user.findOne({ username: req.body.username });
    const newDocument = new model({ 
        title: document.title, 
        author: recipient._id, 
        content: document.content, 
        tag: document.tag, 
        filePath: document.filePath, 
        messageKey: document.messageKey,
        IV: document.IV,
        pending: true, 
        sender: req.session.user });
    await newDocument.save();
    await model.findByIdAndDelete(id)
    res.redirect('/documents');
};
exports.accept = async (req, res, next) => {
    const id = req.params.id;
    const document = await model.findById(id);
    const decryptedFile = encryption.bob.receive({
        encFile: document.content,
        tag: document.tag,
        messageKey: Buffer.from(document.messageKey),
        IV: Buffer.from(document.IV)
    });
    document.pending = false;
    document.accepted = true;
    document.content = decryptedFile;
    await document.save();

    res.redirect(`/documents/${document._id}`);
};
exports.request = async (req,res,next) => {
    const documents = await model.find({author: req.session.user,pending: true});
    res.render('./document/request', { document: documents });
};

exports.reject = async (req,res,next) => {
    let id = req.params.id
     await model.findByIdAndDelete(id);
    res.redirect('/documents')
};


exports.new = (req, res)=>{
    res.render('./document/new');
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id).populate('author')
    .then(document=>{  
            return res.render('./document/display', {document});
    })
};
exports.delete = async (req, res, next) => {
    const id = req.params.id;
    const document = await model.findById(id);
    fs.unlinkSync(document.filePath);
    model.findByIdAndDelete(id)
    .then(document=>res.redirect('/documents'))
};