import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a job title'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a job description'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
    },
    salary: {
        type: String,
    },
    type: {
        type: String, // Full-time, Part-time, etc.
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

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
