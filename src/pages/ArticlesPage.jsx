import React, { useEffect, useMemo, useState } from "react";
import { Search, FileText, Eye, X } from "lucide-react";

const API = "http://localhost:5000/api";

function AdminArticles() {
  const token = localStorage.getItem("hp:token");
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null); // ✅ for View modal

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/articles`, { headers });
      const data = await res.json();
      console.log("Articles loaded:", data);
      setList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading articles:", error);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  const filtered = list.filter(
    (a) =>
      a.Title?.toLowerCase().includes(search.toLowerCase()) ||
      a.Category?.toLowerCase().includes(search.toLowerCase())
  );

  const remove = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await fetch(`${API}/articles/${id}`, { method: "DELETE", headers });
      setList((p) => p.filter((x) => x._id !== id));
      alert("Article deleted successfully!");
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                Article Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage health articles and medical content
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-12 pr-6 py-4 rounded-xl bg-white border border-gray-200 text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
              placeholder="Search by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg py-20 text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Loading articles...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-6">
            {filtered.map((a) => (
              <div
                key={a._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Image */}
                  <div className="w-full md:w-48 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0">
                    {a.ImageURL ? (
                      <img
                        src={a.ImageURL}
                        alt={a.Title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <FileText className="w-16 h-16 opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {a.Title}
                          </h3>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                              {a.Category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-base line-clamp-2 mb-4">
                        {a.ShortDescription}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>By {a.createdBy || "Dr. Smith"}</span>
                        <span>•</span>
                        <span>
                          {a.createdAt
                            ? new Date(a.createdAt).toLocaleDateString()
                            : "2024-01-10"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setViewModal(a)} // ✅ open modal
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg py-20 text-center border border-gray-100">
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No articles found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or add a new article
            </p>
          </div>
        )}
      </div>

      {/* ✅ VIEW MODAL */}
      {viewModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewModal(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">
                {viewModal.Title}
              </h3>
              <button
                onClick={() => setViewModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {viewModal.ImageURL && (
                <img
                  src={viewModal.ImageURL}
                  alt={viewModal.Title}
                  className="w-full rounded-xl object-cover mb-4"
                />
              )}
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                  {viewModal.Category}
                </span>
                <p className="text-gray-600 text-sm mb-3">
                  Published on{" "}
                  {viewModal.createdAt
                    ? new Date(viewModal.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </p>
              </div>

              <p className="text-gray-800 text-lg font-semibold">
                {viewModal.ShortDescription}
              </p>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {viewModal.Content || "No content available."}
              </div>

              {viewModal.SourceLink && (
                <div className="pt-4">
                  <a
                    href={viewModal.SourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🔗 Read Original Source
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminArticles;
