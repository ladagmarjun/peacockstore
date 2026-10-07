import { useLocation } from 'react-router-dom';

const MESSENGER_URL = 'https://m.me/100074706814824';

export default function MessengerButton() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;

  return (
    <a
      href={MESSENGER_URL}
      className="messenger-fab"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on Messenger"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.42 3.13 7.16.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.98-.88c.17-.07.35-.09.53-.04.91.25 1.87.38 2.92.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2Zm6 7.46-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.19-.69-.64l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.64Z"/>
      </svg>
      <span>Chat with us</span>
    </a>
  );
}
