export const DEMO_STATE_EVENT = 'demo:mode';

export type DemoState = {
  isActive: boolean;
};

export function emitDemoState(state: DemoState) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(DEMO_STATE_EVENT, { detail: state }));
}




