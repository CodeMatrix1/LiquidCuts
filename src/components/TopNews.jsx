export default function TopNews() {
  return (
    <div className="flex flex-col justify-start h-full w-full flex-1 overflow-y-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top News</h1>
      <p className="text-gray-600">Stay tuned for the latest updates!</p>
      <div className="mt-6">
        {/* Placeholder for news content */}
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-[800px]">
          <h2 className="text-xl font-semibold mb-2">Latest Article</h2>
          <p className="text-gray-700">
            This is where the latest news will be displayed.
          </p>
        </div>
      </div>
    </div>
  );
}
