export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-3xl shadow border border-gray-100 p-5">

      <div className="flex gap-5">

        <div className="w-24 h-24 rounded-2xl bg-gray-200 flex items-center justify-center text-4xl">
          🍽️
        </div>

        <div className="flex-1">

          <div className="flex justify-between">

            <div>

              <h2 className="text-xl font-bold">
                {item.Name}
              </h2>

              <p className="text-gray-500 mt-1">
                {item.Category}
              </p>

            </div>

            <h2 className="text-2xl font-bold">
              ₹{item.Price}
            </h2>

          </div>

          <div className="flex gap-3 mt-5">

            <button
              onClick={() => onEdit(item)}
              className="flex-1 rounded-xl bg-blue-600 text-white py-2"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(item.id)}
              className="flex-1 rounded-xl bg-red-500 text-white py-2"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}