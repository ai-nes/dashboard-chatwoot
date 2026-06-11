"use client";

import { useEffect, useState } from "react";
import { MOCK_CHATWOOT_CONTEXT } from "./mock-data";
import type { ChatwootAppContext } from "./types";

function isJSONValid(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function useChatwootContext() {
  const [context, setContext] = useState<ChatwootAppContext>(MOCK_CHATWOOT_CONTEXT);
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (typeof event.data !== "string" || !isJSONValid(event.data)) return;

      const parsed = JSON.parse(event.data) as {
        event?: string;
        data?: ChatwootAppContext;
      };

      if (parsed.event === "appContext" && parsed.data?.conversation && parsed.data?.contact) {
        setContext(parsed.data);
        setIsEmbedded(true);
      }
    };

    window.addEventListener("message", handler);

    if (window.parent !== window) {
      window.parent.postMessage("chatwoot-dashboard-app:fetch-info", "*");
    }

    return () => window.removeEventListener("message", handler);
  }, []);

  return { context, isEmbedded };
}
