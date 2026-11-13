// Small helpers that remember the guided demo's progress for this browser tab only.
const DONE_KEY = "purse_demo_done";
const STEP_KEY = "purse_demo_step";
const TESTER_KEY = "purse_demo_tester";

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // Storage can be blocked; the demo still works without remembering progress.
  }
}

export function readDone(length: number): boolean[] {
  try {
    const parsed = JSON.parse(read(DONE_KEY) ?? "[]");
    return Array.from({ length }, (_, i) => parsed[i] === true);
  } catch {
    return Array.from({ length }, () => false);
  }
}

export function writeDone(done: boolean[]) {
  write(DONE_KEY, JSON.stringify(done));
}

export function readStep(): number | null {
  const value = Number(read(STEP_KEY));
  return Number.isInteger(value) && value > 0 ? value : null;
}

export function writeStep(step: number | null) {
  write(STEP_KEY, step === null ? null : String(step));
}

export function readTester(): string | null {
  return read(TESTER_KEY);
}

export function writeTester(tester: string | null) {
  write(TESTER_KEY, tester);
}
