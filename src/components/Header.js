import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useState, useEffect } from 'react';
import './Header.css';

library.add(faSearch, faBars);

const sections = ['health', 'food', 'science', 'sports', 'technology'];

const Header = () => {
	const [navToggled, setNavToggled] = useState(false);
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [searchQuery, setSearchQuery] = useState('');
	const navigate = useNavigate();
	const performSearch = () =>
		navigate(`${window.location.pathname}?q=${searchQuery}`);

	useEffect(() => {
		window.addEventListener('resize', () => setScreenWidth(window.innerWidth));
	}, []);

	return (
		<header>
			<h1>
				<Link to="/">QuickNews</Link>
			</h1>
			<button id="toggle-nav-btn" onClick={() => setNavToggled(!navToggled)}>
				<FontAwesomeIcon icon="bars" />
			</button>
			{(navToggled || screenWidth > 614) && (
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