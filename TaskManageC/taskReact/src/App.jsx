import React from 'react'
import Home from './Home';
import Register from './Register';
import Login from './Login';

import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Login' element={<Login />} />
      </Routes>

    </div>
  )
}

export default App