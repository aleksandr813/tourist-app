import './App.css';
import StartPage from './pages/StartPage/StartPage';
import PageManager from './pages/PageManager';
import Server from './services/Server/Server';
import React from 'react';
import Store from './services/Store';

export const ServerContext = React.createContext(null);

function App() {

  const store = new Store("PIZDEC MNOGA ZALUP");
  const server = new Server(store);

  return (
    <ServerContext.Provider value={server}>
      <div className='app'>
         <PageManager/>
      </div>
    </ServerContext.Provider>
  );
}

export default App;
