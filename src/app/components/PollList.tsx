"use client";

import { useEffect, useState } from "react";
import PollCard from "./PollCard";
import { Poll } from "@/lib/polls";

export default function PollList() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolls() {
      const res = await fetch("/api/polls");
      if (res.ok) {
        setPolls(await res.json());
      }
      setLoading(false);
    }
    fetchPolls();
    const interval = setInterval(fetchPolls, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No polls yet. Create the first one!</p>
      </div>
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this poll?")) return;
    const res = await fetch(`/api/polls/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPolls(polls.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="grid gap-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} onDelete={handleDelete} />
      ))}
    </div>
  );
}
