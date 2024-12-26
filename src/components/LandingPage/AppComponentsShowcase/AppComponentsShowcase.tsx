import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AppComponentsShowcaseProps {
  className?: string;
}

export default function AppComponentsShowcase({
  className,
}: AppComponentsShowcaseProps): React.JSX.Element {
  return (
    <section className={cn("py-24 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Powerful Components for Form Creation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build sophisticated forms with our intuitive drag-and-drop interface
            and AI-powered components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Form Builder Component */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-48 bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
              <Image
                src="/images/form-builder.png"
                alt="Form Builder Interface"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Form Builder</h3>
            <p className="text-gray-600">
              Drag and drop form elements with real-time preview and AI
              suggestions
            </p>
          </div>

          {/* AI Assistant Component */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-48 bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
              <Image
                src="/images/ai-assistant.png"
                alt="AI Assistant Interface"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-600">
              Get intelligent suggestions and automated form improvements
            </p>
          </div>

          {/* Analytics Dashboard Component */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-48 bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
              <Image
                src="/images/analytics.png"
                alt="Analytics Dashboard"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">
              Track form performance and user engagement with detailed analytics
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
