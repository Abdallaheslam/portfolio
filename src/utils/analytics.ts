export interface AnalyticsEventProps {
  section?: string;
  action?: string;
  label?: string;
}

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string> },
    ) => void;
    doNotTrack?: string;
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

let initialized = false;

/**
 * Checks standard browser privacy opt-out signals (DNT / Global Privacy Control).
 */
export function isTrackingOptedOut(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true;
  }
  const dnt =
    navigator.doNotTrack === '1' ||
    window.doNotTrack === '1' ||
    (navigator as Navigator & { msDoNotTrack?: string }).msDoNotTrack === '1';
  const gpc = navigator.globalPrivacyControl === true;
  return dnt || gpc;
}

/**
 * Initializes cookieless, privacy-focused analytics (Plausible if VITE_PLAUSIBLE_DOMAIN is set).
 * Stores no cookies, no localStorage identifiers, and no PII.
 */
export function initPrivacyAnalytics(): void {
  if (initialized || typeof document === 'undefined' || isTrackingOptedOut()) {
    return;
  }
  initialized = true;

  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim();
  if (plausibleDomain && !document.querySelector('script[data-portfolio-analytics="plausible"]')) {
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', plausibleDomain);
    script.setAttribute('data-portfolio-analytics', 'plausible');
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }
}

function sendToEndpoint(payload: Record<string, unknown>): void {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
  if (!endpoint || typeof window === 'undefined') return;

  try {
    const body = JSON.stringify(payload);
    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      void fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
        credentials: 'omit',
      });
    }
  } catch {
    // Fail silently so analytics never affects user experience
  }
}

export function trackPageView(): void {
  if (typeof window === 'undefined' || isTrackingOptedOut()) return;
  initPrivacyAnalytics();

  const path = window.location.pathname || '/';
  sendToEndpoint({
    type: 'pageview',
    path,
    lang: document.documentElement.lang || 'en',
  });
}

export function trackEvent(eventName: string, props: AnalyticsEventProps = {}): void {
  if (typeof window === 'undefined' || isTrackingOptedOut()) return;

  const sanitizedProps: Record<string, string> = {};
  if (props.section) sanitizedProps.section = props.section;
  if (props.action) sanitizedProps.action = props.action;
  if (props.label) sanitizedProps.label = props.label;

  if (typeof window.plausible === 'function') {
    window.plausible(eventName, { props: sanitizedProps });
  }

  sendToEndpoint({
    type: 'event',
    name: eventName,
    path: window.location.pathname || '/',
    props: sanitizedProps,
  });
}
