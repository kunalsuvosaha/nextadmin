const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');

function loadLocalEnv() {
    const envPath = path.join(__dirname, '.env.local');

    if (!fs.existsSync(envPath)) {
        return;
    }

    const envFile = fs.readFileSync(envPath, 'utf8');

    for (const line of envFile.split(/\r?\n/)) {
        const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);

        if (!match) {
            continue;
        }

        const [, key, rawValue] = match;
        const value = rawValue.replace(/^['"]|['"]$/g, '');

        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
}

loadLocalEnv();

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI is missing. Add it to .env.local or your environment.');
    process.exit(1);
}

console.log('Attempting to connect to MongoDB...');

mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
})
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Connection failed:', err.message);
        process.exit(1);
    });
