import express from 'express';
import ejs from 'ejs';
import dotenv from 'dotenv';
import connectdb from './db/db.js';
import User from './models/signup.model.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Student from './models/student.models.js';
import Faculty from './models/faculty.models.js';
import Userlogin from './models/login.model.js';
import mongoose from 'mongoose';
import { error } from 'console';
import Admission from './models/admission.models.js';
const app = express();
app.set("view engine", "ejs");

dotenv.config({ path: './.env' });
connectdb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

app.get('/first.html', function (req, res) {
    res.render("first", { title: "SMS" });
});

app.get('/faculty/login', function (req, res) {
    res.render("login-faculty");
});
app.get('/student/login', function (req, res) {
    res.render("login-student");
});

app.get('/login', function (req, res) {
    res.render("login-admin");
});

app.get('/', function (req, res) {
    res.render("index", { name: "Sabri Public High School" });
});

app.get('/home.html', function (req, res) {
    res.render("index", { name: "Sabri Public High School" });
});


app.get('/community.html', function (req, res) {
    res.render("community");
});
app.get('/admin', function (req, res) {
    res.render("admin");
});

app.get('/faculty', function (req, res) {
    res.render("faculty");
});

app.get('/parent.html', function (req, res) {
    res.render("parent");
});

app.get('/addGrades.html', function (req, res) {
    res.render("addGrades");
});

app.get('/addAttendance.html', function (req, res) {
    res.render("addAttendance");
});

app.get('/signup.html', function (req, res) {
    res.render("signup");
});

app.get('/forget.html', function (req, res) {
    res.render("forget");
});

app.post('/forget', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }

        res.status(200).json({ message: 'Email found. You can reset your password.' });

    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
});

app.post('/newpassword.html', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
});
app.get('/admin/login', (req, res) => {
    res.render('login-admin', { errorMessage:"" }); // Pass error as null initially
});
app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find an admin user
        const user = await User.findOne({ email, password, role: 'admin' });

        if (user) {
            res.redirect('/admin'); // Redirect to admin dashboard
        } else {
            const errorMsg = 'Invalid email, password, or not an admin!';
            console.log("Error message sent to EJS:", errorMsg); // Debugging statement
            res.render('login-admin', { errorMessage: 'Invalid email or password'  });
        }
    } catch (error) {
        const errorMsg = 'Invalid email, password, or not an admin!';
            console.log("Error message sent to EJS:", errorMsg); // Debugging statement
            res.render('login', { error: errorMsg });
    }
});
app.post('/faculty/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find an admin user
        const user = await User.findOne({ email, password, role: 'faculty' });

        if (user) {
            res.redirect('/faculty'); // Redirect to admin dashboard
        } else {
            const errorMsg = 'Invalid email, password, or not an admin!';
            console.log("Error message sent to EJS:", errorMsg); // Debugging statement
            res.render('login-faculty', { error: errorMsg });
        }
    } catch (error) {
        const errorMsg = 'Invalid email, password, or not an admin!';
            console.log("Error message sent to EJS:", errorMsg); // Debugging statement
            res.render('login', { error: errorMsg });
    }
});

app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect('/signup.html?message=User with this email already exists');
        }

        if (password !== confirmPassword) {
            return res.redirect('/signup.html?message=Passwords do not match');
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.redirect('/signup.html?message=Password must contain at least one uppercase letter, one number, and be at least 8 characters long');
        }

        const newUser = new User({
            name,
            email,
            password,
            role,
        });

        await newUser.save();
        res.redirect('/signup.html?message=User created successfully');
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.redirect('/signup.html?message=Error creating user');
    }
});

app.get('/admin/admission-form', async (req, res) => {
    const admissions = await Admission.find(); // Fetch admission requests
    res.render('admission-form', { admissions });
});

app.get('/admin/view-faculty', (req, res) => {
    res.render('view-teachers'); // Render the "View Teachers" page
});
app.get('/admin/search-teacher', async (req, res) => {
    const { name, facultyId } = req.query;
    try {
        let query = {};
        if (name) {
            query.fullName = { $regex: name, $options: 'i' }; // case-insensitive search by name
        }
        if (facultyId) {
            query.facultyId = facultyId;
        }

        const faculties = await Faculty.find(query);
        res.render('search-teacher', { faculties, searchName: name, searchFacultyId: facultyId, err: null }); // Pass `err: null` when there's no error
    } catch (err) {
        res.render('search-teacher', { err: 'An error occurred while searching teachers.', faculties: [] }); // Pass the error message
    }
});

