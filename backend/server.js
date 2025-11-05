const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
require("dotenv").config()

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(cors({
  allowedHeaders:["Content-Type","Authorization"],
  origin: ["http://localhost:5173","https://joineazy-frontend.vercel.app"]
}))

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
      res.json({ message: "User Registered.", user })
    }
  } catch (err) {
    console.log(err)
    res.json({ message: "Something went wrong" })
  }
})

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
      res.json({ message: "Login successful!", 
        role: user.role, userId: user.id, name: user.name, email: user.email } );

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
    res.json({ message: "Welcome Professor Dashboard" })
  } else {
    res.json({ message: "Not allowed" })
  }
})

app.get("/", (req, res) => {
  res.send("Server running fine!")
})

// creating assgn

app.post("/api/assignments", async (req, res) => {
   console.log("Incoming data:", req.body);
  let { title, description, deadline, driveLink, teacherId } = req.body;

  try {
    console.log(" Incoming data:", req.body);
    const parsedTeacherId = parseInt(teacherId);
    if (isNaN(parsedTeacherId)) {
      return res.status(400).json({ message: "teacherId must be a valid number" });
    }

    const teacher = await prisma.user.findUnique({
      where: { id: parsedTeacherId },
    });

    if (!teacher || teacher.role !== "admin") {
      return res.status(404).json({ message: "Invalid" });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description,
         deadline: new Date(deadline),
        createdBy: parsedTeacherId,
        driveLink,
        status: "Active",
      },
    });

    console.log("Assignment created:", newAssignment);
    res.json({ message: "Assignment created successfully!", assignment: newAssignment });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// getting all assigns 
  app.get("/api/assignments", async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching assignments" });
  }
 });

 // Submit assigns
app.post("/api/submissions", async (req, res) => {
  const { studentId, assignmentId, driveLink } = req.body;

  if (!studentId || !assignmentId || !driveLink) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const submission = await prisma.submission.create({
      data: {
        studentId: parseInt(studentId),
        assignmentId: parseInt(assignmentId),
        driveLink,
      },
      include: {
        student: { select: { name: true, email: true } },
        assignment: { select: { title: true } },
      },
    });

    res.status(201).json({
      message: "Assignment submitted successfully!",
      submission,
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ message: "Error submitting assignment" });
  }
});

// ~ GROUP ROUTES ~

// Create a new group
app.post("/api/groups", async (req, res) => {
  const { name, creatorId } = req.body;

  try {
    if (!name || !creatorId)
      return res.status(400).json({ message: "Name and creatorId required" });

    const groupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newGroup = await prisma.group.create({
      data: {
        name,
        creatorId: parseInt(creatorId),
        code: groupCode,
      },
      include: {
        members: true,
      },
    });

    await prisma.user.update({
      where: { id: parseInt(creatorId) },
      data: { groupId: newGroup.id },
    });

    const creator = await prisma.user.findUnique({
      where: { id: parseInt(creatorId) },
    });

    const groupData = {
      ...newGroup,
      creatorName: creator.name,
      creatorEmail: creator.email,
    };

    console.log("Group created:", groupData);
    res.json({ message: "Group created successfully.", group: groupData });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Error creating group" });
  }
});

// Join 
app.post("/api/groups/join", async (req, res) => {
  const { groupCode, studentId } = req.body;

  try {
    const group = await prisma.group.findUnique({
      where: { code: groupCode },
    });

    if (!group)
      return res.status(404).json({ message: "Invalid group code" });

    await prisma.user.update({
      where: { id: parseInt(studentId) },
      data: { groupId: group.id },
    });

    const updatedGroup = await prisma.group.findUnique({
      where: { id: group.id },
      include: { members: true },
    });

    const creator = await prisma.user.findUnique({
      where: { id: group.creatorId },
    });

    const groupData = {
      ...updatedGroup,
      creatorName: creator.name,
      creatorEmail: creator.email,
    };

    res.json({ message: "Joined group successfully.", group: groupData });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: "Error joining group" });
  }
});

// Fetch 
app.get("/api/groups/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        group: {
          include: { members: true },
        },
      },
    });

    if (!user || !user.group) {
      return res.json({ group: null });
    }

    const creator = await prisma.user.findUnique({
      where: { id: user.group.creatorId },
    });

    const groupData = {
      ...user.group,
      creatorName: creator.name,
      creatorEmail: creator.email,
    };

    res.json({ group: groupData });
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ message: "Error fetching group" });
  }
});

// add member (by only creator)
app.post("/api/groups/add-member", async (req, res) => {
  const { creatorId, groupId, memberEmail } = req.body;

  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
      include: { members: true },
    });

    if (!group)
      return res.status(404).json({ success: false, message: "Group not found" });

    if (group.creatorId !== parseInt(creatorId))
      return res.status(403).json({ success: false, message: "Only the creator can add members" });

    const member = await prisma.user.findUnique({
      where: { email: memberEmail },
    });

    if (!member)
      return res.status(404).json({ success: false, message: "No user found with that email" });

    if (member.role === "admin")
      return res.status(400).json({ success: false, message: "Admin users cannot be added to groups" });

    await prisma.user.update({
      where: { id: member.id },
      data: { groupId: group.id },
    });

    const updatedGroup = await prisma.group.findUnique({
      where: { id: group.id },
      include: { members: true },
    });

    const creator = await prisma.user.findUnique({
      where: { id: group.creatorId },
    });

    const groupData = {
      ...updatedGroup,
      creatorName: creator.name,
      creatorEmail: creator.email,
    };

    res.status(200).json({
      success: true,
      message: `${member.name} added successfully.`,
      group: groupData,
    });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ success: false, message: "User not Found or already Registered!" });
  }
});

// fetch (for admin)
app.get("/api/admin/groups", async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        members: {
          select: { id: true, name: true, email: true, role: true }
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!groups.length) {
      return res.status(404).json({ message: "No groups found" });
    }

    const formattedGroups = groups.map(group => ({
      id: group.id,
      name: group.name,
      code: group.code,
      createdAt: group.createdAt,
      creator: group.creator,
      members: group.members.filter(m => m.role !== "admin"),
    }));

    res.json({ groups: formattedGroups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Error fetching groups" });
  }
});

const PORT = 5000
app.listen(PORT, () => {
  console.log("Server started on port", PORT)
})
