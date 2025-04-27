import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 text-white px-4 py-3 shadow-md flex gap-4">
      <Link
        to="/"
        className={`px-3 py-1 rounded ${
          pathname === "/" ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
      >
        🏷️ Labeling Tool
      </Link>
      <Link
        to="/viewer"
        className={`px-3 py-1 rounded ${
          pathname === "/viewer" ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
      >
        📂 Labeled Viewer
      </Link>
      <Link to="/test" className="hover:underline">
        Test Model
      </Link>
    </nav>
  );
}
