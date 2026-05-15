import React from "react";
import { CalendarDays, Clock3, Eye, Trash2, MapPin } from "lucide-react";
import Image from "next/image";

const bookings = [
  {
    _id: "6a0063397c711937f6f78f12",
    destinationName: "Bali Paradise",
    country: "Indonesia",
    category: "Beach",
    price: "1299",
    duration: "7 Days / 6 Nights",
    departureDate: "2026-06-15",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/01/20/00/30/maldives-1993704_1280.jpg",
    description:
      "Enjoy the tropical beauty of Bali with beaches, temples, and luxury resorts.",
    status: "Confirmed",
  },
  {
    _id: "6a0063397c711937f6f78f13",
    destinationName: "Maldives Escape",
    country: "Maldives",
    category: "Luxury",
    price: "1599",
    duration: "5 Days / 4 Nights",
    departureDate: "2026-07-10",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/18/16/16/beach-1836467_1280.jpg",
    description:
      "Crystal clear water, water villas and unforgettable sunsets.",
    status: "Confirmed",
  },
  {
    _id: "6a0063397c711937f6f78f14",
    destinationName: "Venice & Italian Riviera",
    country: "Italy",
    category: "Adventure",
    price: "1899",
    duration: "8 Days / 7 Nights",
    departureDate: "2026-08-20",
    imageUrl:
      "https://cdn.pixabay.com/photo/2016/11/29/09/16/adventure-1868817_1280.jpg",
    description:
      "Explore the beauty of Venice and the stunning Italian coastline.",
    status: "Pending",
  },
];

const statusColors = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-500 mt-2">
            Manage and view your upcoming travel plans
          </p>
          <p className="mt-4 text-sm text-gray-500">
        Showing {count} destinations
      </p>
        </div>

        {/* Booking Cards */}
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-80 h-60 md:h-auto">
                  <Image
                    src={booking.imageUrl}
                    alt={booking.destinationName}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Status */}
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-3 ${statusColors[booking.status]}`}
                    >
                      {booking.status}
                    </span>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {booking.destinationName}
                    </h2>

                    {/* Country & Category */}
                    <div className="flex items-center gap-2 text-gray-500 mb-3">
                      <MapPin size={16} />
                      <span>
                        {booking.country} • {booking.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4">
                      {booking.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span>
                          Departure:{" "}
                          {new Date(
                            booking.departureDate
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock3 size={16} />
                        <span>{booking.duration}</span>
                      </div>

                      <div className="text-sm text-gray-400">
                        Booking ID: {booking._id}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <span className="text-3xl font-bold text-cyan-600">
                        ${booking.price}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-5 py-2 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition">
                        <Trash2 size={16} />
                        Cancel
                      </button>

                      <button className="flex items-center gap-2 px-5 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition">
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}