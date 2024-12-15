// File: models/admission.js
import mongoose from 'mongoose';


const admissionSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    parentEmail: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    admissionDate: {
        type: Date,
        default: Date.now
    }
});

const Admission = mongoose.model('Admission', admissionSchema);

export default Admission;
