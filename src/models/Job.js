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
    // Missing Fields Added
    designation: {
        type: String,
    },
    category: {
        type: String,
    },
    jobType: {
        type: String, // Full-time, Part-time, etc.
    },
    deadline: {
        type: String, // Storing as String to match form input type="date" value
    },
    skillName: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    // End Missing Fields
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
