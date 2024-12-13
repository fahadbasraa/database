import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    }
});

// Create the model
const Userlogin = mongoose.model('Userlogin', userSchema);

export default Userlogin;
