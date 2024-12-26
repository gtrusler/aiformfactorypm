import type { Message, ToolType } from "@/types/chat";
import { DEMO_SCENARIOS } from "./demo-scenarios";

export interface ToolCall {
  tool: ToolType;
  input: unknown;
  status: "pending" | "complete" | "error";
  result?: unknown;
}

export interface ScenarioState {
  current: {
    scenario: (typeof DEMO_SCENARIOS)[number] | null;
    step: number;
    status: "idle" | "processing" | "complete" | "error";
  };
  history: {
    messages: Message[];
    toolCalls: ToolCall[];
  };
  ui: {
    showSuggestions: boolean;
    processingTool: boolean;
    selectedScenario: string | null;
  };
}

export type ScenarioAction =
  | { type: "START_SCENARIO"; payload: string }
  | { type: "NEXT_STEP" }
  | { type: "EXECUTE_TOOL"; payload: ToolCall }
  | { type: "COMPLETE_STEP" }
  | { type: "RESET" };

export const initialState: ScenarioState = {
  current: {
    scenario: null,
    step: 0,
    status: "idle",
  },
  history: {
    messages: [],
    toolCalls: [],
  },
  ui: {
    showSuggestions: true,
    processingTool: false,
    selectedScenario: null,
  },
};

export function scenarioReducer(
  state: ScenarioState,
  action: ScenarioAction
): ScenarioState {
  switch (action.type) {
    case "START_SCENARIO": {
      const scenario = DEMO_SCENARIOS.find((s) => s.name === action.payload);
      if (!scenario) return state;

      return {
        ...state,
        current: {
          scenario,
          step: 0,
          status: "processing",
        },
        ui: {
          ...state.ui,
          showSuggestions: false,
          selectedScenario: action.payload,
        },
      };
    }

    case "NEXT_STEP": {
      if (!state.current.scenario) return state;

      const nextStep = state.current.step + 1;
      const isComplete = nextStep >= state.current.scenario.sequence.length;

      return {
        ...state,
        current: {
          ...state.current,
          step: nextStep,
          status: isComplete ? "complete" : "processing",
        },
        ui: {
          ...state.ui,
          showSuggestions: isComplete,
        },
      };
    }

    case "EXECUTE_TOOL": {
      return {
        ...state,
        history: {
          ...state.history,
          toolCalls: [...state.history.toolCalls, action.payload],
        },
        ui: {
          ...state.ui,
          processingTool: true,
        },
      };
    }

    case "COMPLETE_STEP": {
      return {
        ...state,
        current: {
          ...state.current,
          status: "idle",
        },
        ui: {
          ...state.ui,
          processingTool: false,
        },
      };
    }

    case "RESET": {
      return {
        ...initialState,
        history: {
          messages: [],
          toolCalls: [],
        },
      };
    }

    default:
      return state;
  }
}

export function getCurrentStep(state: ScenarioState): {
  trigger: string;
  response: {
    content: string;
    suggestedPrompts?: string[];
    tools?: Array<{
      type: ToolType;
      input: unknown;
      output: unknown;
    }>;
  };
} | null {
  if (!state.current.scenario || state.current.status === "complete") {
    return null;
  }

  return state.current.scenario.sequence[state.current.step];
}

export function getScenarioProgress(state: ScenarioState): {
  current: number;
  total: number;
  percentage: number;
} {
  if (!state.current.scenario) {
    return { current: 0, total: 0, percentage: 0 };
  }

  const total = state.current.scenario.sequence.length;
  const current = state.current.step + 1;
  const percentage = Math.round((current / total) * 100);

  return { current, total, percentage };
}
