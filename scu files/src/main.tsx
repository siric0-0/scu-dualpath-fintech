import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Official Streamlit Custom Component Handshake Protocol
const notifyStreamlit = () => {
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
    // 1. Handshake: Notify Streamlit that component is loaded & ready (clears component timeout)
    window.parent.postMessage(
      {
        isStreamlitMessage: true,
        type: 'streamlit:componentReady',
        apiVersion: 1,
      },
      '*'
    );

    // 2. Set dynamic frame height
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      950
    );
    window.parent.postMessage(
      {
        isStreamlitMessage: true,
        type: 'streamlit:setFrameHeight',
        height: height + 50,
      },
      '*'
    );
  }
};

// Immediate handshake on load and resize
notifyStreamlit();
window.addEventListener('load', notifyStreamlit);
window.addEventListener('resize', notifyStreamlit);

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(<App />);

// Observe DOM height changes to dynamically resize Streamlit container
if (typeof ResizeObserver !== 'undefined') {
  const observer = new ResizeObserver(() => notifyStreamlit());
  observer.observe(document.body);
}

// Periodic heartbeat for the first 3 seconds to ensure handshake receipt
let retries = 0;
const intervalId = setInterval(() => {
  notifyStreamlit();
  retries++;
  if (retries >= 6) clearInterval(intervalId);
}, 500);

