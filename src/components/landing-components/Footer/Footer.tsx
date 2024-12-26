import type { JSX } from "react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps): JSX.Element {
  return (
    <footer className={cn("bg-gray-50 border-t", className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} AI Form Factory. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy-policy"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Terms of Service
            </a>
            <a
              href="/contact"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
