"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./distribution-charts.module.css";

export function CopyCitations({ label, text, count, provisional }: { label: string; text: string; count: number; provisional: number }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const note = provisional ? ` (${provisional} provisional; not in thesis bibliography)` : "";
  const feedback = state === "copied" ? `Copied ${count} citation keys${note}` : state === "error" ? "Copy failed. Select and copy the keys below." : "";
  return (
    <span className={styles.copy}>
      <button type="button" className={styles.copyButton} aria-label={`Copy citation keys for ${label}`} title={feedback || `Copy ${count} citation keys${note}`} disabled={!count}
        onKeyDown={(event) => event.stopPropagation()}
        onClick={async (event) => {
          event.preventDefault();
          event.stopPropagation();
          try { await navigator.clipboard.writeText(text); setState("copied"); }
          catch { setState("error"); }
        }}>
        {state === "copied" ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      </button>
      <span role="status" className="sr-only">{feedback}</span>
      {state === "error" && <span className={styles.copyFallback} onClick={(event) => event.stopPropagation()}>
        <span>{feedback}</span>
        <textarea aria-label={`Citation keys for ${label}`} readOnly value={text} onFocus={(event) => event.currentTarget.select()} />
      </span>}
    </span>
  );
}
