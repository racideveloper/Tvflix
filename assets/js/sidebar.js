'use strict';

import { api_key, fetchDataFromServer } from './api.js';

export function sidebar() {

	/**
	 * buscar todos los géneros
	 */
	const genreList = {};

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
		'TV Movie': 'Película para TV',
		'Thriller': 'Thriller',
		'War': 'Guerra',
		'Western': 'Western'
	};

	fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
		for (const { id, name } of genres) {
			const translatedName = translationMap[name] || name;
			genreList[id] = translatedName;
		}

		genreLink();
	});

	const sidebarInner = document.createElement('div');
	sidebarInner.classList.add('sidebar-inner');

	sidebarInner.innerHTML = `
	<div class="sidebar-list">

		<p class="title">Género</p>

	</div>

	<div class="sidebar-list">

		<p class="title">Idiomas</p>

		<a href="movie-list.html" menu-close 
		class="sidebar-link" onclick='getMovieList("with_original_language=es", "Spanish")'>Latino</a>

		<a href="movie-list.html" menu-close 
		class="sidebar-link" onclick='getMovieList("with_original_language=en", "English")'>Castellano</a>

		<a href="movie-list.html" menu-close class="sidebar-link">Subtitulado</a>

	</div>

	<div class="sidebar-footer">
		<p class="copyright">
					Copyright 2024 <a href="https://github.com/Razy-Cha">Tvflix</a>
		</p>

		<img src="assets/images/tmdb-logo.svg" alt="the movie database logo">
	</div>
	`;

	const genreLink = function () {

		for (const [genreId, genreName] of Object.entries(genreList)) {
			const link = document.createElement('a');
			link.classList.add('sidebar-link');
			link.setAttribute('href', 'movie-list.html');
			link.setAttribute('menu-close', '');
			link.setAttribute('onclick', `getMovieList('with_genres=${genreId}', '${genreName}')`);
			link.textContent = genreName;

			sidebarInner.querySelectorAll('.sidebar-list')[0].appendChild(link);
		}

		const sidebar = document.querySelector('[sidebar]');
		sidebar.appendChild(sidebarInner);
		toggleSidebar(sidebar);

	}

	const toggleSidebar = function(sidebar) {
		/**
		 * alternar barra lateral en la pantalla del móvil
		 */
		const sidebarBtn = document.querySelector('[menu-btn]');
		const sidebarTogglers = document.querySelectorAll('[menu-toggler]');
		const sidebarClose = document.querySelectorAll('[menu-close]');
		const overlay = document.querySelector('[overlay');

		addEventOnElements(sidebarTogglers, 'click', function () {
			sidebar.classList.toggle('active');
			sidebarBtn.classList.toggle('active');
			overlay.classList.toggle('active');
		});

		addEventOnElements(sidebarClose, 'click', function () {
			sidebar.classList.remove('active');
			sidebarBtn.classList.remove('active');
			overlay.classList.remove('active');
		});
	}
}