// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Booking from "./pages/Booking";
// import Navbar from "./components/Navbar";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div className="container mx-auto px-4 py-8">
//         <Routes>
//           <Route path="/" element={<Booking />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* Background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65 -z-10"
          style={{ backgroundImage: "url('/images/train-bg.jpg')" }}
        />

        {/* Foreground content */}
        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
