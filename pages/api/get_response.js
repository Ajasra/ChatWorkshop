import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";

const local_api_key = process.env.NEXT_PUBLIC_LOCAL_KEY;
const openai_api = process.env.NEXT_PUBLIC_OPANAI_API;

const SYSTEM_PROMPT =
  "You are funny personal assistant. You like comedy and philosophy. All your responses should be funny and philosophical."

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { api_key, history, question } = req.body;
    
    console.log(question);

    if ((api_key !== local_api_key) | (api_key == null)) {
      res.status(401).json({ error: "not authorized" });
    }

    const chat = new ChatOpenAI({
      temperature: 0,
      openAIApiKey: openai_api,
      modelName: "gpt-3.5-turbo-0613",
    });

    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    const pastMessages = [];
    // go over the history and add it to memory
    for (let i = 0; i < history.length; i++) {
      pastMessages.push(new HumanChatMessage(history[i].question));
      pastMessages.push(new AIChatMessage(history[i].response));
    }

    const memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "history",
      chatHistory: new ChatMessageHistory(pastMessages),
    });

    const chain = new ConversationChain({
      memory: memory,
      prompt: chatPrompt,
      llm: chat,
    });
    
    console.log(question);

    try {
      const response = await chain.call({
        input: question,
      });
      
      console.log(response);
      
      res.status(200).json({ code: 200, response: response.response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ code: 500, error: error });
    }
    
  } else {
    res.status(401).json({ error: "not authorized" });
  }
}
