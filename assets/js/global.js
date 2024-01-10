'use strict';

/**
 * agregar evento en múltiples elementos
 */
const addEventOnElements = function (elements, eventType, callback) {
	for (const elem of elements) elem.addEventListener(eventType, callback);
}

/**
 * alternar el cuadro de búsqueda en la pantalla pequeña del dispositivo móvil
 */
const searchBox = document.querySelector('[search-box]');
const searchTogglers = document.querySelectorAll('[search-toggler]');

addEventOnElements(searchTogglers, 'click', function() {
	searchBox.classList.toggle('active');
});


/**
 * almacenar movie Id en el almacenamiento local
 * cuando se realize clic en cualquier tarjeta de película
 */
const getMovieDetail = function (movieId) {
	window.localStorage.setItem('movieId', String(movieId));
}

const getMovieList = function (urlParam, genreName) {
	window.localStorage.setItem('urlParam', urlParam);
	window.localStorage.setItem('genreName', genreName);
}