const { pool } = require("../db/db");

// Get all seats
const getSeats = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seats ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to get seats" });
  }
};

// Book seats
// Book seats intelligently (1 to 7 seats in same row if possible, else nearby)
const bookSeats = async (req, res) => {
  const { numberOfSeats } = req.body;
  const userId = req.user.id;

  if (!numberOfSeats || numberOfSeats < 1 || numberOfSeats > 7) {
    return res.status(400).json({ message: "You must select 1 to 7 seats" });
  }

  try {
    // Get all unreserved seats ordered by row_number and seat_number
    const result = await pool.query(
      "SELECT * FROM seats WHERE is_reserved = false ORDER BY row_number, seat_number"
    );
    const availableSeats = result.rows;

    if (availableSeats.length < numberOfSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Try to find numberOfSeats in the same row
    let seatsToBook = [];
    const groupedByRow = {};

    // Group seats by row_number
    for (const seat of availableSeats) {
      if (!groupedByRow[seat.row_number]) groupedByRow[seat.row_number] = [];
      groupedByRow[seat.row_number].push(seat);
    }

    // Check for consecutive seats in a row
    outer: for (const row in groupedByRow) {
      const seats = groupedByRow[row];

      for (let i = 0; i <= seats.length - numberOfSeats; i++) {
        const slice = seats.slice(i, i + numberOfSeats);
        const isConsecutive = slice.every((seat, idx) =>
          idx === 0 || seat.seat_number === slice[idx - 1].seat_number + 1
        );

        if (isConsecutive) {
          seatsToBook = slice;
          break outer;
        }
      }
    }

    // If not found in the same row, pick first N available seats
    if (seatsToBook.length === 0) {
      seatsToBook = availableSeats.slice(0, numberOfSeats);
    }

    // Book the selected seats
    await Promise.all(
      seatsToBook.map(seat =>
        pool.query(
          "UPDATE seats SET is_reserved = true, user_id = $1 WHERE id = $2",
          [userId, seat.id]
        )
      )
    );

    // Fetch the updated seats
    const bookedIds = seatsToBook.map(seat => seat.id);
    const updatedSeats = await pool.query(
      "SELECT * FROM seats WHERE id = ANY($1)",
      [bookedIds]
    );

    res.json({ message: "Seats booked successfully", seats: updatedSeats.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};

module.exports = { bookSeats };


const resetSeats = async (req, res) => {
  try {
    await pool.query("UPDATE seats SET is_reserved = false, user_id = NULL");
    res.json({ message: "Seats reset" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset seats" });
  }
};



// Cancel all bookings for current user
const cancelBooking = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "UPDATE seats SET is_reserved = false, user_id = NULL WHERE user_id = $1 RETURNING *",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "No bookings to cancel for this user" });
    }

    res.json({
      message: "Booking cancelled successfully",
      cancelledSeats: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};


module.exports = { getSeats, bookSeats, resetSeats,cancelBooking };
