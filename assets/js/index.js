'use strict';

/**
 * importar todos los componentes y funciones
 */
import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from './movie-card.js';
import { search } from "./search.js";

const pageContent = document.querySelector('[page-content]');

sidebar();


/**
 * secciones de la página de inicio 
 * (películas más valoradas, próximas y de tendencia)
 */
const homePageSections = [
	{
		title: 'Más Populares',
		path: '/trending/movie/week'
	},
	{
		title: 'Nuevos',
		path: '/movie/upcoming'
	},
	{
		title: 'Destacados',
		path: '/movie/top_rated'
	}
]


/**
 * buscar todos los géneros
 */
const genreList = {
	//crear una cadena de género
	asString(genreIdList) {
		let newGenreList = [];

		for (const genreId of genreIdList) {
			this[genreId] && newGenreList.push(this[genreId]);
		}

		return newGenreList.join(', ');
	}
};

// Objeto que mapea los nombres de géneros en inglés a español
const translationMap = {
	'Action': 'Acción',
	'Adventure': 'Aventura',
	'Animation': 'Animación',
	'Comedy': 'Comedia',
	'Crime': 'Crimen',
	'Documentary': 'Documental',
	'Drama': 'Drama',
	'Family': 'Familia',
	'Fantasy': 'Fantasía',
	'History': 'Historia',
	'Horror': 'Terror',
	'Music': 'Música',
	'Mystery': 'Misterio',
	'Romance': 'Romance',
	'Science Fiction': 'Ciencia Ficción',
	'TV Movie': 'TV',
	'Thriller': 'Thriller',
	'War': 'Guerra',
	'Western': 'Western'
};

fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
	for (const { id, name } of genres) {
		const translatedName = translationMap[name] || name;
		genreList[id] = translatedName;
	}

	fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, heroBanner);
});


const heroBanner = function ({ results: movieList }) {

	const banner = document.createElement('section');
  banner.classList.add('banner');
  banner.ariaLabel = 'Popular Movies';

  banner.innerHTML = `
  <div class="banner-slider"></div>

  <div class="slider-control">
	<div class="control-inner"></div>
  </div>`;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {

		const {
			backdrop_path,
			title,
			release_date,
			genre_ids,
			overview,
			poster_path,
			vote_average,
			id
		} = movie

		const sliderItem = document.createElement('div');
		sliderItem.classList.add('slider-item');
		sliderItem.setAttribute('slider-item', '');

		sliderItem.innerHTML = `
		  <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" 
				class="img-cover" loading=${index === 0 ? 'eager' : "lazy "}>

					<div class="banner-content">

						<h2 class="heading">${title}</h2>

						<div class="meta-list">
							<div class="meta-item">${release_date.split('-')[0]}</div>

							<div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
						</div>

						<p class="genre">${genreList.asString(genre_ids)}</p>

						<p class="banner-text">${overview}</p>

						<a href="detail.html" class="btn" onclick="getMovieDetail(${id})">
							<img src="assets/images/play_circle.png" width="24" height="24" aria-hidden="true" 
							alt="play circle">

							<span class="span">Ver ahora</span>
						</a>
		  </div>`;

		banner.querySelector('.banner-slider').appendChild(sliderItem);

		const controlItem = document.createElement('button');
		controlItem.classList.add('poster-box', 'slider-item');
		controlItem.setAttribute('slider-control', `${controlItemIndex}`);

		controlItemIndex++;

		controlItem.innerHTML = `
		<img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy"
		draggable="false" class="img-cover">`;

		banner.querySelector('.control-inner').appendChild(controlItem);
  }

	pageContent.appendChild(banner);

	addHeroSlide();


	/**
	 * recuperar datos para las secciones de la página de inicio 
	 * (mejor valoradas, próximas, tendencias)
	 */
	for (const { title, path} of homePageSections) {
		fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`, createMovieList, title);
	}
}

/**
 * funcionalidad del control deslizante
 */
const addHeroSlide = function() {

	const sliderItems = document.querySelectorAll('[slider-item]');
	const sliderControls = document.querySelectorAll('[slider-control]');

	let lastSliderItem = sliderItems[0];
	let lastSliderControl = sliderControls[0];

	lastSliderItem.classList.add('active');
	lastSliderControl.classList.add('active');

	const sliderStart = function () {
		lastSliderItem.classList.remove('active');
		lastSliderControl.classList.remove('active');

		sliderItems[Number(this.getAttribute('slider-control'))].classList.add('active');
		this.classList.add('active');

		lastSliderItem = sliderItems[Number(this.getAttribute('slider-control'))];
		lastSliderControl = this;
	}

	addEventOnElements(sliderControls, 'click', sliderStart);
}


const createMovieList = function({ results: movieList }, title) {

	const movieListElem = document.createElement('section');
	movieListElem.classList.add('movie-list');
	movieListElem.ariaLabel = `${title}`;

	movieListElem.innerHTML = `
	<div class="title-wrapper">
	  <h3 class="large-text">${title}</h3>
  </div>

  <div class="slider-list">
	  <div class="slider-inner"></div>
  </div>
	`;

	for (const movie of movieList) {
		const movieCard = createMovieCard(movie); 

		movieListElem.querySelector('.slider-inner').appendChild(movieCard);
	}

	pageContent.appendChild(movieListElem);
}

search();