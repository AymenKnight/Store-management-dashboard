import './App.scss';
import MainLayer from '@containers/layers/main_layer';

// console.log(' window.prisma', window.prisma);
// const newUser = await window.prisma.createUser({
//   username: 'test' + Math.floor(Math.random() * 10000),
//   password: 'test',
//   email: 'test',
//   firstName: 'test',
//   lastName: 'test',
//   role: 'ADMIN',
//   address: 'test',
//   phoneNumber: 'test',
// });

// const user = await window.prisma.getUsers();
// console.log('user', user);

function App() {
  return (
    <div className="app-container">
      <MainLayer />
    </div>
  );
}

export default App;
