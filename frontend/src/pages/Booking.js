import { useEffect, useState } from "react";

export default function Booking() {
  const [seats, setSeats] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [username, setUsername] = useState("");
  const [justBooked, setJustBooked] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSeats();
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData?.username) {
        setUsername(userData.username);
      }
    }
  }, [token]);

  useEffect(() => {
    if (message) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchSeats = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/seats`);
      const data = await res.json();
      setSeats(data);
    } catch (err) {
      console.error("Error fetching seats", err);
    }
  };

  const bookSeats = async (e) => {
    e.preventDefault();
    if (numberOfSeats < 1 || numberOfSeats > 7) return;

    setLoading(true);
    setMessage("");
    setJustBooked([]);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ numberOfSeats }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      setMessage(data.message || "Booking successful");

      // Try to extract seat IDs from response
      const match = data.message?.match(/\[(.*?)\]/);
      if (match) {
        const ids = match[1].split(",").map((id) => parseInt(id.trim()));
        setJustBooked(ids);
      }

      await fetchSeats();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cancel failed");

      setMessage(data.message);
      fetchSeats();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const resetSeats = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/reset`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setMessage(data.message);
      fetchSeats();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const availableCount = seats.filter((s) => !s.is_reserved).length;
  const bookedCount = seats.filter((s) => s.is_reserved).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-hidden relative">
      {showToast && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50 transition-all duration-500">
          {message}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center">Train Seat Booking</h1>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Form Section */}
        <div className="bg-white border rounded shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {token ? (
              <>
                Welcome{" "}
                <span className="text-green-600 font-semibold text-2xl">
                  {username}
                </span>
                , book your seat
              </>
            ) : (
              "Login to book your seat"
            )}
          </h2>

          {/* Just Booked Seats */}
          {justBooked.length > 0 && (
            <div className="mt-4 text-sm mb-5">
              <p className="font-semibold mb-1">Just Booked Seats:</p>
              <div className="flex flex-wrap gap-1">
                {justBooked.map((seatId) => (
                  <span
                    key={seatId}
                    className="bg-yellow-400 text-black text-xs font-medium px-2 py-1 rounded"
                  >
                    {seatId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Booking Form - same row */}
          <form onSubmit={bookSeats} className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mb-4 w-full">
            <input
              type="number"
              min="1"
              max="7"
              value={numberOfSeats}
              onChange={(e) => setNumberOfSeats(Number(e.target.value))}
              className="border-2 border-emerald-950 rounded px-4 py-2 h-11 w-full sm:w-[75%] text-sm"
              placeholder="Seats"
              disabled={!token}
              required
            />
            <button
              type="submit"
              disabled={!token || loading}
              className={`h-11 w-full sm:w-[20%] rounded text-sm font-medium text-white transition border-2 border-emerald-950 ${
                token
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Booking..." : "Book Seats"}
            </button>
          </form>



          {/* Cancel and Reset Buttons */}
          <div className="mt-6 space-y-2">
            <button
              onClick={cancelBooking}
              disabled={!token}
              className={`w-full px-4 py-2 rounded text-sm text-white transition border-2 border-emerald-950 ${
                token
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Cancel Booking
            </button>
            <button
              onClick={resetSeats}
              disabled={!token}
              className={`w-full px-4 py-2 rounded text-sm text-white transition border-2 border-emerald-950 ${
                token
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Reset All Seats
            </button>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="bg-gray-50 border rounded shadow-md p-6 md:w-5/6">
          <h3 className="text-lg font-semibold text-center mb-4">Seat Layout</h3>
          <div className="grid grid-cols-7 gap-x-1 gap-y-3 justify-items-center mb-6 max-w-full">
            {seats
              .sort((a, b) => a.id - b.id)
              .map((seat) => (
                <div
                  key={seat.id}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded flex items-center justify-center text-xs md:text-sm font-semibold text-black border ${
                    seat.is_reserved ? "bg-yellow-400" : "bg-green-500"
                  }`}
                >
                  {seat.id}
                </div>
              ))}
          </div>

          {/* Seat Count Summary */}
          <div className="flex justify-center gap-4 text-sm font-medium flex-wrap">
            <div className="flex items-center gap-2 bg-green-500 text-black px-5 py-3 rounded-md">
              Available = {availableCount}
            </div>
            <div className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-md">
              Booked = {bookedCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
