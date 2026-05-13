const dns = require("node:dns");

// ==========================================
// FIX MONGODB DNS ISSUE
// ==========================================
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ==========================================
// IMPORT PACKAGES
// ==========================================
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// MongoDB Imports
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

// ==========================================
// LOAD ENV VARIABLES
// ==========================================
dotenv.config();

// ==========================================
// EXPRESS APP
// ==========================================
const app = express();

// ==========================================
// PORT
// ==========================================
const PORT = process.env.PORT || 5000;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// MONGODB URI
// ==========================================
const uri = process.env.MONGODB_URI;

// ==========================================
// CREATE MONGODB CLIENT
// ==========================================
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ==========================================
// MAIN FUNCTION
// ==========================================
async function run() {

  try {

    // ==========================================
    // CONNECT TO MONGODB
    // ==========================================
    await client.connect();

    console.log("✅ MongoDB Connected Successfully");

    // ==========================================
    // DATABASE
    // ==========================================
    const db = client.db("wanderlust");

    // ==========================================
    // COLLECTIONS
    // ==========================================
    const destinationCollection =
      db.collection("destinations");

    const bookingsCollection =
      db.collection("bookings");

    // =====================================================
    // GET ALL DESTINATIONS
    // =====================================================
    app.get("/destination", async (req, res) => {

      try {

        const result =
          await destinationCollection.find().toArray();

        res.json(result);

      } catch (error) {

        console.log(error);

        res.status(500).send({
          success: false,
          message: "Failed to fetch destinations",
        });
      }
    });

    // =====================================================
    // ADD NEW DESTINATION
    // =====================================================
    app.post("/destination", async (req, res) => {

      try {

        // Request Body Data
        const destinationData = req.body;

        console.log(destinationData);

        // Insert Data
        const result =
          await destinationCollection.insertOne(
            destinationData
          );

        res.json(result);

      } catch (error) {

        console.log(error);

        res.status(500).send({
          success: false,
          message: "Failed to add destination",
        });
      }
    });

    // =====================================================
    // GET SINGLE DESTINATION
    // =====================================================
    app.get("/destination/:id", async (req, res) => {

      try {

        // Get ID
        const { id } = req.params;

        // Find Destination
        const result =
          await destinationCollection.findOne({
            _id: new ObjectId(id),
          });

        res.json(result);

      } catch (error) {

        console.log(error);

        res.status(500).send({
          success: false,
          message: "Failed to fetch destination",
        });
      }
    });

    // =====================================================
    // UPDATE DESTINATION
    // =====================================================
    app.patch("/destination/:id", async (req, res) => {

      try {

        // Get ID
        const { id } = req.params;

        // Updated Data
        const updatedData = req.body;

        console.log(updatedData);

        // Update Query
        const result =
          await destinationCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: updatedData,
            }
          );

        res.json(result);

      } catch (error) {

        console.log(error);

        res.status(500).send({
          success: false,
          message: "Failed to update destination",
        });
      }
    });

    // =====================================================
    // DELETE DESTINATION
    // =====================================================
    app.delete("/destination/:id", async (req, res) => {

      try {

        // Get ID
        const { id } = req.params;

        // Delete Destination
        const result =
          await destinationCollection.deleteOne({
            _id: new ObjectId(id),
          });

        res.json(result);

      } catch (error) {

        console.log(error);

        res.status(500).send({
          success: false,
          message: "Failed to delete destination",
        });
      }
    });

    // =====================================================
    // CREATE BOOKING
    // =====================================================
    app.post("/bookings", async (req, res) => {

      try {

        // Booking Data
        const bookingData = req.body;

        console.log(bookingData);

        // Insert Booking
        const result =
          await bookingsCollection.insertOne(
            bookingData
          );

        res.json(result);

      } catch (error) {

        console.log(error);

        res.status(500).send({
          success: false,
          message: "Failed to create booking",
        });
      }
    });

    // =====================================================
    // GET ALL BOOKINGS
    // =====================================================
    app.get("/bookings", async (req, res) => {

      try {

        // Find All Bookings
        const result =
          await bookingsCollection.find().toArray();

        res.json(result);

      } catch (error) {

        console.log(error);

        res.status(500).send({
          success: false,
          message: "Failed to fetch bookings",
        });
      }
    });

    app.delete("/bookings/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const result =
      await bookingsCollection.deleteOne({
        _id: new ObjectId(id),
      });

    res.send(result);

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Failed to delete booking",
    });
  }
});

    // ==========================================
    // MONGODB PING TEST
    // ==========================================
    await client.db("admin").command({
      ping: 1,
    });

    console.log(
      "✅ Pinged your deployment successfully"
    );

  } catch (error) {

    console.log(error);

  } finally {

    // Keep MongoDB Connection Alive
    // await client.close();
  }
}

// ==========================================
// RUN SERVER
// ==========================================
run().catch(console.dir);

// ==========================================
// DEFAULT ROUTE
// ==========================================
app.get("/", (req, res) => {

  res.send("🚀 Wanderlust Server Running Successfully");
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {

  console.log(`🚀 Server Running On Port ${PORT}`);
});