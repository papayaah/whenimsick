export const CAPY_STATE_EVENT = 'capy:state';

export type CapyState = {
  isAnalyzing?: boolean;
  hasResults?: boolean;
  hasSelectedSymptoms?: boolean;
  symptomCount?: number;
};

export function emitCapyState(state: CapyState) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CAPY_STATE_EVENT, { detail: state }));
}


