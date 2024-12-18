// student.js
import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    totalmarks:{type: Number, required: true},
    marks: { type: Number, required: true },
    term: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const attendanceSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent'], required: true },
});

const studentSchema = new mongoose.Schema({
    rollNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true, default: "123" },
    fullName: { type: String, required: true },
    grade: { type: String, required: true },
    dob: { type: Date, required: true },
    parents: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        number: { type: String, required: true },
    },
    marks: [marksSchema],
    attendance: [attendanceSchema],
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
