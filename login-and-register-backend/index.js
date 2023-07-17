const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000; // Change the port to 5000

app.use(express.json());
app.use(cors());

async function connection() {
    try {
        await mongoose.connect("mongodb://mongo:27017/myLoginRegisterDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
          

        console.log('DB Connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

connection();

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

// Routes
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (user) {
            if (password === user.password) {
                return res.send({ message: "Login Successful", user: user });
            } else {
                return res.send({ message: "Password didn't match" });
            }
        } else {
            return res.send({ message: "User not registered", data: user });
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

app.post("/register", async (req, res) => {
    console.log("this is register");
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (user) {
            return res.send({ message: "User already registered" });
        } else {
            const newUser = new User({
                name,
                email,
                password
            });
            await newUser.save();

            return res.send('Success');
        }
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Backend started at port ${port}`);
});