app.get('/admin/drop-teacher', (req, res) => {
    res.render('drop-teacher',{err:null,success:null}); // Render the "Drop Teacher" page
});
app.get('/admin/view-students', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('view-students', { students }); // Ensure the EJS file exists
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).send('Error fetching students');
    }
});


app.get('/admin/add-student', (req, res) => {
    res.render('addstudent'); // Render the add-student form
});

app.post('/admin/add-student', async (req, res) => {
    const { rollNumber, password, fullName, grade, dob, parentsName, parentEmail, parentPhoneNumber } = req.body;

    try {
        // Check if a student with the same roll number already exists
        const existingStudent = await Student.findOne({ rollNumber });

        if (existingStudent) {
            // If student exists, return an error
            return res.status(400).send('A student with this roll number already exists.');
        }

        // Create a new student instance
        const student = new Student({
            rollNumber,
            password,
            fullName,
            grade,
            dob,
            parents: {
                name: parentsName,
                email: parentEmail,
                number: parentPhoneNumber
            }
        });

        // Save the student to the database
        await student.save();
         res.redirect('/admin/view-students'); // Redirect after successful registration
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering the student. Please try again later.');
    }
});

// Route: Login Page (GET)
app.get('/student/login', (req, res) => {
    res.render('login'); // Render the login.ejs page
});

