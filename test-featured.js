require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function checkFeatured() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Media = mongoose.models.Media || mongoose.model('Media', new mongoose.Schema({
        name: String,
        url: String,
        type: String,
        isFeatured: Boolean
    }));
    
    const all = await Media.find({});
    console.log("All media count:", all.length);
    const featured = await Media.find({ isFeatured: true });
    console.log("Featured media count:", featured.length);
    console.log("Featured media:", featured);
    process.exit(0);
}

checkFeatured();
