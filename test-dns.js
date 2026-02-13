const dns = require('dns');

const host = 'ac-hisc6jk-shard-00-00.hisc6jk.mongodb.net';

console.log(`Resolving ${host}...`);

dns.resolve(host, (err, addresses) => {
    if (err) {
        console.error('DNS Resolution failed:', err);
    } else {
        console.log('Resolved addresses:', addresses);
    }
});
