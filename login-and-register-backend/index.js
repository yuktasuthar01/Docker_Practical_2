const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const app = express();
const port = process.env.PORT || 5000; // Change the port to 5000

app.use(express.json());
app.use(cors());

async function connection() {
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
          

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
            // Compare the provided password with the hashed password from the database
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
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
            // Hash the password before saving
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                name,
                email,
                password: hashedPassword // Store the hashed password in the database
            });
            await newUser.save();

            return res.send({ message: "Success" });
        }
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Backend started at port ${port}`);
});
