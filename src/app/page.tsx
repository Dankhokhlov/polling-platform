import PollList from "./components/PollList";

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
        <p className="text-gray-500 mt-1">Vote and see results in real-time</p>
      </div>
      <PollList />
    </div>
  );
}
