import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowAnnoucement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://vibe-hive-omega.vercel.app/announcements"
        );

        console.log("Raw API response:", response.data);

        // Handle the specific data structure we've observed
        // If the response is a single object with _id, treat it as a single announcement
        if (
          response.data &&
          typeof response.data === "object" &&
          response.data._id
        ) {
          setAnnouncements([response.data]); // Wrap in array to make it mappable
        }
        // If it's already an array
        else if (Array.isArray(response.data)) {
          setAnnouncements(response.data);
        }
        // If it's an object with a data property that's an array
        else if (
          response.data &&
          typeof response.data === "object" &&
          Array.isArray(response.data.data)
        ) {
          setAnnouncements(response.data.data);
        }
        // Any other case, set to empty array
        else {
          console.log("Unexpected API response structure:", response.data);
          setAnnouncements([]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No announcements available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Announcements
      </h2>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-2">
              {announcement.authorImage && (
                <img
                  src={announcement.authorImage}
                  alt={announcement.authorName || "Admin"}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
              )}
              <div>
                <h3 className="font-medium text-gray-900">
                  {announcement.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {announcement.authorName || "Admin"} •{" "}
                  {announcement.createdAt
                    ? new Date(announcement.createdAt).toLocaleDateString()
                    : "Date not available"}
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-line">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowAnnoucement;
