export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
}) {
  return (
    <div className="sticky top-0 z-50 bg-amber-900 text-white shadow-lg">

      <div className="flex items-center p-4">

        {showBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4"
          >
            ←
          </button>
        )}

        <div>
          <h1 className="text-2xl font-bold">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-amber-100 mt-1">
              {subtitle}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}