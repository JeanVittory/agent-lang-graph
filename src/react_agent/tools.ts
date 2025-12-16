import { tool } from "@langchain/core/tools";

const sayHello = tool(
  () => "Hello world",
  {
    name: "say_hello",
    description: "A tool that says hello to a given name.",
  }
)

export const TOOLS = [sayHello];
