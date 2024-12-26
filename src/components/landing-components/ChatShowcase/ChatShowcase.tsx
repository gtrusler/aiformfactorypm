"use client";

import React, { useReducer, useCallback, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatInterface } from "@/components/app-components/Chat/ChatInterface";
import type { Message, ToolType } from "@/types/chat";
import {
  DEMO_SCENARIOS,
  INITIAL_PROMPT,
  FALLBACK_RESPONSE,
} from "./demo-scenarios";
import {
  type ScenarioState,
  type ToolCall,
  initialState,
  scenarioReducer,
  getCurrentStep,
  getScenarioProgress,
} from "./scenario-state";
import { TEST_CASES, runTests, formatTestResults } from "./test-utils";

interface ChatShowcaseProps {
  className?: string;
  enableTesting?: boolean;
}

export function ChatShowcase({
  className,
  enableTesting = false,
}: ChatShowcaseProps): React.JSX.Element {
  const [state, dispatch] = useReducer(scenarioReducer, initialState);
  const [messages, setMessages] = useState<Message[]>([INITIAL_PROMPT]);
  const [testResults, setTestResults] = useState<string>("");

  const handleMessageSent = useCallback(
    async (message: Message): Promise<void> => {
      setMessages((prev) => [...prev, message]);

      // Check for scenario trigger
      const currentStep = getCurrentStep(state);
      let response: Message;

      if (
        currentStep &&
        message.content
          .toLowerCase()
          .includes(currentStep.trigger.toLowerCase())
      ) {
        // Continue current scenario
        dispatch({ type: "NEXT_STEP" });
        response = {
          role: "assistant",
          content: currentStep.response.content,
          metadata: {
            toolCalls: currentStep.response.tools?.map((tool) => ({
              tool: tool.type,
              status: "pending",
              result: tool.input,
            })),
            suggestions: currentStep.response.suggestedPrompts,
          },
        };
      } else {
        // Look for new scenario
        const scenarioMatch = DEMO_SCENARIOS.find((scenario) =>
          message.content
            .toLowerCase()
            .includes(scenario.sequence[0].trigger.toLowerCase())
        );

        if (scenarioMatch) {
          dispatch({ type: "START_SCENARIO", payload: scenarioMatch.name });
          const firstStep = scenarioMatch.sequence[0];
          response = {
            role: "assistant",
            content: firstStep.response.content,
            metadata: {
              toolCalls: firstStep.response.tools?.map((tool) => ({
                tool: tool.type,
                status: "pending",
                result: tool.input,
              })),
              suggestions: firstStep.response.suggestedPrompts,
            },
          };
        } else {
          // No matching scenario
          response = FALLBACK_RESPONSE;
          dispatch({ type: "RESET" });
        }
      }

      setMessages((prev) => [...prev, response]);
    },
    [state]
  );

  const handleToolExecution = useCallback(
    async (tool: ToolType, input: unknown): Promise<unknown> => {
      const currentStep = getCurrentStep(state);
      if (!currentStep) return null;

      const toolCall: ToolCall = {
        tool,
        input,
        status: "pending",
      };
      dispatch({ type: "EXECUTE_TOOL", payload: toolCall });

      // Simulate tool execution
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const toolDemo = currentStep.response.tools?.find((t) => t.type === tool);
      if (toolDemo) {
        dispatch({ type: "COMPLETE_STEP" });
        return toolDemo.output;
      }

      return {
        [tool]: {
          status: "complete",
          result: `Demo ${tool} execution`,
        },
      };
    },
    [state]
  );

  // Run tests if enabled
  useEffect(() => {
    if (enableTesting) {
      void runTests(handleMessageSent).then((results) => {
        setTestResults(formatTestResults(results));
      });
    }
  }, [enableTesting, handleMessageSent]);

  const progress = getScenarioProgress(state);

  return (
    <section className={cn("py-24 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Experience AI-Powered Form Creation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Try our intelligent chat interface to see how easily you can create
            and customize forms
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {enableTesting && testResults && (
            <div className="mb-8 p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Test Results</h3>
              <pre className="whitespace-pre-wrap text-sm">{testResults}</pre>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Chat Preview Header */}
            <div className="bg-gray-50 border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">
                    AI Assistant (Demo)
                  </span>
                </div>
                {state.current.status === "processing" && (
                  <div className="text-sm text-gray-500">Processing...</div>
                )}
              </div>
              {state.current.scenario && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-sm text-gray-600">
                    {state.current.scenario.name}:
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {progress.current}/{progress.total}
                  </div>
                </div>
              )}
            </div>

            {/* Chat Interface */}
            <div className="h-[600px] flex flex-col">
              <ChatInterface
                className="flex-1"
                initialMessages={messages}
                onMessageSent={handleMessageSent}
                onToolExecution={handleToolExecution}
              />
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="mt-8">
            <h3 className="text-center text-lg font-semibold mb-4">
              Try These Scenarios:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_SCENARIOS.map((scenario, index) => (
                <button
                  key={index}
                  className={cn(
                    "p-4 rounded-lg text-left transition-colors",
                    "border hover:border-blue-500",
                    state.ui.selectedScenario === scenario.name
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-200"
                  )}
                  onClick={() =>
                    handleMessageSent({
                      role: "user",
                      content: scenario.sequence[0].trigger,
                    })
                  }
                >
                  <h4 className="font-semibold mb-1">{scenario.name}</h4>
                  <p className="text-sm text-gray-600">
                    {scenario.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Feature Callouts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <h3 className="font-semibold mb-2">Real-time Assistance</h3>
              <p className="text-sm text-gray-600">
                Get instant help and suggestions as you build
              </p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Smart Validation</h3>
              <p className="text-sm text-gray-600">
                Automatically generate validation rules
              </p>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">Code Generation</h3>
              <p className="text-sm text-gray-600">
                Export production-ready form code
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
