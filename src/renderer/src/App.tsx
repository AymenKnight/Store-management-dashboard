import { useState } from 'react';
import './App.scss';
import MainLayer from '@containers/layers/main_layer';

console.log(' window.prisma', window.prisma);

const user = await window.prisma.getUsers();
console.log('user', user);

function App() {
  return (
    <div className="app-container">
      <MainLayer />
    </div>
  );
}

export default App;
