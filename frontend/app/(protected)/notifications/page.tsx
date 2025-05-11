import { Bell, Check, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: number;
  type: string;
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

const notifications: Notification[] = [];

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
        {notifications.length > 0 ? (
          notifications.map((notification) => (
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
          ))
        ) : (
          <div className="text-center p-8 border rounded-lg bg-gray-50 flex items-center justify-center" style={{ minHeight: "60vh" }}>
            <div>
                <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                <p className="text-gray-500">
                    When you receive notifications, they will appear here.
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}