import { BrowserRouter } from 'react-router-dom';
import AppShell from './features/app-shell/AppShell';

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
