const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const Employee = require("./models/Employee");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const connect = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database Connected Successfully !!!!"))
    .catch((err) => console.error("Database Connection Failed", err));
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send({ message: "Email already exists" });
  }
  const user = new User({ email, password: bcrypt.hashSync(password, 10) });
  await user.save();
  res.send({ message: "User registered" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ _id: user._id }, "your_jwt_secret");
    res.send({ message: "Login successful", token });
  } else {
    res.status(401).send({ message: "Invalid login details" });
  }
});

app.post("/api/employees", upload.single("image"), async (req, res) => {
  const { name, email, mobile, designation, gender, courses } = req.body;
  const image = req.file.filename;
  const employee = new Employee({
    name,
    email,
    mobile,
    designation,
    gender,
    courses: courses.split(","),
    image,
  });
  await employee.save();
  res.send({ message: "Employee created" });
});

app.get("/api/employees", async (req, res) => {
  const employees = await Employee.find();
  res.send(employees);
});

app.put("/api/employees/:id", upload.single("image"), async (req, res) => {
  const { name, email, mobile, designation, gender, courses } = req.body;
  const image = req.file ? req.file.filename : req.body.image;
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      name,
      email,
      mobile,
      designation,
      gender,
      courses: courses.split(","),
      image,
    },
    { new: true }
  );
  res.send(employee);
});

app.get("/api/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).send({ message: "Employee not found" });
    res.send(employee);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.send({ message: "Employee deleted" });
});

connect();
app.listen(5004, () => {
  console.log("Backend server running on port 5000");
});
