const express = require("express");
const router = express.Router();
const Event = require("../models/events"); // Ensure correct import
const Confirmation = require("../models/confirm"); // Ensure correct import
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Correct the path and use the absolute path
        const dir = path.join(__dirname, '/Users/nranhara/Desktop/MP/server/client/public/assests/event');
        
        // Check if the directory exists, create it if it does not
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route to get all events


// Route to add an event
router.post("/add",upload.single("image"), (req, res) => {
    const { headline,image, date, time, venue, description } = req.body; // Use destructuring

    const newEvent = new Event({
        headline,
        image,
        date,
        time,
        venue,
        description,
    });

    newEvent.image = "/Users/nranhara/Desktop/MP/server/client/public/assests/event" + req.file.filename;
    console.log(newEvent.headline);

    newEvent
        .save()
        .then(() => {
            res.json("Event Added");
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to add event" });
        });
});
// router.post("/add", (req, res) => {
//     const { headline, date, time, venue, description } = req.body; // Use destructuring

//     const newEvent = new Event({
//         headline,
//         date,
//         time,
//         venue,
//         description,
//     });

//     newEvent
//         .save()
//         .then(() => {
//             res.json("Event Added");
//         })
//         .catch((err) => {
//             console.error(err);
//             res.status(500).json({ error: "Failed to add event" });
//         });
// });

// Route to get all events
router.get("/", (req, res) => {
    Event.find()
        .then((events) => {
            res.json(events);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Failed to fetch events" });
        });
});

// Route to update an event by ID
router.put("/update/:id", async (req, res) => {
    const eventId = req.params.id;
    const { headline, date, time, venue, description } = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { headline, date, time, venue, description },
            { new: true } // Return the updated document
        );

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ status: "Event updated", event: updatedEvent });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update event" });
    }
});

// Route to delete an event by ID
router.delete("/delete/:id", async (req, res) => {
    const eventId = req.params.id;

    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId);

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ status: "Event deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete event" });
    }
});

// Route to get a specific event by ID
router.get("/get/:id", async (req, res) => {
    const eventId = req.params.id;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ status: "Event fetched", event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch event" });
    }
});

module.exports = router;