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
import Feedback from './models/feedback.models.js';
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
    res.render("login-faculty",{error:null});
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
    res.render('admission'); // Render the admission form page
});



app.post('/faculty/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the faculty exists with the provided email and password
        const user = await Faculty.findOne({ email, password });

        if (user) {
            // Redirect to the faculty panel with faculty email
            res.redirect(`/faculty/${email}`);
        } else {
            const errorMsg = 'Invalid email or password!';
            res.render('login-faculty', { error: errorMsg });
        }
    } catch (error) {
        const errorMsg = 'An error occurred during login!';
        res.render('login-faculty', { error: errorMsg });
    }
});

app.get('/faculty/:email', async (req, res) => {
    const { email } = req.params;
    const faculty = await Faculty.findOne({ email });

    if (!faculty) {
        return res.redirect('/faculty/login');
    }

    const { grade } = faculty;
    const students = await Student.find({ grade });

    res.render('faculty', { faculty, students });
});

app.post('/faculty/add-class-marks', async (req, res) => {
    const { email } = req.body;
    const faculty = await Faculty.findOne({ email });

    const { subject, totalMarks, students } = req.body;
    for (const studentData of students) {
        const student = await Student.findById(studentData.studentId);
        if (student.grade !== faculty.grade) {
            return res.status(403).send('Unauthorized access');
        }
        student.marks.push({
            subject,
            marks: studentData.marks,
            term: studentData.term,
        });
        student.totalMarks = totalMarks;  // Update total marks for the student
        await student.save();
    }

    res.redirect(`/faculty/${faculty.email}`);
});

app.get('/faculty/view-attendance/:email', async (req, res) => {
    const { email } = req.params; // Get the faculty email from route parameters
    const { attendanceDate } = req.query; // Get the selected date from the query

    // Set selectedDate to today's date if no attendanceDate is provided
    const selectedDate = attendanceDate
        ? new Date(attendanceDate).toLocaleDateString()
        : new Date().toLocaleDateString(); // Default to today's date

    // Find the faculty using the provided email
    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
        return res.status(404).send('Faculty not found');
    }

    // Fetch all students in the same grade as the faculty
    const students = await Student.find({ grade: faculty.grade });

    // Filter students' attendance based on the selected date
    const filteredStudents = students.map(student => {
        student.attendance = student.attendance.filter(attendance => {
            return new Date(attendance.date).toLocaleDateString() === selectedDate;
        });
        return student;
    });

    // Render the view and pass required data
    res.render('view-attendance', { faculty, students: filteredStudents, selectedDate });
});

app.post('/faculty/add-attendance/:email', async (req, res) => {
    const { email } = req.params;
    const faculty = await Faculty.findOne({ email });

    if (!faculty) {
        return res.status(404).send('Faculty not found');
    }

    const { attendance } = req.body; // { studentId: status } pairs
    const currentDate = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    for (const studentId in attendance) {
        const student = await Student.findById(studentId);

        if (student.grade !== faculty.grade) {
            return res.status(403).send('Unauthorized access');
        }

        // Check if attendance for today has already been marked
        const existingAttendance = student.attendance.find(
            (entry) => entry.date.toISOString().split('T')[0] === currentDate
        );

        if (existingAttendance) {
            // Attendance already marked for today
            return res.status(400).send(`Attendance already marked for student ${student.name}`);
        }

        // Mark attendance
        student.attendance.push({
            date: new Date(),
            status: attendance[studentId],
        });
        await student.save();
    }

    res.redirect(`/faculty/${faculty.email}`);
});



app.get('/faculty/add-attendance/:email', async (req, res) => {
    const { email } = req.params; // Get faculty email from the route

    try {
        // Find the faculty using their email
        const faculty = await Faculty.findOne({ email });

        if (!faculty) {
            return res.status(404).send('Faculty not found');
        }

        // Fetch students in the same grade as the faculty
        const students = await Student.find({ grade: faculty.grade });

        // Render the attendance form and pass faculty, students, and faculty grade to the view
        res.render('addattendance', { faculty, students, grade: faculty.grade });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving data.');
    }
});


