import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminPending = () => { 
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingMaterials = async () => {
      try {
        const res = await fetch(`${backendUrl}pending`, {
          method: "GET",
          credentials: "include", 
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch pending materials");

        const result = await res.json();
          setMaterials(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchPendingMaterials();
    const interval = setInterval(fetchPendingMaterials, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${backendUrl}approve/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to approve material");

      setMaterials((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${backendUrl}reject/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to reject material");

      setMaterials((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
   <>
   
 
     <div className="bg-white shadow-lg rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">
          Pending Material List
        </h2>
   
      </div>

      {materials.length === 0 ? (
        <p className="text-gray-500 text-center">No pending materials found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">S.No</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Uploaded By</th>
                <th className="px-4 py-2 border">View</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m, index) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border">{m.title}</td>
                  <td className="px-4 py-2 border">{m.subject}</td>
                  <td className="px-4 py-2 border">{m.description}</td>
                  <td className="px-4 py-2 border">
                    {m.uploadedBy?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {m.linkOrFile ? (
                      <button
                        className="bg-green-700 text-white px-3 py-1 rounded-lg hover:bg-green-800 "
                        onClick={() => window.open(m.linkOrFile, "_blank")}
                      >
                        View
                      </button>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="bg-green-700 text-white px-3 py-1 rounded-lg hover:bg-green-900 mr-2"
                      onClick={() => handleApprove(m._id)}
                    >
                       Approve
                    </button>
                    <button
                      className="bg-red-700 text-white px-3 py-1 rounded-lg hover:bg-red-900"
                      onClick={() => handleReject(m._id)}
                    >
                       Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    </>
  );
};

export default AdminPending;
