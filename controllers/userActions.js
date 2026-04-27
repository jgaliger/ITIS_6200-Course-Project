const model = require('../models/user');
const document =require('../models/document');
const AliceKey = require('../models/aliceKey');
const BobKey = require('../models/bobKey');
const encryption = require('../encryption');

exports.account = (req, res)=>{
    return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);
    user.save()
    .then(user=> res.redirect('/users/login'))
};

exports.verify = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let username = req.body.username;
    let password = req.body.password;
    model.findOne({ username })
    .then(user => {
        if (!user) {
            req.flash('error', 'wrong username');
            return res.redirect('/users/login');
        }
        user.comparePassword(password)
        .then(async result => {
            if (!result) {
                req.flash('error', 'wrong password');
                return res.redirect('/');
            }
            let aliceKeys = await AliceKey.findOne({ owner: user._id });
            let bobKeys = await BobKey.findOne({ owner: user._id });
            if (!aliceKeys || !bobKeys) {
//Create keys upon login to stimulate attack, if there are keys already generated 
//there is no creation.
                const alice = new encryption.Alice();
                const bob = new encryption.Bob();
                alice.createKey();
                bob.createKey();
                alice.x3dh(bob);
                bob.x3dh(alice);
                alice.ratchet();
                bob.ratchet();

                await AliceKey.create({
                    owner: user._id,
                    IKa_public: alice.IKa.publicKey.export({type: 'spki',format: 'pem'}),
                    IKa_private: alice.IKa.privateKey.export({type: 'pkcs8',format: 'pem'}),
                    EKa_public: alice.EKa.publicKey.export({type: 'spki',format: 'pem'}),
                    EKa_private: alice.EKa.privateKey.export({ type: 'pkcs8',  format: 'pem'}),
                    sharedKey: alice.sk
                });
                await BobKey.create({
                    owner: user._id,
                    IKb_public: bob.IKb.publicKey.export({type: 'spki',format: 'pem'}),
                    IKb_private: bob.IKb.privateKey.export({type: 'pkcs8',format: 'pem'}),
                    SPKb_public: bob.SPKb.publicKey.export({type: 'spki', format: 'pem'}),
                    SPKb_private: bob.SPKb.privateKey.export({type: 'pkcs8',format: 'pem'}),
                    OPKb_public: bob.OPKb.publicKey.export({ type: 'spki',format: 'pem'}),
                    OPKb_private: bob.OPKb.privateKey.export({ type: 'pkcs8',  format: 'pem'}),
                    sharedKey: alice.sk
                });
            }
            req.session.user = user._id;
            req.flash('success', 'You have successfully logged in');
            res.redirect('/users/home');
        });
    });
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), document.find({author: id})])
    .then(results=>{
        const [user,document] = results;
        res.render('./user/home', {user,document});
    })
    .catch(err=>next(err));
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.render('./user/login');  
    });
   
 };