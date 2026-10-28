export type MotionMode = "full" | "gentle" | "paused";
export const motionStorageKey = "camila-motion";

export function resolveMotionMode(stored: string | null, reduced: boolean): MotionMode {
  if (stored === "full" || stored === "gentle" || stored === "paused") return stored;
  return reduced ? "gentle" : "full";
}
