import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust the path as necessary
import multer from "multer";

const secretKey = "your_secret_key"; // Use a secure way to manage your secrets in production

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export const registerRoutes = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", status: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      image: req.file ? req.file.path : "",
    });

    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", status: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Login route
export const LoginRoutes = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", status: false });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", status: false });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      status: true,
      data: { token, _id: user._id },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging in", error: err.message, status: false });
  }
};

// get all users
export const GetAllUsersRoutes = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    const message_count = 0;
    
    // Check if there are no users
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the list of users
    res.status(200).json({ message: "Users found", data: users, status: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};
