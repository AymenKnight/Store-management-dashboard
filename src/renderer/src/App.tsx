import { useState } from 'react';
import './App.scss';

console.log(' window.prisma', window.prisma);

const user = await window.prisma.getUsers();
console.log('user', user);

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="app-container">
      <div className="logo-box">
        <a
          href="https://github.com/electron-vite/electron-vite-react"
          target="_blank"
          rel="noreferrer"
        ></a>
      </div>
      <h1>Electron + Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Electron + Vite logo to learn more
      </p>
      <div className="flex-center">
        Place static files into the<code>/public</code> folder{' '}
      </div>
    </div>
  );
}

export default App;
