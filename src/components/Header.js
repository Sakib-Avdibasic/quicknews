import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useWindowDimensions from '../customHooks/WindowDimensions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import './Header.css';

library.add(faSearch);

const sections = ['health', 'food', 'science', 'sports', 'technology'];

const Header = () => {
	const [navToggled, setNavToggled] = useState(false);
	const { width } = useWindowDimensions();
	const [searchQuery, setSearchQuery] = useState('');
	const navigate = useNavigate();
	const performSearch = () => navigate(`/search?q=${searchQuery}`);

	return (
		<header>
			<h1>
				<Link to="/">QuickNews</Link>
			</h1>
			<button id="toggle-nav-btn" onClick={() => setNavToggled(!navToggled)}>
				<span
					className={`hamburger-bar ${navToggled ? 'transformed-top-bun' : ''}`}
				/>
				<span
					className={`hamburger-bar ${navToggled ? 'transformed-meat' : ''}`}
				/>
				<span
					className={`hamburger-bar ${
						navToggled ? 'transformed-bottom-bun' : ''
					}`}
				/>
			</button>
			{(navToggled || width > 630) && (
				<nav>
					<ul id="nav-list">
						{sections.map((section, index) => {
							return (
								<li key={index}>
									<NavLink
										to={`/${section}`}
										className={`nav-link ${navData =>
											navData.isActive && 'active'}`}
									>
										{section}
									</NavLink>
								</li>
							);
						})}
					</ul>
				</nav>
			)}
			<div id="search-area">
				<input
					type="search"
					name="search-bar"
					id="search-bar"
					placeholder="Search..."
					onChange={e =>
						setSearchQuery(e.target.value.trim().replace(/\s+/g, '+'))
					}
					onKeyDown={e => {
						if (e.key === 'Enter') performSearch();
					}}
				/>
				<button title="Search" onClick={performSearch}>
					<FontAwesomeIcon icon="search" />
				</button>
			</div>
		</header>
	);
};

export default Header;
