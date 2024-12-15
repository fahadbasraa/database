import mongoose from 'mongoose';
const facultySchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    facultyId: {
        type: String,
        unique: true,
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }],
});
const Faculty = mongoose.model('Faculty', facultySchema);
export default Faculty;
