"use client";

import Link from "next/link";
import { Poll } from "@/lib/polls";

export default function PollCard({
  poll,
  onDelete,
}: {
  poll: Poll;
  onDelete?: (id: string) => void;
}) {
  const timeAgo = getTimeAgo(poll.createdAt);

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all bg-white flex items-start justify-between gap-4">
      <Link href={`/poll/${poll.id}`} className="flex-1 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {poll.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{poll.options.length} options</span>
          <span>&middot;</span>
          <span>
            {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
          </span>
          <span>&middot;</span>
          <span>{timeAgo}</span>
        </div>
      </Link>
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(poll.id);
          }}
          className="text-gray-300 hover:text-red-500 transition-colors p-1 shrink-0"
          title="Delete poll"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
