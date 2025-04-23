// import { useEffect, useState } from "react";

// export default function Booking() {
//   const [seats, setSeats] = useState([]); // All seats from backend
//   const [numberOfSeats, setNumberOfSeats] = useState(1); // Seats to book (1–7)
//   const [loading, setLoading] = useState(false); // Loading state during booking
//   const [message, setMessage] = useState(""); // Message to show in toast
//   const [showToast, setShowToast] = useState(false); // Toast visibility toggle
//   const [username, setUsername] = useState(""); // Logged-in user's name
//   const token = localStorage.getItem("token"); // JWT token

//   useEffect(() => {
//     // Fetch seats on mount
//     fetchSeats();

//     // Get username from localStorage if token exists
//     if (token) {
//       const userData = JSON.parse(localStorage.getItem("user"));
//       if (userData?.username) {
//         setUsername(userData.username);
//       }
//     }
//   }, [token]);

//   useEffect(() => {
//     // Show toast for 3 seconds whenever a message is set
//     if (message) {
//       setShowToast(true);
//       const timer = setTimeout(() => {
//         setShowToast(false);
//         setMessage("");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // Fetch seats from API
//   const fetchSeats = async () => {
//     try {
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/seats`);
//       const data = await res.json();
//       setSeats(data);
//     } catch (err) {
//       console.error("Error fetching seats", err);
//     }
//   };

//   // Book seats (1 to 7) using POST
//   const bookSeats = async (e) => {
//     e.preventDefault();
//     if (numberOfSeats < 1 || numberOfSeats > 7) return;

//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/book`, {
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
//       await fetchSeats(); // Refresh seat layout
//     } catch (err) {
//       setMessage(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cancel user's booking
//   const cancelBooking = async () => {
//     try {
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/cancel`, {
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

//   // Reset all bookings (admin-like)
//   const resetSeats = async () => {
//     try {
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/reset`, {
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

//   // Group seats by row number for display
//   const groupedSeats = () => {
//     const rows = {};
//     seats.forEach((seat) => {
//       if (!rows[seat.row_number]) rows[seat.row_number] = [];
//       rows[seat.row_number].push(seat);
//     });
//     return Object.values(rows);
//   };

//   // Count available and booked seats
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

//           {/* Booking Form */}
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

//         {/* Seat Layout Section */}
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

//           {/* Seat Count Summary */}
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
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/seats`);
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
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/book`, {
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
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/cancel`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
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
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/reset`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Reset failed");

//       setMessage(data.message);
//       fetchSeats();
//     } catch (err) {
//       setMessage(err.message);
//     }
//   };

//   const availableCount = seats.filter((s) => !s.is_reserved).length;
//   const bookedCount = seats.filter((s) => s.is_reserved).length;
//   const bookedSeatNumbers = seats
//     .filter((s) => s.is_reserved)
//     .map((s) => s.id)
//     .sort((a, b) => a - b);

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-hidden relative">
//       {showToast && (
//         <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50 transition-all duration-500">
//           {message}
//         </div>
//       )}

//       <h1 className="text-3xl font-bold mb-6 text-center">Train Seat Booking</h1>

//       <div className="grid md:grid-cols-2 gap-8 items-start">
//         {/* Form Section */}
//         <div className="bg-white border rounded shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4 text-center">
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

//           {/* Booked Seat Numbers */}
//           <div className="mt-4 text-sm mb-5">
//             <p className="font-semibold mb-1">Booked Seats:</p>
//             <div className="flex flex-wrap gap-1">
//               {bookedSeatNumbers.map((seatId) => (
//                 <span
//                   key={seatId}
//                   className="bg-yellow-400 text-black text-xs font-medium px-2 py-1 rounded"
//                 >
//                   {seatId}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Booking Form */}
//           <form onSubmit={bookSeats} className="space-y-4">
//             <input
//               type="number"
//               min="1"
//               max="7"
//               value={numberOfSeats}
//               onChange={(e) => setNumberOfSeats(Number(e.target.value))}
//               className="border border-r-emerald-950 px-3 py-2 rounded w-full text-sm"
//               placeholder="Number of seats"
//               disabled={!token}
//               required
//             />
//             <button
//               type="submit"
//               disabled={!token || loading}
//               className={`w-full px-4 py-2 rounded text-base transition text-white ${
//                 token
//                   ? "bg-blue-600 hover:bg-blue-700"
//                   : "bg-gray-400 cursor-not-allowed"
//               }`}
//             >
//               {loading ? "Booking..." : "Book Seats"}
//             </button>
//           </form>

          

//           {/* Cancel and Reset Buttons */}
//           <div className="mt-6 space-y-2">
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

//         {/* Seat Layout */}
//         <div className="bg-gray-50 border rounded shadow-md p-6">
//           <h3 className="text-lg font-semibold text-center mb-4">Seat Layout</h3>
//           <div className="grid grid-cols-7 gap-2 justify-items-center mb-6">
//             {seats
//               .sort((a, b) => a.id - b.id)
//               .map((seat) => (
//                 <div
//                   key={seat.id}
//                   className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold text-black border ${
//                     seat.is_reserved ? "bg-yellow-400" : "bg-green-500"
//                   }`}
//                 >
//                   {seat.id}
//                 </div>
//               ))}
//           </div>

//           {/* Seat Count Summary */}
//           <div className="flex justify-center gap-4 text-sm font-medium flex-wrap">
//             <div className="flex items-center gap-2 bg-green-500 text-black px-3 py-1 rounded-md">
//               Available Seats = {availableCount}
//             </div>
//             <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-md">
//               Booked Seats = {bookedCount}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// import { useEffect, useState } from "react";

// export default function Booking() {
//   const [seats, setSeats] = useState([]);
//   const [numberOfSeats, setNumberOfSeats] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);
//   const [username, setUsername] = useState("");
//   const [lastBookedSeats, setLastBookedSeats] = useState([]);
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
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/seats`);
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
//     setLastBookedSeats([]);

//     try {
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/book`, {
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

//       if (data.bookedSeats) {
//         setLastBookedSeats(data.bookedSeats); // assumes API returns bookedSeats array
//       }

//       await fetchSeats();
//     } catch (err) {
//       setMessage(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelBooking = async () => {
//     try {
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/cancel`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Cancel failed");

//       setMessage(data.message);
//       setLastBookedSeats([]);
//       fetchSeats();
//     } catch (err) {
//       setMessage(err.message);
//     }
//   };

//   const resetSeats = async () => {
//     try {
//       const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/v1/seats/reset`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Reset failed");

//       setMessage(data.message);
//       setLastBookedSeats([]);
//       fetchSeats();
//     } catch (err) {
//       setMessage(err.message);
//     }
//   };

//   const availableCount = seats.filter((s) => !s.is_reserved).length;
//   const bookedCount = seats.filter((s) => s.is_reserved).length;

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-hidden relative">
//       {showToast && (
//         <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50 transition-all duration-500">
//           {message}
//         </div>
//       )}

//       <h1 className="text-3xl font-bold mb-6 text-center">Train Seat Booking</h1>

//       <div className="grid md:grid-cols-2 gap-8 items-start">
//         {/* Form Section */}
//         <div className="bg-white border rounded shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4 text-center">
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

//           {/* Booked Seat Numbers in current session */}
//           {lastBookedSeats.length > 0 && (
//             <div className="mt-4 text-sm mb-5">
//               <p className="font-semibold mb-1">Just Booked Seats:</p>
//               <div className="flex flex-wrap gap-1">
//                 {lastBookedSeats.sort((a, b) => a - b).map((seatId) => (
//                   <span
//                     key={seatId}
//                     className="bg-yellow-400 text-black text-xs font-medium px-2 py-1 rounded"
//                   >
//                     {seatId}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Booking Form */}
//           <form onSubmit={bookSeats} className="space-y-4">
//             <input
//               type="number"
//               min="1"
//               max="7"
//               value={numberOfSeats}
//               onChange={(e) => setNumberOfSeats(Number(e.target.value))}
//               className="border border-gray-400 px-3 py-2 rounded w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Number of seats"
//               disabled={!token}
//               required
//             />
//             <button
//               type="submit"
//               disabled={!token || loading}
//               className={`w-full px-4 py-2 rounded text-base transition text-white ${
//                 token
//                   ? "bg-blue-600 hover:bg-blue-700"
//                   : "bg-gray-400 cursor-not-allowed"
//               }`}
//             >
//               {loading ? "Booking..." : "Book Seats"}
//             </button>
//           </form>

//           {/* Cancel and Reset Buttons */}
//           <div className="mt-6 space-y-2">
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

//         {/* Seat Layout */}
//         <div className="bg-gray-50 border rounded shadow-md p-6">
//           <h3 className="text-lg font-semibold text-center mb-4">Seat Layout</h3>
//           <div className="grid grid-cols-7 gap-3 place-items-center mb-6">
//             {seats
//               .sort((a, b) => a.id - b.id)
//               .map((seat) => (
//                 <div
//                   key={seat.id}
//                   className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold text-black border ${
//                     seat.is_reserved ? "bg-yellow-400" : "bg-green-500"
//                   }`}
//                 >
//                   {seat.id}
//                 </div>
//               ))}
//           </div>

//           {/* Seat Count Summary */}
//           <div className="flex justify-center gap-4 text-sm font-medium flex-wrap">
//             <div className="flex items-center gap-2 bg-green-500 text-black px-3 py-1 rounded-md">
//               Available Seats = {availableCount}
//             </div>
//             <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-md">
//               Booked Seats = {bookedCount}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




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
