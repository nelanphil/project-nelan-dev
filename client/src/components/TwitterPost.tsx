import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
} from "lucide-react";

interface TwitterPostProps {
  profileImage: string;
  name: string;
  handle: string;
  content: string;
  timestamp?: string;
}

export function TwitterPost({
  profileImage,
  name,
  handle,
  content,
  timestamp = "2h",
}: TwitterPostProps) {
  return (
    <Card className="max-w-[700px] w-full mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="pl-2.5 pr-3 py-4 sm:p-6 flex items-start gap-2 sm:gap-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <ImageWithFallback
            src={profileImage}
            alt={name}
            className="w-10 h-10 sm:w-16 sm:h-16 rounded-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1 sm:pr-1">
          {/* Name and Handle */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-1 min-w-0">
                <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                  {name}
                </span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.52 3.59a3 3 0 014.96 0l1.18 1.67a1 1 0 00.65.44l2.03.35a3 3 0 013.5 3.5l-.35 2.03a1 1 0 00.44.65l1.67 1.18a3 3 0 010 4.96l-1.67 1.18a1 1 0 00-.44.65l-.35 2.03a3 3 0 01-3.5 3.5l-2.03-.35a1 1 0 00-.65.44l-1.18 1.67a3 3 0 01-4.96 0l-1.18-1.67a1 1 0 00-.65-.44l-2.03-.35a3 3 0 01-3.5-3.5l.35-2.03a1 1 0 00-.44-.65L3.59 15.48a3 3 0 010-4.96l1.67-1.18a1 1 0 00.44-.65l.35-2.03a3 3 0 013.5-3.5l2.03.35a1 1 0 00.65-.44l1.18-1.67z" />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-gray-500 dark:text-gray-400 truncate">
                  @{handle}
                </span>
                <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                  · {timestamp}
                </span>
              </div>
            </div>
            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 flex-shrink-0 ml-2">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Tweet Content */}
          <div className="text-gray-900 dark:text-white mb-3 sm:mb-4 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
            {content}
          </div>

          {/* Engagement Buttons */}
          <div className="flex items-center justify-between max-w-md -ml-2">
            <button className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group p-1.5 sm:p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">24</span>
            </button>
            <button className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors group p-1.5 sm:p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30">
              <Repeat2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">12</span>
            </button>
            <button className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors group p-1.5 sm:p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/30">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">156</span>
            </button>
            <button className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group p-1.5 sm:p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30">
              <Share className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}