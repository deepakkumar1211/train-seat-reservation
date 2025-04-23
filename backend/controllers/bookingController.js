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


// Book seats intelligently (1 to 7 seats in same row if possible, else from nearby rows)
const bookSeats = async (req, res) => {
  const { numberOfSeats } = req.body;
  const userId = req.user.id;

  if (!numberOfSeats || numberOfSeats < 1 || numberOfSeats > 7) {
    return res.status(400).json({ message: "⚠️ You must select 1 to 7 seats" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM seats WHERE is_reserved = false ORDER BY row_number, seat_number"
    );
    const availableSeats = result.rows;

    if (availableSeats.length < numberOfSeats) {
      return res.status(400).json({ message: `⚠️ Booking Failed. Only ${availableSeats.length} available to book ` });
    }

    const groupedByRow = {};
    for (const seat of availableSeats) {
      if (!groupedByRow[seat.row_number]) groupedByRow[seat.row_number] = [];
      groupedByRow[seat.row_number].push(seat);
    }

    let seatsToBook = [];

    // Try to find all seats in the same row
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

    // If not found in a single row, pick nearby rows with lowest row gap
    if (seatsToBook.length === 0) {
      const rows = Object.keys(groupedByRow).map(Number).sort((a, b) => a - b);

      let minGapCombo = null;
      let minGap = Infinity;

      const generateCombinations = (rows, k, start = 0, combo = []) => {
        if (combo.length >= 1 && combo.reduce((sum, r) => sum + groupedByRow[r].length, 0) >= numberOfSeats) {
          const sortedCombo = [...combo].sort((a, b) => a - b);
          const gap = sortedCombo[sortedCombo.length - 1] - sortedCombo[0];
          if (gap < minGap) {
            minGap = gap;
            minGapCombo = [...combo];
          }
        }

        for (let i = start; i < rows.length; i++) {
          combo.push(rows[i]);
          generateCombinations(rows, k, i + 1, combo);
          combo.pop();
        }
      };

      generateCombinations(rows, numberOfSeats);

      if (minGapCombo) {
        let count = 0;
        for (const row of minGapCombo.sort((a, b) => a - b)) {
          const seats = groupedByRow[row];
          for (const seat of seats) {
            if (count >= numberOfSeats) break;
            seatsToBook.push(seat);
            count++;
          }
          if (count >= numberOfSeats) break;
        }
      }
    }

    if (seatsToBook.length === 0) {
      return res.status(400).json({ message: "No suitable seats found" });
    }

    // Book the seats
    await Promise.all(
      seatsToBook.map(seat =>
        pool.query(
          "UPDATE seats SET is_reserved = true, user_id = $1 WHERE id = $2",
          [userId, seat.id]
        )
      )
    );

    const bookedIds = seatsToBook.map(seat => seat.id);
    const updatedSeats = await pool.query(
      "SELECT * FROM seats WHERE id = ANY($1)",
      [bookedIds]
    );

    res.json({ message: "✅ Seats Booked Successfully", seats: updatedSeats.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};



const resetSeats = async (req, res) => {
  try {
    await pool.query("UPDATE seats SET is_reserved = false, user_id = NULL");
    res.json({ message: "Booking Successfully Reset" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset seats" });
  }
};

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

module.exports = {
  getSeats,
  bookSeats,
  resetSeats,
  cancelBooking
};

