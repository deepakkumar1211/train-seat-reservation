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


// Book seats intelligently (1 to 7 seats in same row if possible, else nearby)
const bookSeats = async (req, res) => {
  const { numberOfSeats } = req.body;
  const userId = req.user.id;

  if (!numberOfSeats || numberOfSeats < 1 || numberOfSeats > 7) {
    return res.status(400).json({ message: "You must select 1 to 7 seats" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM seats WHERE is_reserved = false ORDER BY row_number, seat_number"
    );
    const availableSeats = result.rows;

    if (availableSeats.length < numberOfSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Group seats by row
    const groupedByRow = {};
    for (const seat of availableSeats) {
      if (!groupedByRow[seat.row_number]) groupedByRow[seat.row_number] = [];
      groupedByRow[seat.row_number].push(seat);
    }

    let seatsToBook = [];

    // Try to find N consecutive seats in the same row
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

    // If not found in same row, try to get best nearby seats
    if (seatsToBook.length === 0) {
      const seatClusters = [];

      for (const row in groupedByRow) {
        const rowSeats = groupedByRow[row];
        for (let i = 0; i < rowSeats.length; i++) {
          let cluster = [rowSeats[i]];

          for (let j = i + 1; j < rowSeats.length && cluster.length < numberOfSeats; j++) {
            if (rowSeats[j].seat_number === cluster[cluster.length - 1].seat_number + 1) {
              cluster.push(rowSeats[j]);
            }
          }

          if (cluster.length === numberOfSeats) {
            seatsToBook = cluster;
            break;
          } else if (cluster.length > 1) {
            seatClusters.push(cluster);
          }
        }

        if (seatsToBook.length) break;
      }

      // Pick best partial cluster and fill rest
      if (!seatsToBook.length && seatClusters.length) {
        const bestCluster = seatClusters.reduce((a, b) => (a.length > b.length ? a : b));
        const remaining = numberOfSeats - bestCluster.length;

        const remainingSeats = availableSeats.filter(
          s => !bestCluster.some(b => b.id === s.id)
        ).slice(0, remaining);

        seatsToBook = [...bestCluster, ...remainingSeats];
      }

      // Final fallback
      if (!seatsToBook.length) {
        seatsToBook = availableSeats.slice(0, numberOfSeats);
      }
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

const resetSeats = async (req, res) => {
  try {
    await pool.query("UPDATE seats SET is_reserved = false, user_id = NULL");
    res.json({ message: "Seats reset" });
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

