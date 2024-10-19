import { Link, Outlet } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">
        <b>Oops!</b>
      </h2>
      <h2 className="text-2xl mb-4">
        The page you're looking for doesn't exist.
      </h2>
      <div className="mt-4">
        <Link to="/">
          <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l9-9m0 0l9 9m-9-9v18"
              />
            </svg>
            Take Me Home
          </button>
        </Link>
      </div>
      <Outlet />
    </div>
  );
}

export default NotFound;
