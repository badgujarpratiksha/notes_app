// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create an instance of Express
const app = express();

// Parse requests with JSON payloads
app.use(bodyParser.json());

// Connect to MongoDB (assuming MongoDB is running locally)
mongoose.connect('mongodb://localhost:27017/notes_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the application if unable to connect to MongoDB
});

// Define Note schema
const NoteSchema = new mongoose.Schema({
    title: String,
    content: String,
    created_at: Date,
    tags: [String],
    attachments: [{ filename: String, url: String }]
});

// Define Note model
const Note = mongoose.model('Note', NoteSchema);

// Define User schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    date_of_birth: Date,
    profile_image: String,
    created_at: Date,
    last_login_at: Date,
    is_active: Boolean,
    roles: [String]
});

// Define User model
const User = mongoose.model('User', UserSchema);

// Define routes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});