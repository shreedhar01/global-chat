import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-semibold">404 - Page Not Found</h1>
        <p className="text-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border rounded-md text-sm"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
