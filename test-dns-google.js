const dns = require('dns');

// Force usage of Google DNS
try {
    dns.setServers(['8.8.8.8']);
    console.log('Set DNS servers to 8.8.8.8');
} catch (e) {
    console.error('Failed to set DNS servers:', e);
}

const host = 'ac-hisc6jk-shard-00-00.hisc6jk.mongodb.net';

console.log(`Resolving ${host} using Google DNS...`);

dns.resolve(host, (err, addresses) => {
    if (err) {
        console.error(`DNS Resolution failed for ${host}:`, err);
    } else {
        console.log(`Resolved ${host}:`, addresses);
    }
});

const controlHost = 'google.com';
console.log(`Resolving ${controlHost} using Google DNS...`);

dns.resolve(controlHost, (err, addresses) => {
    if (err) {
        console.error(`DNS Resolution failed for ${controlHost}:`, err);
    } else {
        console.log(`Resolved ${controlHost}:`, addresses);
    }
});
