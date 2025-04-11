// import { useEffect, useState } from "react";

// export default function Booking() {
//   const [seats, setSeats] = useState([]);
//   const [numberOfSeats, setNumberOfSeats] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);
//   const [username, setUsername] = useState("");
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchSeats();
//     if (token) {
//       const userData = JSON.parse(localStorage.getItem("user"));
//       if (userData?.username) {
//         setUsername(userData.username);
//       }
//     }
//   }, [token]);

//   useEffect(() => {
//     if (message) {
//       setShowToast(true);
//       const timer = setTimeout(() => {
//         setShowToast(false);
//         setMessage("");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const fetchSeats = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/v1/seats/seats");
//       const data = await res.json();
//       setSeats(data);
//     } catch (err) {
//       console.error("Error fetching seats", err);
//     }
//   };

//   const bookSeats = async (e) => {
//     e.preventDefault();
//     if (numberOfSeats < 1 || numberOfSeats > 7) return;

//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch("http://localhost:5000/api/v1/seats/book", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ numberOfSeats }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Booking failed");

//       setMessage(data.message || "Booking successful");
//       await fetchSeats();
//     } catch (err) {
//       setMessage(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelBooking = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/v1/seats/cancel", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Cancel failed");

//       setMessage(data.message);
//       fetchSeats();
//     } catch (err) {
//       setMessage(err.message);
//     }
//   };

//   const resetSeats = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/v1/seats/reset", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Reset failed");

//       setMessage(data.message);
//       fetchSeats();
//     } catch (err) {
//       setMessage(err.message);
//     }
//   };

//   const groupedSeats = () => {
//     const rows = {};
//     seats.forEach((seat) => {
//       if (!rows[seat.row_number]) rows[seat.row_number] = [];
//       rows[seat.row_number].push(seat);
//     });
//     return Object.values(rows);
//   };

//   const availableCount = seats.filter((s) => !s.is_reserved).length;
//   const bookedCount = seats.filter((s) => s.is_reserved).length;

//   return (
//     <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-4 overflow-x-hidden relative">
//       {/* Toast Notification */}
//       {showToast && (
//         <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50 transition-all duration-500">
//           {message}
//         </div>
//       )}

//       <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
//         Train Seat Booking
//       </h1>

//       <div className="grid md:grid-cols-2 gap-4 sm:gap-8 items-start">
//         {/* Form Section */}
//         <div className="bg-white border rounded shadow-lg p-4 sm:p-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
//             {token ? (
//               <>
//                 Welcome{" "}
//                 <span className="text-green-600 font-semibold text-2xl">
//                   {username}
//                 </span>
//                 , book your seat
//               </>
//             ) : (
//               "Login to book your seat"
//             )}
//           </h2>

//           <form onSubmit={bookSeats} className="space-y-3 sm:space-y-4">
//             <input
//               type="number"
//               min="1"
//               max="7"
//               value={numberOfSeats}
//               onChange={(e) => setNumberOfSeats(Number(e.target.value))}
//               className="border px-3 py-2 rounded w-full text-sm"
//               placeholder="Number of seats"
//               disabled={!token}
//               required
//             />
//             <button
//               type="submit"
//               disabled={!token || loading}
//               className={`w-full px-4 py-2 rounded text-sm sm:text-base transition text-white ${
//                 token
//                   ? "bg-blue-600 hover:bg-blue-700"
//                   : "bg-gray-400 cursor-not-allowed"
//               }`}
//             >
//               {loading ? "Booking..." : "Book Seats"}
//             </button>
//           </form>

//           {/* Cancel and Reset Buttons */}
//           <div className="mt-2 space-y-2">
//             <button
//               onClick={cancelBooking}
//               disabled={!token}
//               className={`w-full px-4 py-2 rounded text-sm text-white transition ${
//                 token
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-gray-400 cursor-not-allowed"
//               }`}
//             >
//               Cancel Booking
//             </button>
//             <button
//               onClick={resetSeats}
//               disabled={!token}
//               className={`w-full px-4 py-2 rounded text-sm text-white transition ${
//                 token
//                   ? "bg-yellow-500 hover:bg-yellow-600"
//                   : "bg-gray-400 cursor-not-allowed"
//               }`}
//             >
//               Reset All Seats
//             </button>
//           </div>
//         </div>

