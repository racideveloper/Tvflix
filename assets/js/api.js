'use strict'

const api_key = '2c1ff797215f6b60fd05b498695fb173';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

/**
 * recuperar datos de un servidor usando la URL y pasar
  el resultado en datos json a una función de devolución de llamada
  junto con un parámetro opcional si tiene parámetro opcional
 */

const fetchDataFromServer = function (url, callback, optionalParam) {
    fetch(url)
    .then(response => response.json())
    .then(data => callback(data, optionalParam));
}

export { 
    imageBaseURL, 
    api_key, 
    fetchDataFromServer 
};