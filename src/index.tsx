import {createRoot} from 'react-dom/client';
import { App } from './app';

import './styles.css'

const domNode = document.getElementById('root')

if(!domNode) throw new Error('Root element is not found')

const root = createRoot(domNode);
root.render(<App />);