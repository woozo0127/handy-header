import '@fontsource/figtree/400.css';
import '@fontsource/figtree/500.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';
import './app.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { applySavedTheme } from './hooks/useTheme';

applySavedTheme();

const root = document.getElementById('root');
if (!root) throw new Error('#root element not found');
createRoot(root).render(<App />);
