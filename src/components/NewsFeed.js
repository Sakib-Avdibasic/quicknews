import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import useWindowDimensions from '../customHooks/WindowDimensions';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import './NewsFeed.css';

library.add(faExternalLinkAlt);

const NewsFeed = () => {
	const [articles, setArticles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingError, setLoadingError] = useState(false);
	const { width } = useWindowDimensions();
	const { section } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const q = searchParams.get('q');

	useEffect(() => {
		setIsLoading(true);

		let requestUrl =
			'https://api.nytimes.com/svc/search/v2/articlesearch.json?';
		let docTitle;
		if (q) {
			requestUrl += `&q=${q}`;
			docTitle = `${q} · QuickNews`;
		} else if (section) {
			const currentDate = new Date();
			const weekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7))
				.toJSON()
				.slice(0, 10);
			requestUrl += `&fq=section_name:(${section})&begin_date=${weekAgo}`;
			docTitle = `${section[0].toUpperCase() + section.slice(1)} · QuickNews`;
		}

		document.title = docTitle || 'QuickNews';

		requestUrl += '&api-key=sSPkztmo88VRP5oGQ8EhnsyYAxsH3MEE';
		const controller = new AbortController();
		axios
			.get(requestUrl, { signal: controller.signal })
			.then(response => {
				const data = response.data.response.docs.map(article => {
					const articleContent = {
						id: article._id,
						url: article.web_url || 'https://www.nytimes.com',
						headline: article.headline.main,
						author:
							article.byline.person.length != 0
								? article.byline.person[0].firstname +
								  ' ' +
								  article.byline.person[0].lastname
								: article.byline.organization,
						image: article.multimedia[1]?.url
							? `https://www.nytimes.com/${article.multimedia[1].url}`
							: 'https://images.assetsdelivery.com/compings_v2/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016.jpg',
					};
					return articleContent;
				});

				setIsLoading(false);
				setLoadingError(false);
				setArticles(data);
			})
			.catch(err => {
				if (axios.isCancel(err)) {
					console.log('successfully aborted');
				} else {
					setLoadingError(true);
				}
			});

		return () => {
			controller.abort();
		};
	}, [section, q]);

	return (
		<main>
			{loadingError ? (
				<h2>Couldn't load articles</h2>
			) : isLoading ? (
				<h2>Loading...</h2>
			) : (
				articles.map(article => {
					return (
						<article key={article.id}>
							<div className="img-container">
								<img src={article.image} alt="Article image" />
							</div>
							<div className="article-content">
								<span>{article.author}</span>
								<h2>{article.headline}</h2>
								<a href={article.url} target="_blank">
									{width > 500 ? (
										'Read more at nytimes.com'
									) : (
										<FontAwesomeIcon icon="external-link-alt" />
									)}
								</a>
							</div>
						</article>
					);
				}) || <h2>No articles found</h2>
			)}
		</main>
	);
};

export default NewsFeed;
