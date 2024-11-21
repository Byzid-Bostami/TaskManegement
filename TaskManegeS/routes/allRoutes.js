const express = require('express');
const router = express.Router();
const { User, Task } = require('./../models/mongooseSchema');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// JWT Passport Strategy Configuration
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

router.use(passport.initialize());

// Register Route
router.post('/register', async (req, res) => {
    const { userName, userMail, password } = req.body;

    try {
        // Check if username or email already exists
        const existedUser = await User.findOne({ userName });
        const existedMail = await User.findOne({ userMail });
        if (existedUser) {
            return res.status(409).json('Username is already taken');
        }
        if (existedMail) {
            return res.status(409).json('Email is already taken');
        }

        // Hash the password and save user
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).json('Error hashing password');
            }

            const newUser = new User({
                userName,
                userMail,
                password: hash,
            });

            await newUser.save();
            res.status(201).json('User registered successfully');
        });

    } catch (error) {
        res.status(500).json(`Something went wrong: ${error.message}`);
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { userName, userMail, password } = req.body;

    try {
        // Check if user or email exists
        const existedUser = await User.findOne({ userName });
        const existedMail = await User.findOne({ userMail });

        if (!existedUser) {
            return res.status(404).send("Username not found");
        }
        if (!existedMail) {
            return res.status(404).send("Email not found");
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, existedUser.password);
        if (!isMatch) {
            return res.status(404).send('Password does not match');
        }

        // Create JWT payload and sign it
        const payload = { id: existedUser._id, userName: existedUser.userName, userMail: existedUser.userMail };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            userName: existedUser.userName,
            userMail: existedUser.userMail,
            token: 'Bearer ' + token,
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Protected Route to Get Tasks
router.get('/', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }); // Get tasks for the authenticated user
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send("Data is not displaying, something went wrong");
    }
});


router.post('/', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { title, description, completed, dueDate } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            completed,
            dueDate,
            user: req.user._id,
        });

        await newTask.save();
        res.status(201).json('Task saved successfully');
    } catch (error) {
        res.status(500).json(`Data is not saved: ${error.message}`);
    }
});

router.put('/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { title, description, completed, dueDate } = req.body;
    const taskId = req.params.id;

    try {
        const task = await Task.findOne({ _id: taskId, user: req.user._id });

        if (!task) {
            return res.status(404).json('Task not found or you do not have permission to update this task');
        }

        // Update fields if provided
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;
        task.dueDate = dueDate || task.dueDate;

        await task.save();
        res.status(200).json('Task updated successfully');
    } catch (error) {
        res.status(500).json(`Error updating task: ${error.message}`);
    }
});

// Delete Task
router.delete('/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await Task.deleteOne({ _id: taskId, user: req.user._id });

        if (!task) {
            return res.status(404).json('Task not found or you do not have permission to delete this task');
        }

        res.status(200).json('Task deleted successfully');
    } catch (error) {
        res.status(500).json(`Error deleting task: ${error.message}`);
    }
});

// Catch-all 404 Route
router.use((req, res, next) => {
    res.status(404).send('Page not found');
});

module.exports = router;
