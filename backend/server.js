// server.js

const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
require("dotenv").config()

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors())

// register user
app.post("/api/register", async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const userExists = await prisma.user.findUnique({
      where: { email: email }
    })

    if (userExists) {
      res.status(400).json({ message: "User already exists" })
    } else {
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
          role: role
        }
      })
      console.log("User created:", user.email)
      res.json({ message: "User Registered!", user })
    }
  } catch (err) {
    console.log(err)
    res.json({ message: "Something went wrong" })
  }
})

// login user
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email: email }
    })

    if (!user) {
      res.json({ message: "User not found" })
    } else if (user.password !== password) {
      res.json({ message: "Wrong password" })
    } else {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      )
      console.log("User logged in:", email)
      res.json({ message: "Login successful", token, role: user.role })
    }
  } catch (err) {
    console.log("Login error:", err)
    res.json({ message: "Login failed" })
  }
})

// token verify
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.json({ message: "No token found" })
  } else {
    const token = authHeader.split(" ")[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (err) {
      console.log("Token invalid")
      res.json({ message: "Token invalid" })
    }
  }
}

// student route
app.get("/api/student", verifyToken, (req, res) => {
  if (req.user.role === "student") {
    res.json({ message: "Welcome Student Dashboard 🎓" })
  } else {
    res.json({ message: "Not allowed, only students" })
  }
})

// admin route
app.get("/api/admin", verifyToken, (req, res) => {
  if (req.user.role === "admin") {
    res.json({ message: "Welcome Professor Dashboard 🧑‍🏫" })
  } else {
    res.json({ message: "Not allowed, only admin" })
  }
})

app.get("/", (req, res) => {
  res.send("Server running fine!")
})

// start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log("Server started on port", PORT)
})
