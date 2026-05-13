import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
        },
        role: {
            type: String,
            enum: ['admin'],
            default: 'admin',
            immutable: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
