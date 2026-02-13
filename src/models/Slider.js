import mongoose from 'mongoose';

const SliderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for the slider'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please provide an image URL'],
    },
    publicId: {
        type: String,
        required: [true, 'Please provide a public ID'],
    },
    status: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Slider || mongoose.model('Slider', SliderSchema);
