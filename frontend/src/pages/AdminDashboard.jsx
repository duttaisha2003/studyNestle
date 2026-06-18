import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router";
import Footer from "./Footer";
import { Home, ListChecks } from "lucide-react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${backendUrl}checkAdmin`, {
          credentials: "include",
        });
        if (!res.ok) {
          navigate("/adminLogin"); // redirect if not logged in
        }
      } catch (err) {
        navigate("/adminLogin");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-green-700 text-white flex flex-col shadow-lg">
          <div className="p-6 text-center border-b border-green-600">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>

          <nav className="flex-1 p-4 space-y-4">
            <Link
              to="/adminDashboard"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-600 transition ${
                location.pathname === "/adminDashboard" ? "bg-green-600" : ""
              }`}
            >
              <Home size={20} /> Dashboard
            </Link>

            <Link
              to="/adminDashboard/pending"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-600 transition ${
                location.pathname === "/adminDashboard/pending" ? "bg-green-600" : ""
              }`}
            >
              <ListChecks size={20} /> Pending List
            </Link>

            <Link
              to="/adminDashboard/approve"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-600 transition ${
                location.pathname === "/adminDashboard/approve" ? "bg-green-600" : ""
              }`}
            >
              ✓ Approved List
            </Link>
          </nav>

     <button
  onClick={async () => {
    try {
      await fetch(`${backendUrl}adminlogout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    navigate("/adminLogin");
  }}
  className="bg-green-200 text-black px-4 py-3 m-4 rounded-lg hover:bg-green-900 hover:text-white"
>
  Logout
</button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {location.pathname === "/adminDashboard" && (
            <>
              <h1 className="text-3xl font-bold text-green-800 mb-6">Admin Dashboard</h1>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
                  <h2 className="text-xl font-semibold mb-4">Pending List</h2>
                  <p className="text-gray-600 mb-4">View and manage all pending requests.</p>
                  <Link to="pending">
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                      View Pending
                    </button>
                  </Link>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
                  <h2 className="text-xl font-semibold mb-4">Approved List</h2>
                  <p className="text-gray-600 mb-4">See all approved items and manage them.</p>
                  <Link to="approve">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                      View Approved
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Nested routes render here */}
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}

export default AdminDashboard;
