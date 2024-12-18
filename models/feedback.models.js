import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    parentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
