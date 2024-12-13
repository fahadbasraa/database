import express from 'express';
import ejs from 'ejs';
import dotenv from 'dotenv';
import connectdb from './db/db.js';
import User from './models/signup.model.js'; 
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Userlogin from './models/login.model.js';

dotenv.config({ path: './.env' });
connectdb();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set("view engine","ejs");

app.use(express.static("./public"))

app.post('/newpassword', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's password
        user.password = newPassword; // Ensure password is hashed in production
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
});


app.post('/newpassword.html', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email }); // Adjust for your DB logic

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure password is hashed before saving in production
        user.password = newPassword; // Use bcrypt.hash(newPassword, saltRounds) in production
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
});


app.get('/first.html', function (req, res) {
    res.render("first",{title: "SMS"})
})

app.get('/login', function (req, res) {
    res.render("login")
})
app.get('/login.html', function (req, res) {
    res.render("login")
})
app.get('/', function (req, res) {
    res.render("index",{name:"Sabri Public High School"})
})

app.get('/home.html', function (req, res) {
    res.render("index",{name:"Sabri Public High School"})
})

app.get('/admission.html', function (req, res) {
    res.render("admission")
})

app.get('/community.html', function (req, res) {
    res.render("community")
})

app.get('/admin.html', function (req, res) {
    res.render("admin")
})

app.get('/student.html', function (req, res) {
    res.render("student",{name:"Fahad"})
})

app.get('/faculty.html', function (req, res) {
    res.render("faculty")
})

app.get('/parent.html', function (req, res) {
    res.render("parent")
})

app.get('/addGrades.html', function (req, res) {
    res.render("addGrades")
})

app.get('/addAttendance.html', function (req, res) {
    res.render("addAttendance")
})
app.get('/signup.html', function (req, res) {
    res.render("signup")
})

app.get('/forget.html', function (req, res) {
    res.render("forget")
})
app.post('/forget', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });  // Send an error response if email not found
        }

        // If email exists, send a success response
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

        // Update the user's password
        user.password = newPassword; // Ensure to hash the password in production
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If the user doesn't exist
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // If the password does not match
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // If login is successful
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error during login' });
    }
});

app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.redirect('/signup.html?message=User with this email already exists');
        }

        // Validate passwords
        if (password !== confirmPassword) {
            return res.redirect('/signup.html?message=Passwords do not match');
        }

        // Additional regex validation before saving
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.redirect('/signup.html?message=Password must contain at least one uppercase letter, one number, and be at least 8 characters long');
        }

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password, // Storing password as is (not recommended for production)
            role,
        });

        // Save the user to the database
        await newUser.save();
        res.redirect('/signup.html?message=User created successfully');
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.redirect('/signup.html?message=Error creating user');
    }
});
app.listen(5000,()=>{
    console.log("server is available");
    
})