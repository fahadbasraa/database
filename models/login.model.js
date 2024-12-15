import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const LoginModel = mongoose.model('Login', loginSchema);

export default LoginModel;
