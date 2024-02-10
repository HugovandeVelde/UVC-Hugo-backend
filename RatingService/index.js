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
        { recipeId: 1, rating: 8, message: "Heerlijk! Ik vond het geweldig." },
        { recipeId: 1, rating: 7, message: "Goed, maar kan meer kruiden gebruiken." },
        { recipeId: 1, rating: 9, message: "Fantastisch gerecht!" },
        { recipeId: 1, rating: 6, message: "Niet slecht, maar kan worden verbeterd." },
        { recipeId: 1, rating: 8, message: "Geweldig recept, zal het opnieuw maken!" },
        { recipeId: 2, rating: 9, message: "Geweldige smaak!" },
        { recipeId: 2, rating: 10, message: "Beste recept ooit!" },
        { recipeId: 2, rating: 8, message: "Echt van genoten." },
        { recipeId: 2, rating: 7, message: "Best goed, maar een beetje te pittig." },
        { recipeId: 3, rating: 6, message: "Degelijk, maar niets bijzonders." },
        { recipeId: 3, rating: 5, message: "Niet mijn favoriet." },
        { recipeId: 3, rating: 7, message: "Het was oké, niets te spannends." },
        { recipeId: 4, rating: 7, message: "Best goed." },
        { recipeId: 4, rating: 8, message: "Heb ervan genoten." },
        { recipeId: 4, rating: 6, message: "Kon beter zijn." },
        { recipeId: 5, rating: 9, message: "Absoluut heerlijk recept!" },
        { recipeId: 5, rating: 8, message: "Heerlijke smaak!" },
        { recipeId: 5, rating: 10, message: "Ongelooflijk, overtrof mijn verwachtingen!" },
        { recipeId: 5, rating: 9, message: "Fantastisch, zal het zeker nog eens maken!" },
        { recipeId: 6, rating: 7, message: "Smakelijke taco's." },
        { recipeId: 6, rating: 6, message: "Niet slecht, maar kan beter." },
        { recipeId: 6, rating: 8, message: "Echt van genoten, geweldige smaak!" },
        { recipeId: 6, rating: 7, message: "Goed recept, maar een beetje rommelig om te eten." }
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
