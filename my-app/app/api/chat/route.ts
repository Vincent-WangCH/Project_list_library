import { RepositoryIndex } from "@/scripts/index-repo";
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { readFile } from "fs/promises";
import { join } from "path";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Load the repository index if it exists
  const index = await loadIndex();
  const relevantDocuments = filterRelevantDocuments(index, messages);

  // Convert UI messages to model messages
  const modelMessages = convertToModelMessages(messages);

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: `You are a helpful AI assistant that can answer questions about a repository.
      ${relevantDocuments}
      When answering questions, use the repository index to provide accurate, specific information about the codebase.
      If the index is not available, politely inform the user and suggest they create one.`,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}

/**
 * Loads the repository index from index.json
 * Returns null if the index doesn't exist or can't be read
 */
export const loadIndex = async (): Promise<RepositoryIndex | null> => {
  try {
    const indexPath = join(process.cwd(), "index.json");
    const indexData = await readFile(indexPath, "utf-8");
    return JSON.parse(indexData);
  } catch (error) {
    // Index doesn't exist yet or couldn't be read
    return null;
  }
};

export const filterRelevantDocuments = (index: RepositoryIndex | null, messages: any[]): string => {
  if (!index) {
    return "No repository index available. Ask the user to run 'npm run index' to create one.";
  }

  return index;
};