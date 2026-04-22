"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Poll } from "@/lib/polls";

const COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-red-500",
  "bg-indigo-500",
];

export default function PollResults({ pollId }: { pollId: string }) {
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchPoll = useCallback(async () => {
    const res = await fetch(`/api/polls/${pollId}`);
    if (res.ok) {
      setPoll(await res.json());
    }
    setLoading(false);
  }, [pollId]);

  useEffect(() => {
    const savedVote = localStorage.getItem(`poll-vote-${pollId}`);
    if (savedVote) setVoted(savedVote);
    fetchPoll();
    const interval = setInterval(fetchPoll, 2000);
    return () => clearInterval(interval);
  }, [pollId, fetchPoll]);

  async function handleVote(optionId: string) {
    if (voted) return;

    const res = await fetch(`/api/polls/${pollId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });

    if (res.ok) {
      const updated = await res.json();
      setPoll(updated);
      setVoted(optionId);
      localStorage.setItem(`poll-vote-${pollId}`, optionId);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="text-center py-12 text-gray-500">Poll not found</div>
    );
  }

  const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{poll.title}</h1>
      <p className="text-gray-500 mb-8">
        {poll.totalVotes} total vote{poll.totalVotes !== 1 ? "s" : ""}
        {!voted && (
          <span className="ml-2 text-blue-500 font-medium">
            &mdash; Click an option to vote
          </span>
        )}
        {voted && (
          <span className="ml-2 text-green-600 font-medium">
            &mdash; Vote recorded! Results update live.
          </span>
        )}
      </p>

      <div className="flex justify-end mb-4">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Delete poll
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Are you sure?</span>
            <button
              onClick={async () => {
                const res = await fetch(`/api/polls/${pollId}`, {
                  method: "DELETE",
                });
                if (res.ok) router.push("/");
              }}
              className="text-sm px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {poll.options.map((option, i) => {
          const pct =
            poll.totalVotes > 0
              ? Math.round((option.votes / poll.totalVotes) * 100)
              : 0;
          const widthPct =
            poll.totalVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
          const isSelected = voted === option.id;
          const color = COLORS[i % COLORS.length];

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={!!voted}
              className={`w-full text-left rounded-xl p-4 transition-all border-2 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : voted
                    ? "border-gray-100 bg-white cursor-default"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 flex items-center gap-2">
                  {option.text}
                  {isSelected && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                      Your vote
                    </span>
                  )}
                </span>
                <span className="text-sm font-semibold text-gray-600">
                  {pct}% ({option.votes})
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
