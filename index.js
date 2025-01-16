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

app.get('/', (req, res) => {
    axios.get(url).then((response) => {
        if(response.status === 200) {
            // obtener enlaces desde la página principal
            const html = response.data; //! console.log(html);
            const $ = cheerio.load(html);

            // recoger solo los que están dentro del ID: #mw-pages
            // crear los links completos con la extensión de cada rapero
            const links = [];
            $('#mw-pages a').each((index, element) => {
                const link = $(element).attr('href');
                links.push(link);
            }) //! console.log(links);

            
            //! Faltaría entrar en las páginas individuales.
            
            // obtener título de la página
            const pageTitle = $('title').text(); //! console.log(pageTitle);


            // obtener imágenes
            const imgs = [];
            $('img').each((index, element) => {
                const img = $(element).attr('src');
                imgs.push(img);
            })


            // obtener párrafo
            const parrafos = [];
            $('p').each((index, element) => {
                const parrafo = $(element).attr('p');
                parrafos.push(parrafo);
            })

            // poryectar la respuesta en html
            res.send(`
                <h1>${pageTitle}</h1>
                <h2>Enlaces</h2>
                <ul>
                    ${links.map(link => `<li><a href= "${url}${link}">${link}</li>`).join('')};
                </ul>
                <h2>Imágenes</h2>
                <ul>
                    ${imgs.map(img => `<li><a href= "${url}${img}">${img}</li>`).join('')};
                </ul>
                <ul>
                    ${parrafos.map(parrafo => `<li><a href= "${url}${parrafo}">${parrafo}</li>`).join('')};
                </ul>
            `);

        } else {
            res.status(response.status).send('Error al acceder a Wikipedia');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Express está escuchando en el puerto http://localhost:${PORT}`);
});