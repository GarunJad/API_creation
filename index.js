const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 4000;

// MongoDB Connection
const url = 'mongodb://localhost:27017'; // Change this to your MongoDB connection string
const dbName = 'eventDB';
let db;

MongoClient.connect(url)
  .then(client => {
    console.log('Connected to Database');
    db = client.db(dbName);
  })
  .catch(error => console.error(error));
  //Middleware

  app.use(express.json());

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');  // Save to 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  // File naming convention
    }
  });
  
  // Initialize multer with the custom storage settings
  const upload = multer({ storage: storage });

//routes

// 1. GET /events?id=:event_id
app.get('/api/v3/app/events', async (req, res) => {
  const { id, type, limit, page } = req.query;

  try {
    if (id) {
      const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
      if (!event) return res.status(404).send({ message: 'Event not found' });
      return res.json(event);
    }

    if (type === 'latest') {
      const events = await db.collection('events')
        .find({})
        .sort({ schedule: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .toArray();
      return res.json(events);
    }

    res.status(400).send({ message: 'Invalid query parameters' });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred', details: error.message });
  }
});

// 2. POST /events
app.post('/api/v3/app/events', upload.single('files'), async (req, res) => {
  const { name, files, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
  const file = req.file; 
  try {
    const result = await db.collection('events').insertOne({
      name,
      files: file ? file.path : '',
      tagline,
      schedule: new Date(schedule),
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
      attendees,
    });

    res.status(201).send({ id: result.insertedId });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred', details: error.message });
  }
});

// 3. PUT /events/:id
app.put('/api/v3/app/events/:id', async (req, res) => {
  const { id } = req.params;
  const { name, files, tagline, schedule, description, moderator, category, sub_category, rigor_rank, attendees } = req.body;
  
  try {
    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          files,
          tagline,
          schedule: new Date(schedule),
          description,
          moderator,
          category,
          sub_category,
          rigor_rank,
          attendees,
        },
      }
    );

    if (result.matchedCount === 0) return res.status(404).send({ message: 'Event not found' });
    res.send({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred', details: error.message });
  }
});

// 4. DELETE /events/:id
app.delete('/api/v3/app/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).send({ message: 'Event not found' });
    res.send({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred', details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

