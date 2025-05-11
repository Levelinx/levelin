import { Bell, Check, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Dummy notification data
const notifications = [
  {
    id: 1,
    type: "message",
    title: "New message from John Doe",
    content: "Hey, I wanted to discuss the project timeline...",
    timestamp: "2 minutes ago",
    isRead: false,
  },
  {
    id: 2,
    type: "system",
    title: "System Update",
    content: "Your account has been successfully verified",
    timestamp: "1 hour ago",
    isRead: true,
  },
  {
    id: 3,
    type: "alert",
    title: "Payment Received",
    content: "You've received a payment of $500 for Project X",
    timestamp: "3 hours ago",
    isRead: false,
  },
  {
    id: 4,
    type: "message",
    title: "Team Meeting Reminder",
    content: "Don't forget about the team meeting at 2 PM today",
    timestamp: "1 day ago",
    isRead: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notifications
        </h1>
        <div className="flex gap-2 ml-auto">
          
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.isRead ? "bg-white" : "bg-blue-50"
            } hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{notification.title}</h3>
                  {!notification.isRead && (
                    <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{notification.content}</p>
                <p className="text-sm text-gray-500 mt-2">{notification.timestamp}</p>
              </div>
              <div className="flex gap-2">
                {!notification.isRead && (
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}