"use client";

import Link from "next/link";
import { Poll } from "@/lib/polls";

export default function PollCard({ poll }: { poll: Poll }) {
  const timeAgo = getTimeAgo(poll.createdAt);

  return (
    <Link href={`/poll/${poll.id}`}>
      <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer bg-white">
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
      </div>
    </Link>
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
