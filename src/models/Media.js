import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    url: {
        type: String, // Cloudinary URL
        required: [true, 'Please provide a URL'],
    },
    publicId: {
        type: String, // Cloudinary Public ID
        required: [true, 'Please provide a public ID'],
    },
    type: {
        type: String, // 'image' or 'video'
        default: 'image',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
