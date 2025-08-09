import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-9xl font-bold text-brand">404</h1>
      <p className="text-2xl font-semibold text-white mt-4">Page Not Found</p>
      <p className="text-silver mt-2">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-brand text-white font-bold py-2 px-4 rounded hover:bg-blue-400 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
