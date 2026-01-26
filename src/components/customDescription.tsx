import React, { useState } from "react";

interface CustomDescriptionProps {
  description?: string;
  maxChars?: number;
  className?: string;
}

const CustomDescription: React.FC<CustomDescriptionProps> = ({
  description,
  maxChars = 300,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if we have valid input
  if (!description) {
    return (
      <div className={`p-4 text-gray-500 ${className}`}>
        <p>Nessuna descrizione disponibile</p>
      </div>
    );
  }

  const shouldTruncate = description.length > maxChars;
  const displayText =
    !isExpanded && shouldTruncate
      ? description.substring(0, maxChars) + "..."
      : description;

  return (
    <div
      className={`text-gray-700 dark:text-gray-300 leading-relaxed ${className}`}
    >
      <p>{displayText}</p>

      {shouldTruncate && (
        <div className="mt-2">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              Leggi di più
            </button>
          ) : (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              Leggi meno
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDescription;
