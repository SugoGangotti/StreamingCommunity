import { Link } from "react-router-dom";

export const LogoAndText = () => {
  return (
    <Link to="/" className="flex items-center gap-2 text-white font-semibold">
      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>
      StreamingCommunity
    </Link>
  );
};

export default LogoAndText;
