import PollResults from "../../components/PollResults";
import Link from "next/link";

export default async function PollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <Link
        href="/"
        className="text-blue-500 hover:text-blue-700 text-sm font-medium mb-6 inline-block"
      >
        &larr; Back to all polls
      </Link>
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <PollResults pollId={id} />
      </div>
    </div>
  );
}
