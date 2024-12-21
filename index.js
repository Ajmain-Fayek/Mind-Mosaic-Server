require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8800;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const favicon = require("serve-favicon");
const jwt = require("jsonwebtoken");
const app = express();

// ---------------------------------------------
// Middlewares
// ---------------------------------------------
app.use(favicon(path.join(__dirname, "public", "favicon.png")));
app.use(
    cors({
        // origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

// ---------------------------------------------
// JWT Middleware
// ---------------------------------------------
const verifyJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

// ---------------------------------------------
// MongoDB Connection
// ---------------------------------------------
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// ---------------------------------------------
// Routes
// ---------------------------------------------
async function run() {
    try {
        // await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("MindMosaic");

        const usersCollection = db.collection("users");
        const commentsCollection = db.collection("comments");
        const blogsCollection = db.collection("blogs");

        // ---------------------------------------------
        // JWT Related APIs
        // ---------------------------------------------
        app.post("/api/login", async (req, res) => {
            const { username, email } = req.body;

            // Replace this with your actual user authentication logic
            const user = await usersCollection.findOne({ username, email });

            if (!user) {
                return res.status(401).send("Invalid username or email");
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );

            res.cookie("token", token, { httpOnly: true });
            res.status(200).json({ message: "Login successful", token });
        });

        app.post("/api/logout", (req, res) => {
            res.clearCookie("token");
            res.status(200).json({ message: "Logout successful" });
        });

        // ---------------------------------------------
        // Blogs Related APIs
        // ---------------------------------------------
        // Get all blogs (unsorted)
        app.get("/api/blogs", async (req, res) => {
            const blogs = await blogsCollection.find({}).toArray();
            res.status(200).json(blogs);
        });

        // Get blogs by category and query sorted by recent published date
        app.get("/api/blogs/search", async (req, res) => {
            const { category, query } = req.query;
            let filter = {};

            if (category) {
                filter.category = category;
            }

            if (query) {
                filter.title = { $regex: query, $options: "i" };
            }

            const blogs = await blogsCollection
                .find(filter)
                .sort({ publishedDate: -1 })
                .toArray();

            res.status(200).json(blogs);
        });

        // Get all blogs, sorted by recent published date
        app.get("/api/blogs/recent", async (req, res) => {
            const blogs = await blogsCollection
                .find({})
                .sort({ publishedDate: -1 })
                .toArray();
            res.status(200).json(blogs);
        });

        // Get a single blog by id
        app.get("/api/blogs/:id", async (req, res) => {
            // console.log("client request for blog id: ", req.params.id);
            const id = new ObjectId(req.params.id);
            const blog = await blogsCollection.findOne({ _id: id });
            res.status(200).json(blog);
        });

        // Add a blog to the database
        app.post("/api/blogs", async (req, res) => {
            const newBlog = req.body;
            const result = await blogsCollection.insertOne(newBlog);
            res.status(201).json(result);
        });

        // Update a single blog a blog by id
        app.put("/api/blogs/:id", async (req, res) => {
            const id = new ObjectId(req.params.id);
            const updatedBlog = req.body;
            const result = await blogsCollection.updateOne(
                { _id: id },
                { $set: updatedBlog }
            );
            res.status(200).json(result);
        });

        // Delete a single blog by id
        app.delete("/api/blogs/:id", async (req, res) => {
            const id = new ObjectId(req.params.id);
            const result = await blogsCollection.deleteOne({ _id: id });
            res.status(200).json(result);
        });

        // ---------------------------------------------
        // Comments Related APIs
        // ---------------------------------------------
        // Get all comments of a specific blog by blogId
        app.get("/api/comments/:blogId", async (req, res) => {
            const blogId = req.params.blogId;
            const comments = await commentsCollection
                .find({ blogId: blogId })
                .toArray();
            res.status(200).json(comments);
        });

        // Add a comment to the database
        app.post("/api/comments", async (req, res) => {
            const newComment = req.body;
            const result = await commentsCollection.insertOne(newComment);
            res.status(201).json(result);
        });

        // Update a single comment by id
        app.put("/api/comments/:id", async (req, res) => {
            const id = new ObjectId(req.params.id);
            const updatedComment = req.body;
            const result = await commentsCollection.updateOne(
                { _id: id },
                { $set: updatedComment }
            );
            res.status(200).json(result);
        });

        // Delete a single comment by id
        app.delete("/api/comments/:id", async (req, res) => {
            const id = new ObjectId(req.params.id);
            const result = await commentsCollection.deleteOne({ _id: id });
            res.status(200).json(result);
        });

        console.log("Collections created: users, comments, blogs");
        // Your database operations go here
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

// ---------------------------------------------
// Default Route
// ---------------------------------------------
app.get("/", (req, res) => {
    res.status(200).send("Welcome to MindMosaic API");
});

app.listen(port, () => {
    console.log(`Server is running on port:`, port);
});
