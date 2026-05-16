
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
const PORT =
  process.env.PORT || 5000;

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// MONGODB URI
// ==========================================
const uri =
  process.env.MONGODB_URI;

// ==========================================
// CREATE MONGODB CLIENT
// ==========================================
const client = new MongoClient(
  uri,
  {
    serverApi: {
      version:
        ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);

// ==========================================
// MAIN FUNCTION
// ==========================================
async function run() {

  try {

    // ==========================================
    // CONNECT TO MONGODB
    // ==========================================
    await client.connect();

    console.log(
      "✅ MongoDB Connected Successfully"
    );

    // ==========================================
    // DATABASE
    // ==========================================
    const db =
      client.db("wanderlust");

    // ==========================================
    // COLLECTIONS
    // ==========================================
    const destinationCollection =
      db.collection(
        "destinations"
      );

    const bookingsCollection =
      db.collection(
        "bookings"
      );

    // =====================================================
    // GET ALL DESTINATIONS
    // =====================================================
    app.get(
      "/destination",
      async (req, res) => {

        try {

          const result =
            await destinationCollection
              .find()
              .toArray();

          res.json(result);

        } catch (error) {

          console.log(error);

          res.status(500).send({
            success: false,
            message:
              "Failed to fetch destinations",
          });
        }
      }
    );

    // =====================================================
    // GET SINGLE DESTINATION
    // =====================================================
    app.get(
      "/destination/:id",
      async (req, res) => {

        try {

          const { id } =
            req.params;

          if (
            !ObjectId.isValid(id)
          ) {

            return res.status(400).send({
              success: false,
              message:
                "Invalid destination ID",
            });
          }

          const result =
            await destinationCollection.findOne(
              {
                _id:
                  new ObjectId(
                    id
                  ),
              }
            );

          if (!result) {

            return res.status(404).send({
              success: false,
              message:
                "Destination not found",
            });
          }

          res.json(result);

        } catch (error) {

          console.log(error);

          res.status(500).send({
            success: false,
            message:
              "Failed to fetch destination",
          });
        }
      }
    );

    // =====================================================
    // CREATE BOOKING
    // =====================================================
    app.post(
      "/bookings",
      async (req, res) => {

        try {

          const bookingData =
            req.body;

          const result =
            await bookingsCollection.insertOne(
              bookingData
            );

          res.json(result);

        } catch (error) {

          console.log(error);

          res.status(500).send({
            success: false,
            message:
              "Failed to create booking",
          });
        }
      }
    );

    // =====================================================
    // GET ALL BOOKINGS
    // =====================================================
    app.get(
      "/bookings",
      async (req, res) => {

        try {

          const result =
            await bookingsCollection
              .find()
              .toArray();

          res.json(result);

        } catch (error) {

          console.log(error);

          res.status(500).send({
            success: false,
            message:
              "Failed to fetch bookings",
          });
        }
      }
    );

    // =====================================================
    // DELETE BOOKING
    // =====================================================
    app.delete(
      "/bookings/:id",
      async (req, res) => {

        try {

          const { id } =
            req.params;

          if (
            !ObjectId.isValid(id)
          ) {

            return res.status(400).send({
              success: false,
              message:
                "Invalid booking ID",
            });
          }

          const result =
            await bookingsCollection.deleteOne(
              {
                _id:
                  new ObjectId(
                    id
                  ),
              }
            );

          res.send(result);

        } catch (error) {

          console.log(error);

          res.status(500).send({
            success: false,
            message:
              "Failed to delete booking",
          });
        }
      }
    );

    // ==========================================
    // MONGODB PING TEST
    // ==========================================
    await client
      .db("admin")
      .command({
        ping: 1,
      });

    console.log(
      "✅ Pinged your deployment successfully"
    );

  } catch (error) {

    console.log(error);

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

  res.send(
    "🚀 Wanderlust Server Running Successfully"
  );
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {

  console.log(
    `🚀 Server Running On Port ${PORT}`
  );
});