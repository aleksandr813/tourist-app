import './App.css';
import StartPage from './pages/StartPage/StartPage';
import PageManager from './pages/PageManager';
import Server from './services/Server/Server';
import React from 'react';
import Store from './services/Store/Store';

export const ServerContext = React.createContext(null);
export const StoreContext = React.createContext(null);

function App() {

  const store = new Store();
  const server = new Server(store);

  return (
  <StoreContext.Provider value={store}>
    <ServerContext.Provider value={server}>
      <div className='app'>
         <PageManager/>
      </div>
    </ServerContext.Provider>
  </StoreContext.Provider>
  );
}

export default App;
