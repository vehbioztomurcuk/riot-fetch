import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;
const API_KEY = 'RGAPI-a0b5ce5d-1a52-4f25-8e6c-8c01dd6d2510';

// Store data for various Valorant content types
let valorantData = {
    agents: {},
    weapons: {},
    maps: {},
    chromas: {},
    skins: {},
    gameModes: {},
    sprays: {},
    charms: {},
    playerCards: {},
    playerTitles: {},
};

// Function to load Valorant content data from Riot API
async function loadValorantData() {
    try {
        const response = await fetch(`https://eu.api.riotgames.com/val/content/v1/contents?api_key=${API_KEY}`);
        
        // Check if response is valid JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();  // Get raw text response
            console.error("Received non-JSON response:", text);
            return;  // Exit function to avoid errors
        }

        const data = await response.json();

        // Load each content type from the response, handle missing sections by setting them to an empty array
        valorantData.agents = transformData(data.characters || []);
        valorantData.weapons = transformData(data.equips || []);
        valorantData.maps = transformData(data.maps || []);
        valorantData.chromas = transformData(data.chromas || []);
        valorantData.skins = transformData(data.skins || []);
        valorantData.gameModes = transformData(data.gameModes || []);
        valorantData.sprays = transformData(data.sprays || []);
        valorantData.charms = transformData(data.charms || []);
        valorantData.playerCards = transformData(data.playerCards || []);
        valorantData.playerTitles = transformData(data.playerTitles || []);

        console.log("Valorant data loaded successfully.");
    } catch (error) {
        console.error("Error loading Valorant data:", error);
    }
}

// Helper function to transform data with fallback for missing localizedNames
function transformData(items) {
    return items.reduce((acc, item) => {
        acc[item.id] = {
            name: item.name,
            localizedNames: item.localizedNames || {},  // Fallback if localizedNames is missing
            assetName: item.assetName,
            assetPath: item.assetPath || "N/A"  // Optional handling for assetPath
        };
        return acc;
    }, {});
}

// Load Valorant data when the server starts
loadValorantData();

// Serve the HTML page with buttons for each content type
app.get('/', (req, res) => {
    res.send(`
        <h1>Valorant API Proxy Server</h1>
        <p>Use the buttons below to display various types of Valorant content.</p>
        
        <button id="fetchAgents">Show All Valorant Agents</button>
        <button id="fetchWeapons">Show All Valorant Weapons</button>
        <button id="fetchMaps">Show All Valorant Maps</button>
        <button id="fetchChromas">Show All Valorant Chromas</button>
        <button id="fetchSkins">Show All Valorant Skins</button>
        <button id="fetchGameModes">Show All Valorant Game Modes</button>
        <button id="fetchSprays">Show All Valorant Sprays</button>
        <button id="fetchCharms">Show All Valorant Charms</button>
        <button id="fetchPlayerCards">Show All Valorant Player Cards</button>
        <button id="fetchPlayerTitles">Show All Valorant Player Titles</button>

        <h2>Result:</h2>
        <pre id="result"></pre>

        <script>
            async function fetchData(endpoint) {
                try {
                    const response = await fetch(endpoint);
                    const data = await response.json();
                    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    document.getElementById('result').textContent = 'Error fetching data';
                    console.error('Error fetching data:', error);
                }
            }

            document.getElementById('fetchAgents').addEventListener('click', () => fetchData('/api/agents'));
            document.getElementById('fetchWeapons').addEventListener('click', () => fetchData('/api/weapons'));
            document.getElementById('fetchMaps').addEventListener('click', () => fetchData('/api/maps'));
            document.getElementById('fetchChromas').addEventListener('click', () => fetchData('/api/chromas'));
            document.getElementById('fetchSkins').addEventListener('click', () => fetchData('/api/skins'));
            document.getElementById('fetchGameModes').addEventListener('click', () => fetchData('/api/gameModes'));
            document.getElementById('fetchSprays').addEventListener('click', () => fetchData('/api/sprays'));
            document.getElementById('fetchCharms').addEventListener('click', () => fetchData('/api/charms'));
            document.getElementById('fetchPlayerCards').addEventListener('click', () => fetchData('/api/playerCards'));
            document.getElementById('fetchPlayerTitles').addEventListener('click', () => fetchData('/api/playerTitles'));
        </script>
    `);
});

// Create endpoints for each content type
const contentTypes = [
    'agents', 'weapons', 'maps', 'chromas', 'skins', 'gameModes', 'sprays', 'charms', 'playerCards', 'playerTitles'
];

contentTypes.forEach(type => {
    app.get(`/api/${type}`, (req, res) => {
        const locale = req.query.locale || 'en-US';
        const localizedData = Object.values(valorantData[type]).map(item => ({
            name: item.localizedNames[locale] || item.name,  // Fallback if localizedNames[locale] is missing
            assetName: item.assetName,
            id: item.id
        }));
        res.json(localizedData);
    });
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
