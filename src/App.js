import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import NotFoundPage from './components/NotFoundPage';

const App = () => {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<NewsFeed />}>
					<Route path=":section" element={<NewsFeed />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
