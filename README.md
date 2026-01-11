# Multi-Node Scheduling Assistant

This repository holds a LangGraph.js project. The code’s goal is to interpret user intent, enforce scope guardrails, and dispatch the conversation through a state graph where each node responds in an appropriate tone (casual chat, consultation, scheduling, cancellation, or safety block).

## Purpose of the code

1. Classify every incoming message via `classifyIntentionNode`, which applies input/topic guardrails and a structured model to decide if the user wants to schedule, cancel, consult, chat, or if the intent is unknown/out of scope.
2. Route that intent through the graph defined in `src/app/graph.ts`, so each specialized node (`conversation`, `consult`, `scheduled`, `cancel`, `unknown`, `blocked`) executes its dedicated prompt or persona.
3. Preserve state (intent and message history) with the annotated schema (`AgentState`) and terminate the flow once the active node emits the final response.
4. Add safety via `topicGuardrail` and `inputGuardrail` plus friendly fallback nodes when the intent cannot be determined or the content is blocked.

## Core flow

- Execution starts in `classifyIntentionNode`, which sanitizes the last message and feeds it to a structured classifier.
- `routeByIntentNode` translates the classifier output into a graph edge, and the workflow transitions to the matching node.
- Each active node receives the chat history, uses a prompt tailored to its role (tone and restrictions), and returns a single reply that ends the flow.
- `unknownIntentNode` and `blockedNode` return predefined messages when the intent is ambiguous or explicitly disallowed.

## Key components

- `src/app/graph.ts`: Builds the state graph, defines conditional transitions, and wires in the SQLite checkpointer.
- `src/app/configuration.ts`: Declares configuration annotations (model + prompt) and maintains agent state.
- `src/app/prompts.ts`: Houses the system prompt, intent classification prompt, and conversational prompt with explicit instructions.
- `src/app/nodes/*.ts`: Implements each branch’s logic and voice (consultation, scheduling, cancellation, chat, etc.).
- `src/app/utils.ts`: Loads chat models across providers using `initChatModel`.
- `src/app/guardrails/` and `src/app/schemas/`: Apply content/topic constraints and response validation.

## Guardrails and prompts

- `SYSTEM_PROMPT_TEMPLATE` enforces node behavior, structured output, and the rule not to invent dates or facts.
- `CLASSIFIER_INTENT_PROMPT_AGENT_TEMPLATE` requires the intent planner to respond with one of `scheduled`, `consult`, `cancel`, `conversation`, or `unknown` as structured JSON.
- Guardrails (`topicGuardrail`, `inputGuardrail`) prevent processing when the message is out of domain or violates input rules.
- Response nodes emphasize different tones (empathy, calmness, neutral, friendly) to keep the experience natural.

## Setup and execution

1. Copy the environment example:

```bash
cp .env.example .env
```

2. Add required API keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `TAVILY_API_KEY`, etc.).
3. Adjust the default model via `src/app/configuration.ts` or through LangGraph Studio’s configuration pane.
4. Run the development workflow:

```bash
npx @langchain/langgraph-cli dev
```

5. Use the npm scripts for builds/tests:

```bash
npm run build
npm run test
npm run lint
```

## Customization

- Register new tools and external integrations in `src/app/tools.ts` and connect them to the graph if needed.
- Update prompts or guardrails for another domain by editing `src/app/prompts.ts` and the files under `src/app/guardrails/`.
- Change the invoked model by picking an option from the `OPEN_AI_MODEL` enum and letting `loadChatModel` resolve it.
- Add new graph nodes if your workflow needs more decision points or validation steps.

## Development tips

- Unit and integration tests live in `src/app/tests/`.
- `npm run dev` enables hot reload inside LangGraph Studio; editing prompts, nodes, or configuration automatically refreshes the graph.
- Stay aligned with the dependencies in `package.json` (LangChain, LangGraph, Zod schemas, etc.) to avoid compatibility issues.

## References

- LangGraph.js official docs: [https://langchain-ai.github.io/langgraphjs/](https://langchain-ai.github.io/langgraphjs/)
- Guardrail examples in `src/app/guardrails/`
