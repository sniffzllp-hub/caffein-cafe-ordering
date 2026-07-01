import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow sticky top-0 z-50">

        <div className="max-w-6xl mx-auto p-6">

          <h1 className="text-4xl font-bold">
            ☕ Admin Portal
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back.
          </p>

        </div>

      </div>

      <div className="max-w-6xl mx-auto p-6">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          <button
            onClick={() => navigate("/menu-studio")}
            className="bg-white rounded-3xl shadow p-6 text-left hover:shadow-xl transition"
          >
            <div className="text-5xl">🍽️</div>

            <h2 className="text-2xl font-bold mt-4">
              Menu Studio
            </h2>

            <p className="text-gray-500 mt-2">
              Menu, categories, pricing & images
            </p>
          </button>

          <div className="bg-white rounded-3xl shadow p-6 opacity-60">

            <div className="text-5xl">📊</div>

            <h2 className="text-2xl font-bold mt-4">
              Analytics
            </h2>

            <p className="text-gray-500 mt-2">
              Coming Soon
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow p-6 opacity-60">

            <div className="text-5xl">👥</div>

            <h2 className="text-2xl font-bold mt-4">
              Staff
            </h2>

            <p className="text-gray-500 mt-2">
              Coming Soon
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow p-6 opacity-60">

            <div className="text-5xl">🎟️</div>

            <h2 className="text-2xl font-bold mt-4">
              Coupons
            </h2>

            <p className="text-gray-500 mt-2">
              Coming Soon
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow p-6 opacity-60">

            <div className="text-5xl">🧾</div>

            <h2 className="text-2xl font-bold mt-4">
              Taxes
            </h2>

            <p className="text-gray-500 mt-2">
              Coming Soon
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow p-6 opacity-60">

            <div className="text-5xl">⚙️</div>

            <h2 className="text-2xl font-bold mt-4">
              Settings
            </h2>

            <p className="text-gray-500 mt-2">
              Coming Soon
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}