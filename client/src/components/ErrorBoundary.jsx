import React from "react";
import { Link } from "react-router-dom";

export default function ErrorBoundary({ error, resetError }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-3">
          <button
            onClick={resetError}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
          <Link
            to="/home"
            className="block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Go Home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-red-600 font-medium">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-3 bg-red-50 rounded text-xs overflow-auto">
              {error?.stack || error?.message || 'Unknown error'}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
