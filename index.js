/*
Ejercicio de Scraping con Cheerio, Axios y Express.
---------------------------------------------------
El objetivo de este ejercicio es crear una aplicación Node.js con Express 
que realice scraping de datos de la Wikipedia.
*/
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';

app.get('/', async (req, res) => {
    try {
        // primera solicitud a la url que nos da el enunciado
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // obtener los links con id #mw-pages
        const links = [];
        $('#mw-pages a').each((index, element) => {
            const link = $(element).attr('href');
            links.push(link);
        });

        // obtener los datos de estos links
        const data = [];
        for (const link of links) {
            const linkDetail = await scrapLink(link);
            data.push(linkDetail);
        }

        res.json(data);

    } catch (error) {
        console.error('Error al obtener la página:', error);
        res.status(500).send('Error del servidor.')
    }

});

async function scrapLink(link) {
    try {
        // solicitud para cada uno de los enlaces
        const response = await axios.get(`https://es.wikipedia.org${link}`);
        const html = response.data;
        const $ = cheerio.load(html);

        // obtener h1, título
        const h1 = $('h1').text();

        // obtener imágenes
        const images = [];
        $('img').each((index, element) => {
            const src = $(element).attr('src');
            images.push(src);
        });

        // obtener párrafos
        const paragraphs = [];
        $('p').each((index, element) => {
            const paragraphText = $(element).text();
            const imgSrc = $(element).find('img').attr('src');
            paragraphs.push({ text: paragraphText, img: imgSrc });
        });

        return { h1, images, paragraphs };

    } catch (error) {
        console.log('Error al obtener datos');
        return null;
    }
};


app.listen(PORT, () => {
    console.log(`Express está escuchando en el puerto http://localhost:${PORT}`);
});