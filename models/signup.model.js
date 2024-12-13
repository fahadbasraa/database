import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // Minimum length is 8
        validate: {
            validator: function (value) {
                // Regex for at least one uppercase letter, one number, and minimum length of 8
                return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message:
                'Password must contain at least one uppercase letter, one number, and be at least 8 characters long',
        },
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'faculty', 'student', 'parent'], // Restrict to these roles
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('User', userSchema);
