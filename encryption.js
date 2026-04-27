const {Buffer} = require('buffer');
const {generateKeyPairSync} = require('crypto');
const crypto = require('crypto');
const aliceKey = require('./models/aliceKey')
const bobKey = require('./models/bobKey')

//HKDF
function b64(data){
    return Buffer.from(data).toString('base64');
}

function hkdf(input, length){
    return Buffer.from(
        crypto.hkdfSync( 'sha256',input, Buffer.alloc(0),  Buffer.alloc(0), length)
    );
}

function encrypt(ratchet, file){
    const [messageKey, IV] = ratchet.updateState();
    const encrypted = crypto.createCipheriv('aes-256-gcm', messageKey, IV);
    const encFile = Buffer.concat([encrypted.update(file), encrypted.final()]);
    const tag = encrypted.getAuthTag()
    return { encFile, tag, messageKey, IV };
}

function decrypt(messageKey, IV, encrypted, tag){
    const decrypted = crypto.createDecipheriv('aes-256-gcm', messageKey, IV);
    decrypted.setAuthTag(tag);
    const message = Buffer.concat([decrypted.update(encrypted), decrypted.final()]);
    return message;
}
function send(ratchet, file){
    return encrypt(ratchet, file);
}
function receive(encFile){
    return decrypt(encFile.messageKey,encFile.IV,encFile.encFile,encFile.tag);
}


class SymmetricRatchet{ 
    constructor(key){
        this.state = key;
    }
    updateState(inp = Buffer.alloc(0)){
        let output = hkdf(Buffer.concat([this.state, inp]),80);
        this.state = output.slice(0,32);
        const newkey = output.slice(32,64);
        const IV = output.slice(64);
        return [newkey, IV];
    };
}


class Bob{
    createKey(){
        this.IKb = generateKeyPairSync('x25519');
        this.SPKb = generateKeyPairSync('x25519');
        this.OPKb = generateKeyPairSync('x25519');
    }
    x3dh(aliceInstance){
        const dh1 = crypto.diffieHellman({
            privateKey: this.SPKb.privateKey,
            publicKey: aliceInstance.IKa.publicKey
        })
        const dh2 = crypto.diffieHellman({
            privateKey: this.IKb.privateKey,
            publicKey: aliceInstance.EKa.publicKey
        })
        const dh3 = crypto.diffieHellman({
            privateKey: this.SPKb.privateKey,
            publicKey: aliceInstance.EKa.publicKey
        })
        const dh4 = crypto.diffieHellman({
            privateKey: this.OPKb.privateKey,
            publicKey: aliceInstance.EKa.publicKey
        })
        this.sk = hkdf(Buffer.concat([dh1, dh2 , dh3 , dh4]),32);
        console.log("bob's shared key: " + this.sk.toString('hex'));
    }
    ratchet(){
        this.root_ratchet = new SymmetricRatchet(this.sk);
        const [update1] = this.root_ratchet.updateState();
        const [update2] = this.root_ratchet.updateState();
        this.recv_ratchet = new SymmetricRatchet(update2);
        this.send_ratchet = new SymmetricRatchet(update1);
    };
    receive(encFile){
        return receive(encFile);
    }
    
};


class Alice{
    createKey(){
        this.IKa = generateKeyPairSync('x25519');
        this.EKa = generateKeyPairSync('x25519');
            }
    x3dh(bobInstance){
        const dh1 = crypto.diffieHellman({
            privateKey: this.IKa.privateKey,
            publicKey: bobInstance.SPKb.publicKey
        })
        const dh2 = crypto.diffieHellman({
            privateKey: this.EKa.privateKey,
            publicKey: bobInstance.IKb.publicKey
        })
        const dh3 = crypto.diffieHellman({
            privateKey: this.EKa.privateKey,
            publicKey:  bobInstance.SPKb.publicKey
        })
        const dh4 = crypto.diffieHellman({
            privateKey: this.EKa.privateKey,
            publicKey: bobInstance.OPKb.publicKey
        })
        this.sk = hkdf(Buffer.concat([dh1,dh2,dh3,dh4]),32);
        console.log("alice's shared key: " + this.sk.toString('hex'));
    }

    ratchet(){
        this.root_ratchet = new SymmetricRatchet(this.sk);
        const [update1] = this.root_ratchet.updateState();
        const [update2] = this.root_ratchet.updateState();
        this.recv_ratchet = new SymmetricRatchet(update1);
        this.send_ratchet =  new SymmetricRatchet(update2);
        return this.recv_ratchet,this.send_ratchet;
    };
    send(file){
        return send(this.send_ratchet, Buffer.from(file));
    }

};
const alice = new Alice();
const bob = new Bob();

module.exports = {
    Alice,
    Bob,
    SymmetricRatchet,
    encrypt,
    decrypt,
    alice,
    bob
};
/*console.log('[Alice]\tsend ratchet:', aliceInstance.send_ratchet.updateState().map(b64));
console.log('[Bob]\trecv ratchet:', bobInstance.recv_ratchet.updateState().map(b64));
console.log('[Alice]\trecv ratchet:', aliceInstance.recv_ratchet.updateState().map(b64));
console.log('[Bob]\tsend ratchet:', bobInstance.send_ratchet.updateState().map(b64));*/