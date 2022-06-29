import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import TestPage from './pages/TestPage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Homepage/>}/>
				<Route path='/test/anotherpage' element={<TestPage/>}/>
				<Route path="*" element={<PageNotFound />}/>
			</Routes>
		</BrowserRouter>
  	);
}

export default App;
