import { useState, useCallback } from "react";

export function useFilterState<T>(initialState: T) {
  const [draft, setDraft] = useState<T>(initialState);
  const [applied, setApplied] = useState<T>(initialState);

  const apply = useCallback(() => {
    setApplied(draft);
  }, [draft]);

  const reset = useCallback(() => {
    setDraft(initialState);
    setApplied(initialState);
  }, [initialState]);

  const cancel = useCallback(() => {
    setDraft(applied);
  }, [applied]);

  return { draft, setDraft, applied, apply, reset, cancel };
}