// Route to display add marks form for a specific faculty
app.get('/faculty/add-marks/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const faculty = await Faculty.findOne({ email }); // Assuming Faculty model exists
        const students = await Student.find({ grade: faculty.grade }); // Fetch students in the same grade
        res.render('add-marks', { faculty, students, subject: '', term: '',error:null,totalmarks:"",marks:"" });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error retrieving data');
    }
});
// Route to handle submission of marks
app.post('/faculty/add-marks/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { subject, term, totalmarks, marks } = req.body;

        // Validate that marks are not greater than total marks
        for (const studentId in marks) {
            const studentMarks = marks[studentId];
            
            // If student's marks are greater than total marks, show an error
            if (parseInt(studentMarks) > parseInt(totalmarks)) {
                return res.status(400).render('add-marks', {
                    error: `Marks for student with Roll Number ${studentId} cannot be greater than the total marks.`,
                    faculty: req.faculty,  // Send faculty details for rendering
                    students: await Student.find({ grade: req.faculty.grade }),
                    subject,
                    term,
                    totalmarks
                });
            }
        }

        // Loop through the students and update their marks
        for (const studentId in marks) {
            const student = await Student.findById(studentId);
            student.marks.push({
                subject: subject,
                term: term,
                totalmarks: totalmarks,
                marks: marks[studentId], // Marks obtained for the student
            });
            await student.save();
        }

        res.redirect(`/faculty/view-marks/${email}`); // Redirect to view marks page
    } catch (err) {
        console.log(err);
        res.status(500).send('Error saving marks');
    }
});