// Route: Handle Login (POST)
app.post('/student/login', async (req, res) => {
    const { rollNumber, password } = req.body;

    try {
        // Find the student by roll number and password
        const student = await Student.findOne({ rollNumber, password });

        if (student) {
            // Render the student.ejs page and pass only the student's name
            res.render('student', { name: student.fullName });
        } else {
            res.status(401).send('Invalid roll number or password'); // Unauthorized
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/admin/add-faculty', (req, res) => {
    res.render('add-faculty', { error: null }); // Pass null for error initially
});

// POST route to add a faculty member
app.post('/admin/add-faculty', async (req, res) => {
    const { username, password, email, fullName, grade, phoneNumber, facultyId } = req.body;

    try {
        // Check for existing faculty with the same facultyId
        const existingFaculty = await Faculty.findOne({ facultyId });
        if (existingFaculty) {
            return res.render('add-faculty', { 
                error: 'A faculty member with this Faculty ID already exists.' 
            });
        }

        // Check for existing faculty with the same email
        const existingEmail = await Faculty.findOne({ email });
        if (existingEmail) {
            return res.render('add-faculty', { 
                error: 'A faculty member with this email already exists.' 
            });
        }

        // Create a new faculty entry
        const faculty = new Faculty({
            username,
            password,
            email,
            fullName,
            grade,
            phoneNumber,
            facultyId,
        });

        await faculty.save();
        res.redirect('/admin/view-teachers'); // Redirect to view all faculty after saving
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving faculty. Please try again later.');
    }
});


app.get('/admin/view-teachers', async (req, res) => {
    try {
        const faculties = await Faculty.find(); // Get all teachers
        const totalteacher = await Student.countDocuments(); // Get the total number of students
        res.render('view-teachers', { faculties, totalteacher, err: null });
    } catch (err) {
        res.render('view-teachers', { err: 'An error occurred while fetching teachers or students.', faculties: [], totalStudents: 0 });
    }
});

app.post('/admin/drop-teacher', async (req, res) => {
    const { facultyId } = req.body; // Get the facultyId from the request body

    try {
        // Find and remove the teacher by facultyId
        const teacher = await Faculty.findOneAndDelete({ facultyId });

        if (!teacher) {
            return res.render('drop-teacher', { err: 'Teacher not found.' });
        }

        // Redirect to the view-teachers page after successful deletion
        res.redirect('/admin/view-teachers'); // Redirects to the page where all teachers are listed
    } catch (err) {
        // Handle any errors during the deletion process
        res.render('drop-teacher', { err: 'An error occurred while dropping the teacher.' });
    }
});


app.get('/student-summary', async (req, res) => {
    try {
        const classes = await Student.aggregate([
            {
                $group: {
                    _id: "$grade",
                    count: { $sum: 1 }
                }
            }
        ]);

        // If a specific class is selected, fetch the students
        const selectedClass = req.query.class;
        let students = [];
        if (selectedClass) {
            students = await Student.find({ grade: selectedClass });
        }

        res.render('student-summary', { classes, selectedClass, students });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Route for searching students
app.get('/admin/search-student', async (req, res) => {
    try {
        const { rollNumber, name } = req.query;

        // Construct search criteria
        const searchCriteria = {};
        if (rollNumber) {
            searchCriteria.rollNumber = rollNumber;
        }
        if (name) {
            searchCriteria.fullName = { $regex: new RegExp(name, 'i') }; // Case-insensitive match
        }

        // Fetch students based on criteria
        const students = await Student.find(searchCriteria);

        res.render('search-student', { students, rollNumber, name });
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to render the "Drop Student" page
app.get('/admin/drop-student', (req, res) => {
    res.render('drop-student', { message: null });
});

// Route to handle student deletion by roll number
app.post('/admin/drop-student', async (req, res) => {
    const { rollNumber } = req.body;

    if (!rollNumber) {
        return res.render('drop-student', { message: 'Please provide a roll number.' });
    }

    try {
        // Find and delete the student by roll number
        const result = await Student.findOneAndDelete({ rollNumber });

        if (result) {
            res.render('drop-student', { message: `Student with Roll Number ${rollNumber} has been successfully removed.` });
        } else {
            res.render('drop-student', { message: `No student found with Roll Number ${rollNumber}.` });
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).render('drop-student', { message: 'An error occurred while deleting the student.' });
    }
});

app.get('/admin/add-faculty', (req, res) => {
    res.render('add-faculty');  // Renders the add-faculty.ejs page
});

// Route to handle the form submission
app.post('/admin/add-faculty', async (req, res) => {
    const { email, password, fullName, grade, phoneNumber, facultyId } = req.body;

    try {
        // Create a new Faculty document
        const newFaculty = new Faculty({
            email,
            password,  // Store the plain-text password
            fullName,
            grade,
            phoneNumber,
            facultyId
        });

        // Save the new faculty to the database
        await newFaculty.save();

        // Redirect to the faculty list page (or any other success page)
        res.redirect('/admin/faculty-list');
    } catch (err) {
        console.error(err);
        res.render('add-faculty', { error: 'An error occurred while adding the faculty member' });
    }
});

app.get('/view-teachers', async (req, res) => {
    try {
        // Fetch all faculties (teachers) from the database
        const teachers = await Faculty.find();

        // Render the EJS template and pass the teachers data
        res.render('admin/view-teachers', { teachers });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).send('Internal Server Error');
    }
});

// mongoose.connection.once('open', async () => {
//     console.log('MongoDB connection is open');

//     // Drop the index
//     try {
//         await mongoose.connection.db.collection('faculties').dropIndex('username_1');
//         console.log('Index dropped successfully');
//     } catch (err) {
//         console.error('Error dropping index:', err.message);
//     } finally {
//         mongoose.disconnect();
//     }
// });

app.get('/admin/search-teacher', async (req, res) => {
    const { name, facultyId } = req.query;
    try {
        let query = {};
        if (name) {
            query.fullName = { $regex: name, $options: 'i' }; // case-insensitive search by name
        }
        if (facultyId) {
            query.facultyId = facultyId;
        }

        const faculties = await Faculty.find(query);
        res.render('search-teacher', { faculties, searchName: name, searchFacultyId: facultyId });
    } catch (err) {
        res.render('search-teacher', { err: 'An error occurred while searching teachers.' });
    }
});

app.get('/admission', (req, res) => {
    res.render('admission',{success:null,error:null}); // Render the admission form page
});

// POST route to handle form submission
app.post('/admission', async (req, res) => {
    try {
        const { studentName, age, grade, email, phone, address } = req.body;

        // Validate the data
        if (!studentName || !age || !grade || !email || !phone || !address) {
            return res.render('admission', { error: 'All fields are required.' });
        }

        // Create a new admission record
        const admission = new Admission({
            studentName,
            age,
            grade,
            email,
            phone,
            address
        });

        // Save the admission to the database
        await admission.save();
        
        // Send success message if saved successfully
        res.render('admission', { success: 'Application submitted successfully!' });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.render('admission', { error: 'An error occurred while submitting the application' });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 5000");
});
