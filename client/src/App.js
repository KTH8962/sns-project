import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Join from './pages/Join';

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/join' element={<Join />} />
      </Routes>
    </Router>
  );
}

export default App;
