import CreatePollForm from "../components/CreatePollForm";

export default function CreatePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create a Poll</h1>
        <p className="text-gray-500 mt-1">
          Ask a question and add options for people to vote on
        </p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <CreatePollForm />
      </div>
    </div>
  );
}
