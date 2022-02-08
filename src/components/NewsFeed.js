import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import './NewsFeed.css';

const NewsFeed = () => {
	const [articles, setArticles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingError, setLoadingError] = useState(false);
	const { section } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const q = searchParams.get('q');

	useEffect(() => {
		setIsLoading(true);

		const currentDate = new Date();
		const weekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7))
			.toJSON()
			.slice(0, 10);

		let requestUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?${
			section && `begin_date=${weekAgo}`
		}`;
		if (q) requestUrl += `&q=${q}`;
		if (section) requestUrl += `&fq=section_name:(${section})`;
		requestUrl += '&api-key=sSPkztmo88VRP5oGQ8EhnsyYAxsH3MEE';

		axios
			.get(requestUrl)
			.then(response => {
				const data = response.data.response.docs.map(article => {
					const articleContent = {
						id: article._id,
						url: article.web_url || 'https://www.nytimes.com',
						lead_paragraph: article.headline.main,
						author:
							(article.byline.person[0]?.firstname || 'Jane') +
							' ' +
							(article.byline.person[0]?.lastname || 'Doe'),
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
				console.log(err);
				setLoadingError(true);
			});
	}, [section, q]);

	return (
		<main>
			{loadingError ? (
				<h2>Could not load articles</h2>
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
								<h3>{article.author}</h3>
								<p>{article.lead_paragraph}</p>
								<a href={article.url} target="_blank">
									Read at nytimes.com
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
