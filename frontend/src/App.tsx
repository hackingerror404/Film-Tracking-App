import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'

import Header from './components/site/header';
import Login from "./components/auth/login";

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  return (
    <div className="App">
      <Header />
      {!authenticated ? <Login /> :
        <Routes>
          <Route path="/"></Route>
        </Routes>
      }
    </div>
  )
}

export default App
