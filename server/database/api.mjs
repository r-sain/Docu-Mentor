import express from 'express';
import Connection from './db.mjs';
import cors from 'cors'; // Import the cors middleware


const app = express();
app.use(cors());

app.get('/', async (req, res) => {
  try {
    // Ensure the MongoDB connection is established and get the database instance
    const db = await Connection();

    if (!db) {
      throw new Error("MongoDB connection not established");
    }

    // Assuming you have a collection named "documents"
    const collection = db.collection('documents');

    // Fetch data from the collection
    const data = await collection.find({}).toArray();
    console.log(data);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete a document by ID
app.delete('/documents/:id', async (req, res) => {
  try {
    const db = await Connection();
    if (!db) {
      throw new Error("MongoDB connection not established");
    }

    const collection = db.collection('documents');
    const result = await collection.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      res.status(204).end(); // Return a success response
    } else {
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the origin of your React app
};

app.use(cors(corsOptions));