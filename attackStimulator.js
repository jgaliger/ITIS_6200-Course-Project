const readline = require('readline');
const mongoose = require('mongoose');
const encryption = require('./encryption');
let snapshot = null;

mongoose.connect('mongodb://localhost:27017/demos');
function short(buf) {
    return buf.toString('hex').slice(0, 16) + '...';
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});
encryption.alice.createKey();
encryption.bob.createKey();
encryption.alice.x3dh(encryption.bob);
encryption.bob.x3dh(encryption.alice);
encryption.alice.ratchet();
encryption.bob.ratchet();

console.log('Attack Case: Status to verify ratchet' );
console.log('Attack Case: Snapshot to save state');
console.log('Attack Case: Step X amount of times to advance ratchet'); 
console.log('Attack Case: Rollback to restore Alice Ratchets'); 
console.log('Commands for Success Case: Step, Status, Step, Status...')
console.log('rollback');
console.log('status');
console.log('exit');
rl.setPrompt(': ');
rl.prompt();
rl.on('line', async (line) => {
    const cmd = line.trim();
    switch (cmd) {
        case 'snapshot':
            snapshot = {
                send: Buffer.from(encryption.alice.send_ratchet.state),
                recv: Buffer.from(encryption.alice.recv_ratchet.state),
                root: Buffer.from(encryption.alice.root_ratchet.state)
            };
            console.log('Snapshot saved.');
            console.log('send_ratchet:', snapshot.send);
            console.log('recv_ratchet:', snapshot.recv);
            console.log('root_ratchet:', snapshot.root);
            break;
            case 'rollback':
                encryption.alice.send_ratchet.state = snapshot.send;
                encryption.alice.recv_ratchet.state = snapshot.recv;
                encryption.alice.root_ratchet.state = snapshot.root;
                console.log('Rollback completed:');
                console.log('send:', short(encryption.alice.send_ratchet.state));
                console.log('recv:', short(encryption.alice.recv_ratchet.state));
                console.log('root:', short(encryption.alice.root_ratchet.state));
                break;
        case 'status':
            console.log('ALICE RATCHET');
            console.log('sk:', encryption.alice.sk.toString('hex'));
            console.log('root ratchet:', encryption.alice.root_ratchet.state.toString('hex'));
            console.log('recv ratchet:', encryption.alice.recv_ratchet.state.toString('hex'));
            console.log('send ratchet:', encryption.alice.send_ratchet.state.toString('hex'));
            console.log('\nBOB RATCHET');
            console.log('sk:', encryption.bob.sk.toString('hex'));
            console.log('root ratchet:', encryption.bob.root_ratchet.state.toString('hex'));
            console.log('recv ratchet:', encryption.bob.recv_ratchet.state.toString('hex'));
            console.log('send ratchet:', encryption.bob.send_ratchet.state.toString('hex'));
            break;
            case 'step':
                encryption.alice.root_ratchet.updateState();
                encryption.alice.send_ratchet.updateState();
                encryption.alice.recv_ratchet.updateState();
                encryption.bob.root_ratchet.updateState();
                encryption.bob.send_ratchet.updateState();
                encryption.bob.recv_ratchet.updateState();
                console.log('Ratchets advanced by one step.');
                break;
        case 'exit':
            process.exit(0);
            break;
    }
    rl.prompt();
});