import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

// Middleware to allow all origins
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Forward requests to OldService
app.use(express.json());

const oldServiceBaseUrl = "http://localhost:4008";
const ratingServiceBaseUrl = "http://localhost:4007";

// Get all users
app.get("/users", async (req, res) => {
  try {
    const response = await axios.get(`${oldServiceBaseUrl}/users`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new user
app.post("/users", async (req, res) => {
  try {
    const response = await axios.post(`${oldServiceBaseUrl}/users`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all ingredients
app.get("/ingredients", async (req, res) => {
  try {
    const response = await axios.get(`${oldServiceBaseUrl}/ingredients`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all steps
app.get("/steps", async (req, res) => {
  try {
    const response = await axios.get(`${oldServiceBaseUrl}/steps`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all recipes
app.get("/recipes", async (req, res) => {
  try {
    const response = await axios.get(`${oldServiceBaseUrl}/recipes`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new recipe
app.post("/recipes", async (req, res) => {
  try {
    const response = await axios.post(`${oldServiceBaseUrl}/recipes`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all ratings
app.get("/ratings", async (req, res) => {
  try {
    const response = await axios.get(`${ratingServiceBaseUrl}/ratings`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new rating
app.post("/ratings", async (req, res) => {
  try {
    const response = await axios.post(`${ratingServiceBaseUrl}/addrating`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  console.log(`API Gateway running on http://localhost:${port}`);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('API Gateway server shutting down');
  // Close the server and exit
  server.close(() => {
    process.exit(0);
  });
});
