import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automatically notify Streamlit parent container of dynamic frame height
const sendHeightToStreamlit = () => {
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      900
    );
    window.parent.postMessage(
      {
        type: 'streamlit:setFrameHeight',
        height: height + 40,
      },
      '*'
    );
  }
};

window.addEventListener('load', sendHeightToStreamlit);
window.addEventListener('resize', sendHeightToStreamlit);

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(<App />);

// Observe DOM height changes to dynamically resize Streamlit container
if (typeof ResizeObserver !== 'undefined') {
  const observer = new ResizeObserver(() => sendHeightToStreamlit());
  observer.observe(document.body);
}

