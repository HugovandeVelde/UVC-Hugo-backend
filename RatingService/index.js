const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();
const port = 4007; // Choose a port for your Ratings microservice

const db = new sqlite3.Database("ratings.db");

// Middleware to allow all origins
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Clear existing data from the ratings table
db.serialize(() => {
    db.run("DROP TABLE IF EXISTS ratings");

    // Define schema for ratings table
    db.run(
        "CREATE TABLE IF NOT EXISTS ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, recipeId INTEGER, rating INTEGER, message TEXT)"
    );

    // Pre-fill database with sample ratings data
    const sampleRatingsData = [
        { recipeId: 1, rating: 8, message: "Delicious! Loved it." },
        { recipeId: 1, rating: 7, message: "Good, but could use more seasoning." },
        { recipeId: 1, rating: 9, message: "Fantastic dish!" },
        { recipeId: 1, rating: 6, message: "Not bad, but could be improved." },
        { recipeId: 1, rating: 8, message: "Great recipe, will make again!" },
        { recipeId: 2, rating: 9, message: "Amazing flavor!" },
        { recipeId: 2, rating: 10, message: "Best recipe ever!" },
        { recipeId: 2, rating: 8, message: "Really enjoyed it." },
        { recipeId: 2, rating: 7, message: "Pretty good, but a bit too spicy." },
        { recipeId: 3, rating: 6, message: "Decent, but nothing special." },
        { recipeId: 3, rating: 5, message: "Not my favorite." },
        { recipeId: 3, rating: 7, message: "It was okay, nothing too exciting." },
        { recipeId: 4, rating: 7, message: "Pretty good." },
        { recipeId: 4, rating: 8, message: "Enjoyed it." },
        { recipeId: 4, rating: 6, message: "Could be better." },
        { recipeId: 5, rating: 9, message: "Absolutely delicious recipe!" },
        { recipeId: 5, rating: 8, message: "Great taste!" },
        { recipeId: 5, rating: 10, message: "Incredible, exceeded my expectations!" },
        { recipeId: 5, rating: 9, message: "Fantastic, will definitely make again!" },
        { recipeId: 6, rating: 7, message: "Tasty tacos." },
        { recipeId: 6, rating: 6, message: "Not bad, but could be better." },
        { recipeId: 6, rating: 8, message: "Really enjoyed it, great flavor!" },
        { recipeId: 6, rating: 7, message: "Good recipe, but a bit messy to eat." }
    ];

    const insertRatingStatement = db.prepare(
        "INSERT INTO ratings (recipeId, rating, message) VALUES (?, ?, ?)"
    );

    for (const data of sampleRatingsData) {
        insertRatingStatement.run(data.recipeId, data.rating, data.message);
    }

    insertRatingStatement.finalize();
});

// Define GET ratings by recipeId route
app.get("/recipe/:recipeId/ratings", (req, res) => {
    const { recipeId } = req.params;

    db.all("SELECT * FROM ratings WHERE recipeId = ?", [recipeId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Define POST add rating for recipeId route
app.post("/recipe/:recipeId/addrating", (req, res) => {
    const { recipeId } = req.params;
    const { rating, message } = req.body;

    // Ensure required fields are provided
    if (!rating) {
        return res.status(400).json({ error: "Rating is required" });
    }

    // Insert the new rating into the database
    db.run(
        "INSERT INTO ratings (recipeId, rating, message) VALUES (?, ?, ?)",
        [recipeId, rating, message],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Rating added", ratingId: this.lastID });
        }
    );
});


// Start the Ratings microservice
app.listen(port, () => {
    console.log(`Ratings microservice running on http://localhost:${port}`);
});
