import { Inngest } from "inngest";
import { logger } from "@/utils/logger";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "vetan-lite",
  logger,
});
