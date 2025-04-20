import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import LabelingTool from './pages/LabelingTool';
import LabeledViewer from './pages/LabeledViewer';
import Navbar from './Navbar'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LabelingTool />} />
        <Route path="/viewer" element={<LabeledViewer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
