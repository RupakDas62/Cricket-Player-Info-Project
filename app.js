
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;
const cricdata = require('cric-player-info');
const path = require('path');

require('dotenv').config();

const playerArr = require('cric-player-info/playerIndex');

app.set('view engine', 'ejs');

// console.log(playerArr);

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`);
  });

// Function to fetch image URLs from Google Custom Search API
async function fetchPlayerImages(playerName) {
    try {
        const API_KEY = process.env.API_KEY; 
        const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
        const response = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&searchType=image&q=${playerName}`);
        const imageUrl = response.data.items[0].link;
        return imageUrl;
    } catch (error) {
        console.error("Error fetching images:", error);
        throw new Error('Error fetching images from Google Custom Search API');
    }
}

// let playerName = "";
const playerSummaries = [];

app.get('/', async (req, res) => {
    try {
        const pageSize = 40; // Number of players per page
        const page = req.query.page || 1; // Get the page number from the query parameters, default to page 1 if not provided

        // console.log(typeof page);

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        

        // Fetch player summaries for the current page
        for (let i = startIndex; i < endIndex ; i++) {
            const playerSummary = await cricdata?.getPlayerSummaryByName(playerArr[i].playerName);
            playerSummaries.push(playerSummary);
        }
        // console.log(playerSummaries);
        // Render the page with player summaries for the current page and pagination information
        res.render('index', { playerSummaries: playerSummaries, currentPage: page > 15 ? 15 : page , totalPages: 15})
    } catch (error) {
        console.error("Error fetching player summaries:", error);
        res.status(500).send('An error occurred while fetching player information.');
    }
});




app.get('/players/:playerName', async (req, res) => {
    try {
        let playerName = req.params.playerName; // Replace '+' with space
        // console.log(playerName);
        // console.log(cricdata);
        const playerSummary = await cricdata?.getPlayerSummaryByName(playerName);
        console.log("Player Summary:", playerSummary);
        
        // Fetch player images from Google Custom Search API
        const playerImageUrls = await fetchPlayerImages(playerName);
        
        res.render('players', { playerSummary: playerSummary, playerImageUrls: playerImageUrls });  
    } catch (error) {
        console.error("Error fetching player summary:", error);
        res.status(500).send('An error occurred while fetching player information.');
    }
});

// Server-side code
app.get('/player-summaries', async (req, res) => {
    // Assuming playerSummaries is defined and populated somewhere in your server-side code
    res.json(playerSummaries);
  });
  

// const data = {
//     playerSummaries : playerSummaries
// };

