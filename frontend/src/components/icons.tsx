/** Small inline icons — avoids pulling in an icon dependency. */

export function CheckIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 13l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 4c0 8-5 12-11 12H5c0-8 5-12 11-12h4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M5 20c2-5 5-8 9-10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Points in the reading direction for RTL layouts. */
export function ForwardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
