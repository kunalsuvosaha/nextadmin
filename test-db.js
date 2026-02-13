const mongoose = require('mongoose');
const uri = 'mongodb://kunalsuvosaha_db_user:bW19RnjWV7aYvbfa@ac-hisc6jk-shard-00-00.hisc6jk.mongodb.net:27017,ac-hisc6jk-shard-00-01.hisc6jk.mongodb.net:27017,ac-hisc6jk-shard-00-02.hisc6jk.mongodb.net:27017/?ssl=true&replicaSet=atlas-hisc6jk-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

console.log('Attempting to connect to:', uri);

mongoose.connect(uri)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Connection failed:', err);
        process.exit(1);
    });
