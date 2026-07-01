export default function MenuCategoryCard({
  category,
  count,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-3xl shadow border border-gray-100 p-6 hover:shadow-xl transition"
    >
      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold">
            {category}
          </h2>

          <p className="text-gray-500 mt-2">
            {count} Items
          </p>

        </div>

        <div className="text-3xl">
          →
        </div>

      </div>
    </button>
  );
}