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
   
 <div className="bg-white shadow-xl rounded-2xl p-6">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-green-800">
      Pending Material List
    </h2>
  </div>

  {materials.length === 0 ? (
    <div className="text-center py-10">
      <p className="text-gray-500 text-lg">
        No pending materials found.
      </p>
    </div>
  ) : (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-green-700 text-white">
            <th className="px-4 py-4 text-center">S.No</th>
            <th className="px-4 py-4 text-left">Title</th>
            <th className="px-4 py-4 text-left">Subject</th>
            <th className="px-4 py-4 text-left">Description</th>
            <th className="px-4 py-4 text-center">Uploaded By</th>
            <th className="px-4 py-4 text-center">View</th>
            <th className="px-4 py-4 text-center min-w-[220px]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {materials.map((m, index) => (
            <tr
              key={m._id}
              className="border-b hover:bg-green-50 transition duration-200"
            >
              <td className="px-4 py-4 text-center font-medium">
                {index + 1}
              </td>

              <td className="px-4 py-4">{m.title}</td>

              <td className="px-4 py-4">{m.subject}</td>

              <td className="px-4 py-4 max-w-xs">
                {m.description}
              </td>

              <td className="px-4 py-4 text-center">
                {m.uploadedBy?.name || "Unknown"}
              </td>

              <td className="px-3 py-3 text-center">
                {m.linkOrFile ? (
                  <button
                    onClick={() =>
                      window.open(m.linkOrFile, "_blank")
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    View 
                  </button>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </td>

              <td className="px-3 py-3">
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => handleApprove(m._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(m._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition"
                  >
                     Reject
                  </button>
                </div>
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