//         {/* Grid Section */}
//         <div className="bg-gray-50 border rounded shadow-md p-4 sm:p-6">
//           <h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
//             Seat Layout
//           </h3>
//           <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 min-w-[280px] overflow-x-auto">
//             {groupedSeats().map((row, i) => (
//               <div
//                 key={i}
//                 className="flex gap-1 sm:gap-2 justify-center flex-nowrap"
//               >
//                 {row.map((seat) => (
//                   <div
//                     key={seat.id}
//                     className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center text-xs sm:text-sm font-semibold text-white border ${
//                       seat.is_reserved ? "bg-yellow-400" : "bg-green-500"
//                     }`}
//                   >
//                     {seat.seat_number}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium flex-wrap">
//             <div className="flex items-center gap-1 sm:gap-2 bg-yellow-400 p-2 rounded-md">
//               <span className="text-center">Available: {availableCount}</span>
//             </div>
//             <div className="flex items-center gap-1 sm:gap-2 bg-green-500 p-2 rounded-md">
//               <span>Booked: {bookedCount}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";

export default function Booking() {
  const [seats, setSeats] = useState([]); // All seats from backend
  const [numberOfSeats, setNumberOfSeats] = useState(1); // Seats to book (1–7)
  const [loading, setLoading] = useState(false); // Loading state during booking
  const [message, setMessage] = useState(""); // Message to show in toast
  const [showToast, setShowToast] = useState(false); // Toast visibility toggle
  const [username, setUsername] = useState(""); // Logged-in user's name
  const token = localStorage.getItem("token"); // JWT token

  useEffect(() => {
    // Fetch seats on mount
    fetchSeats();

    // Get username from localStorage if token exists
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData?.username) {
        setUsername(userData.username);
      }
    }
  }, [token]);

  useEffect(() => {
    // Show toast for 3 seconds whenever a message is set
    if (message) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch seats from API
  const fetchSeats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/seats/seats");
      const data = await res.json();
      setSeats(data);
    } catch (err) {
      console.error("Error fetching seats", err);
    }
  };

  // Book seats (1 to 7) using POST
  const bookSeats = async (e) => {
    e.preventDefault();
    if (numberOfSeats < 1 || numberOfSeats > 7) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/seats/book", {
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
      await fetchSeats(); // Refresh seat layout
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel user's booking
  const cancelBooking = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/seats/cancel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cancel failed");

      setMessage(data.message);
      fetchSeats();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Reset all bookings (admin-like)
  const resetSeats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/seats/reset", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setMessage(data.message);
      fetchSeats();
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Group seats by row number for display
  const groupedSeats = () => {
    const rows = {};
    seats.forEach((seat) => {
      if (!rows[seat.row_number]) rows[seat.row_number] = [];
      rows[seat.row_number].push(seat);
    });
    return Object.values(rows);
  };

  // Count available and booked seats
  const availableCount = seats.filter((s) => !s.is_reserved).length;
  const bookedCount = seats.filter((s) => s.is_reserved).length;

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-4 overflow-x-hidden relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50 transition-all duration-500">
          {message}
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
        Train Seat Booking
      </h1>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-8 items-start">
        {/* Form Section */}
        <div className="bg-white border rounded shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center">
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

          {/* Booking Form */}
          <form onSubmit={bookSeats} className="space-y-3 sm:space-y-4">
            <input
              type="number"
              min="1"
              max="7"
              value={numberOfSeats}
              onChange={(e) => setNumberOfSeats(Number(e.target.value))}
              className="border px-3 py-2 rounded w-full text-sm"
              placeholder="Number of seats"
              disabled={!token}
              required
            />
            <button
              type="submit"
              disabled={!token || loading}
              className={`w-full px-4 py-2 rounded text-sm sm:text-base transition text-white ${
                token
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Booking..." : "Book Seats"}
            </button>
          </form>

          {/* Cancel and Reset Buttons */}
          <div className="mt-2 space-y-2">
            <button
              onClick={cancelBooking}
              disabled={!token}
              className={`w-full px-4 py-2 rounded text-sm text-white transition ${
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
              className={`w-full px-4 py-2 rounded text-sm text-white transition ${
                token
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Reset All Seats
            </button>
          </div>
        </div>

        {/* Seat Layout Section */}
        <div className="bg-gray-50 border rounded shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-center mb-3 sm:mb-4">
            Seat Layout
          </h3>
          <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 min-w-[280px] overflow-x-auto">
            {groupedSeats().map((row, i) => (
              <div
                key={i}
                className="flex gap-1 sm:gap-2 justify-center flex-nowrap"
              >
                {row.map((seat) => (
                  <div
                    key={seat.id}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center text-xs sm:text-sm font-semibold text-white border ${
                      seat.is_reserved ? "bg-yellow-400" : "bg-green-500"
                    }`}
                  >
                    {seat.seat_number}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Seat Count Summary */}
          <div className="flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium flex-wrap">
            <div className="flex items-center gap-1 sm:gap-2 bg-yellow-400 p-2 rounded-md">
              <span className="text-center">Available: {availableCount}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 bg-green-500 p-2 rounded-md">
              <span>Booked: {bookedCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