app.get('/faculty/edit-marks/:email', async (req, res) => {
    const { email } = req.params;

    // Find the faculty
    const faculty = await Faculty.findOne({ email });

    // You can fetch all students for a specific grade if needed
    const students = await Student.find({ grade: faculty.grade });

    // Find the student's marks based on the faculty's grade and term (for example)
    const { rollNumber, subject, term, date, marks } = req.query; // Pass these details via query or route params

    // Render the page with existing student data
    res.render('edit-marks', {
        faculty,
        rollNumber,
        subject,
        term,
        date,
        marks
    });
});
app.post('/faculty/edit-marks/:email', async (req, res) => {
    const { email } = req.params;
    const { rollNumber, subject, term, date, marks } = req.body;

    try {
        // Find the student by roll number
        const student = await Student.findOne({ rollNumber });

        if (!student) {
            return res.status(404).send("Student not found!");
        }

        // Find the mark entry by matching subject, term, and date
        const markEntry = student.marks.find(mark => 
            mark.subject === subject && 
            mark.term === term && 
            mark.date.toISOString().split('T')[0] === date
        );

        if (!markEntry) {
            return res.status(404).send("Marks entry not found!");
        }

        // Update the marks
        markEntry.marks = marks;

        // Save the updated student document
        await student.save();

        // Redirect or render success message
        res.redirect(`/faculty/view-marks/${email}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while updating marks.");
    }
});

app.get('/faculty/view-marks/:email', async (req, res) => {
    const { email } = req.params; // Get faculty email from URL
    const { subject, term, date } = req.query;  // Get subject, term, and date from query parameters

    const faculty = await Faculty.findOne({ email }); // Find faculty by email

    if (!faculty) {
        return res.status(404).send('Faculty not found');
    }

    // Find all students in the same grade as the faculty
    const students = await Student.find({ grade: faculty.grade });

    if (!students) {
        return res.status(404).send('No students found in this grade');
    }

    // If no date filter is provided, set the date to today's date
    let filterDate = date || new Date().toISOString().split('T')[0];  // Default to today's date (YYYY-MM-DD)

    // If filters are provided, filter the marks accordingly
    students.forEach((student) => {
        if (subject || term || date) {
            student.marks = student.marks.filter((mark) => {
                let matches = true;
                if (subject) {
                    matches = matches && mark.subject.toLowerCase() === subject.toLowerCase();
                }
                if (term) {
                    matches = matches && mark.term.toLowerCase() === term.toLowerCase();
                }
                // Match the date, if provided
                if (date) {
                    matches = matches && new Date(mark.date).toISOString().split('T')[0] === filterDate;
                } else {
                    // If no date filter, match today's date by default
                    matches = matches && new Date(mark.date).toISOString().split('T')[0] === filterDate;
                }
                return matches;
            });
        }
    });

    res.render('view-marks', {
        faculty,
        students,
        subject,  // Pass subject filter to the view
        term,     // Pass term filter to the view
        date: filterDate, // Pass the filtered date or today's date to the view
    });
});

// Student Login Route
app.get('/student/login', function (req, res) {
    res.render("login-student");
});



app.post('/student/login', async (req, res) => {
    const { rollNumber, password } = req.body;

    try {
        // Find the student by roll number
        const student = await Student.findOne({ rollNumber });

        // Check if the student exists and password matches
        if (!student || student.password !== password) {
            return res.status(401).send('Invalid roll number or password');
        }

        // Redirect to the student's dashboard
        res.redirect(`/student/${student.rollNumber}`);
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// **2. Dashboard Route**
app.get('/student/:rollNumber', async (req, res) => {
    const { rollNumber } = req.params;

    try {
        // Find student by roll number
        const student = await Student.findOne({ rollNumber });

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Render the dashboard view with student data
        res.render('student', { student });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/student/view-marks/:rollNumber', async (req, res) => {
    const { rollNumber } = req.params;

    try {
        // Find student and populate their marks
        const student = await Student.findOne({ rollNumber }).select('marks');

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Render marks page
        res.render('viewS-marks', { marks: student.marks,student });
    } catch (error) {
        console.error('View Marks Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// app.get('/student/view-marks/:rollNumber', async (req, res) => {
//     const { rollNumber } = req.params;
//     console.log('Roll Number:', rollNumber); // Debug log

//     try {
//         const student = await Student.findOne({ rollNumber }).select('marks');
//         console.log('Student Found:', student); // Debug log

//         if (!student) {
//             return res.status(404).send('Student not found');
//         }

//         res.render('viewMarks', { marks: student.marks });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// **4. View Attendance Route**
app.get('/student/view-attendance/:rollNumber', async (req, res) => {
    const { rollNumber } = req.params;
    const queryDate = req.query.date || new Date().toISOString().split('T')[0]; // Default to today's date

    try {
        // Find student and filter attendance for the queried date
        const student = await Student.findOne({ rollNumber }).select('attendance');

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Filter attendance for the specific day
        const attendanceForDate = student.attendance.filter((record) => {
            const recordDate = new Date(record.date).toISOString().split('T')[0];
            return recordDate === queryDate;
        });

        // Render attendance view with the filtered data
        res.render('viewAttendance', { 
            attendance: attendanceForDate, 
            rollNumber,
            queryDate
        });
    } catch (error) {
        console.error('View Attendance Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/student/view-result/:rollNumber', async (req, res) => {
    const { rollNumber } = req.params;

    try {
        // Find student by roll number
        const student = await Student.findOne({ rollNumber });

        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Create an object to hold the most recent marks for each subject
        const subjectMarks = {};

        // Iterate over all marks and overwrite if the subject is already present
        student.marks.forEach(mark => {
            if (mark.term === 'final' || mark.term === 'Mid Term') {
                // If subject already exists, override the marks
                if (subjectMarks[mark.subject]) {
                    subjectMarks[mark.subject] = mark; // Override the previous marks
                } else {
                    subjectMarks[mark.subject] = mark;
                }
            }
        });

        // Convert the subjectMarks object back to an array for rendering
        const filteredMarks = Object.values(subjectMarks);

        // Calculate total marks and obtained marks
        const totalMarks = filteredMarks.reduce((acc, mark) => acc + mark.totalmarks, 0);
        const obtainedMarks = filteredMarks.reduce((acc, mark) => acc + mark.marks, 0);

        // Calculate grade
        let grade = "";
        if (obtainedMarks / totalMarks < 0.5) {
            grade = "F"; // Fail grade
        } else if (obtainedMarks / totalMarks >= 0.5 && obtainedMarks / totalMarks < 0.6) {
            grade = "C";
        } else if (obtainedMarks / totalMarks >= 0.6 && obtainedMarks / totalMarks < 0.75) {
            grade = "B";
        } else {
            grade = "A"; // Top grade
        }

        // Set grade message
        let message = "";
        if (grade === "F") {
            message = "Unfortunately, you have failed. Please consult with your teacher.";
        } else {
            message = "Congratulations on your performance!";
        }

        // Render the result page with data
        res.render('viewResult', {
            marks: filteredMarks, // Pass filtered marks array
            rollNumber: student.rollNumber,
            studentName: student.fullName,
            grade: grade,
            totalMarks,
            obtainedMarks,
            message: message // Pass the message for display
        });

    } catch (error) {
        console.error('View Result Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/parent/login",(req,res)=>{
    res.render("login-parent");
})

// Handle Login Form Submission
app.post('/parent/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find student by parent's email and password
        const student = await Student.findOne({ 
            'parents.email': email, 
            password 
        });

        if (student) {
            // Redirect to dashboard with parent's email in the URL
            res.redirect(`/parent/${encodeURIComponent(email)}`);
        } else {
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.render('login', { error: 'Something went wrong. Please try again.' });
    }
});

// Render Dashboard for a Specific Parent
app.get('/parent/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const student = await Student.findOne({ 'parents.email': email });

        if (student) {
            res.render('parentDashboard', {
                parentEmail: email,
                student,
            });
        } else {
            res.status(404).send('Parent or student data not found.');
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Child Marks
app.get('/parent/marks/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const student = await Student.findOne({ 'parents.email': email });

        if (student) {
            res.render('marks', {
                parentEmail: email,
                marks: student.marks,
            });
        } else {
            res.status(404).send('Marks not found.');
        }
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Child Attendance
app.get('/parent/attendance/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const student = await Student.findOne({ 'parents.email': email });

        if (student) {
            res.render('attendance', {
                parentEmail: email,
                attendance: student.attendance,
            });
        } else {
            res.status(404).send('Attendance not found.');
        }
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Child Feedback
app.get('/parent/feedback/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const student = await Student.findOne({ 'parents.email': email });

        if (student) {
            res.render('feedback', {
                parentEmail: email,
                feedback: student.feedback || "No feedback available.",
                message: "We appreciate your feedback!" // Passing the message to the EJS template
            });
        } else {
            res.status(404).send('Feedback not found.');
        }
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/parent/feedback/:email', async (req, res) => {
    const { email } = req.params;
    const { feedback } = req.body;

    try {
        // Find the student by parent's email
        const student = await Student.findOne({ 'parents.email': email });

        if (student) {
            // Save the feedback to the Feedback model
            const newFeedback = new Feedback({
                parentEmail: email,
                studentName: student.fullName,
                message: feedback
            });

            // Save the feedback to the database
            await newFeedback.save();

            res.render('feedback', {
                parentEmail: email,
                feedback: feedback,  // Display the feedback entered by the parent
                message: "Thank you for your feedback!"  // Success message
            });
        } else {
            res.status(404).send('Student not found.');
        }
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/admin/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 }); // Sorting by date, descending order
        res.render('admin_feedback', { feedbacks });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).send('Internal Server Error');
    }
});

// In your Express.js route file (e.g., routes/admin.js)

app.post('/admin/feedback/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Delete the feedback using the provided ID
        await Feedback.findByIdAndDelete(id);
        
        // Redirect back to the feedback page after deletion
        res.redirect('/admin/feedback');
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/admission', async (req, res) => {
    const { studentName, age, grade, parentEmail, phoneNumber, address } = req.body;
    console.log(req.body);
    try {
        const admission = new Admission({
            studentName,
            age,
            grade,
            parentEmail,
            phoneNumber, // Ensure this matches the schema
            address,
        });
        await admission.save();
        res.redirect('/admission'); // Adjust redirect as needed
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while submitting the application.');
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 5000");
});
