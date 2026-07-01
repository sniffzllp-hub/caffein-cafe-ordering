function StatusBadge({ children, className }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}

export default function MenuProductCard({ item, onEdit }) {
  return (
    <article
      className={`flex gap-4 border-b border-gray-100 p-5 last:border-b-0 ${
        item.Archived ? "bg-gray-50 opacity-75" : "bg-white"
      }`}
    >
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
        {item.Image ? (
          <img
            src={item.Image}
            alt={item.Name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl">🍽️</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-gray-900">{item.Name}</h3>
            <p className="mt-1 font-bold text-green-700">
              ₹{Number(item.Price || 0).toLocaleString("en-IN")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="self-start rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:border-green-700 hover:text-green-700"
          >
            Edit
          </button>
        </div>

        {item.Description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
            {item.Description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {item.Archived ? (
            <StatusBadge className="bg-gray-200 text-gray-700">Archived</StatusBadge>
          ) : item.Available ? (
            <StatusBadge className="bg-green-100 text-green-700">Available</StatusBadge>
          ) : (
            <StatusBadge className="bg-amber-100 text-amber-700">Unavailable</StatusBadge>
          )}
          {item.BestSeller && (
            <StatusBadge className="bg-yellow-100 text-yellow-800">⭐ Best seller</StatusBadge>
          )}
          {item.TodaysSpecial && (
            <StatusBadge className="bg-orange-100 text-orange-700">🔥 Today&apos;s special</StatusBadge>
          )}
        </div>
      </div>
    </article>
  );
}