const dns = require("node:dns");

// Set custom DNS servers to avoid MongoDB DNS issues
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// MongoDB imports
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Load environment variables
dotenv.config();

// MongoDB connection URI from .env
const uri = process.env.MONGODB_URI;

// Create Express app
const app = express();

// Server port
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Create MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Main async function
async function run() {
  try {

    // Connect MongoDB
    await client.connect();

    // Database & Collection
    const db = client.db("wanderlust");
    const destinationCollection = db.collection("destinations");

    // ==========================================
    // GET ALL DESTINATIONS
    // ==========================================
    app.get("/destination", async (req, res) => {

      // Find all destinations
      const result = await destinationCollection.find().toArray();

      // Send response
      res.json(result);
    });

    // ==========================================
    // ADD NEW DESTINATION
    // ==========================================
    app.post("/destination", async (req, res) => {

      // Get request body data
      const destinationData = req.body;

      console.log(destinationData);

      // Insert into database
      const result = await destinationCollection.insertOne(destinationData);

      // Send response
      res.json(result);
    });

    // ==========================================
    // GET SINGLE DESTINATION BY ID
    // ==========================================
    app.get("/destination/:id", async (req, res) => {

      // Get ID from params
      const { id } = req.params;

      // Find single document
      const result = await destinationCollection.findOne({
        _id: new ObjectId(id),
      });

      // Send response
      res.json(result);
    });

    // ==========================================
    // UPDATE DESTINATION
    // ==========================================
    app.patch("/destination/:id", async (req, res) => {

      // Get ID from params
      const { id } = req.params;

      // Updated data from body
      const updatedData = req.body;

      console.log(updatedData);

      // Update document
      const result = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      // Send response
      res.json(result);
    });

    // ==========================================
    // DELETE DESTINATION
    // ==========================================
    app.delete("/destination/:id", async (req, res) => {

      // Get ID from params
      const { id } = req.params;

      // Delete document
      const result = await destinationCollection.deleteOne({
        _id: new ObjectId(id),
      });

      // Send response
      res.json(result);
    });

    // MongoDB Ping Test
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

  } finally {

    // Keep connection alive
    // await client.close();
  }
}

// Run server
run().catch(console.dir);

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});