const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // For file uploads

const app = express();
app.use(bodyParser.json());

// MongoDB configuration
const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const dbName = "eventDB"; // Database name
let db;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected to database");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// API Endpoints

// 1. GET /events with optional query parameters
app.get("/api/v3/app/events", async (req, res) => {
  const { id, type, limit = 5, page = 1 } = req.query;

  if (id) {
    // If 'id' query parameter is provided, fetch a specific event by ID
    try {
      const event = await db.collection("events").findOne({ _id: new ObjectId(id) });
      if (event) res.status(200).json(event);
      else res.status(404).send("Event not found");
    } catch (err) {
      res.status(500).send("Error fetching event");
    }
  } else if (type === "latest") {
    // If 'type=latest' query parameter is provided, fetch the latest events
    try {
      const events = await db
        .collection("events")
        .find({})
        .sort({ schedule: -1 }) // Sort by schedule (latest first)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .toArray();
      res.status(200).json(events);
    } catch (err) {
      res.status(500).send("Error fetching events");
    }
  } else {
    res.status(400).send("Invalid query parameters");
  }
});

// 2. POST /events
app.post("/api/v3/app/events", upload.single("image"), async (req, res) => {
  const {
 name,
 tagline,
 schedule,
 description,
 moderator,
 category,
 sub_category,
 rigor_rank,
 attendees,
  } = req.body;

  const file = req.file; // Uploaded file

  const newEvent = {
 type: "event",
 name,
 tagline,
 schedule: new Date(schedule),
 description,
 files: { image: file ? file.path : null },
 moderator,
 category,
 sub_category,
 rigor_rank: parseInt(rigor_rank),
 attendees: attendees ? JSON.parse(attendees) : [],
  };

  try {
    const result = await db.collection("events").insertOne(newEvent);
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).send("Error creating event");
  }
});

// 3. PUT /events/:id
app.put("/api/v3/app/events/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (updateData.schedule) {
    updateData.schedule = new Date(updateData.schedule);
  }

  try {
    const result = await db
      .collection("events")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    if (result.matchedCount === 0) {
      res.status(404).send("Event not found");
    } else {
      res.status(200).send("Event updated successfully");
    }
  } catch (err) {
    res.status(500).send("Error updating event");
  }
});

// 4. DELETE /events/:id
app.delete("/api/v3/app/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.collection("events").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).send("Event not found");
    } else {
      res.status(200).send("Event deleted successfully");
    }
  } catch (err) {
    res.status(500).send("Error deleting event");
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
