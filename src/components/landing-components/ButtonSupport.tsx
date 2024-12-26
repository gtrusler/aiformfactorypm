import React from "react";
import Link from "next/link";

interface ButtonSupportProps {
  className?: string;
}

export function ButtonSupport({
  className,
}: ButtonSupportProps): React.JSX.Element {
  return (
    <Link
      href="/support"
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    >
      Contact Support
    </Link>
  );
}
