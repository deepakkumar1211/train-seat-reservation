const express = require("express");
const router = express.Router();

const { bookSeats, getSeats, resetSeats, cancelBooking } = require("../controllers/bookingController");
const auth = require("../middleware/authMiddleware");

router.get("/seats", getSeats); // public
router.post("/book", auth, bookSeats); // protected
router.post("/reset", auth, resetSeats); // protected 

router.post("/cancel", auth, cancelBooking); // protected

module.exports = router;
