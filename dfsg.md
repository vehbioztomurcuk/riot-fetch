Let me be more clear.

I need a layout like this. 

In my panel there is a 4 option for sub-category filter creation.
```
 - select
 - checkbox
 - radio
 - range
```

 I need additional option called api
```
 - select
 - checkbox
 - radio
 - range
 - api //need this
```
 What happens when I click to it?

 Answer: It opens side panel from same dropdown menu that contains apis we created correctly
```
 - api
  - Show All Valorant Agents 
  - Show All Valorant Weapons 
  - Show All Valorant Maps 
  - Show All Valorant Chromas 
  - Show All Valorant Skins 
  - Show All Valorant Game Modes 
  - Show All Valorant Sprays 
  - Show All Valorant Charms 
  - Show All Valorant Player Cards 
  - Show All Valorant Player Titles
```

you fetch the "name" value from all this responses and list them to that dropdown menu accordingly.

Instructions for Implementing Fetch Process with API for Future Applications
These instructions will guide you through how to fetch data from Riot Games’ Valorant API, display it on a web page, and set up new endpoints for future fields, such as filtering product types (e.g., weapon categories) on an e-commerce platform.

1. API Keys
API Key: RGAPI-a0b5ce5d-1a52-4f25-8e6c-8c01dd6d2510
Riot’s API keys are sensitive and are required for authentication with Riot’s API services. Be sure to keep your API key secure and never expose it in client-side code.
2. API Terms, Routes, and Configurations Used
Base URL for Valorant Content API: https://eu.api.riotgames.com/val/content/v1/contents?api_key=YOUR_API_KEY
API Routes for Fetching Content Types:
We used the following fields from the contents endpoint:
characters: Valorant agents
equips: Weapons in Valorant
Additional fields such as maps, chromas, skins, sprays, charms, playerCards, and playerTitles were also used in our setup.
Headers and Configurations:
Always include the User-Agent, Accept-Language, and API Key as headers when making requests to ensure proper authentication and language support.
3. General Instructions for Fetching and Displaying Data
Step 1: Setting Up an Express Server

Start by importing express and node-fetch and initializing an Express server.
Define a constant API_KEY to store your API key for easy reference.
`import express from ‘express’;
import fetch from ‘node-fetch’;

const app = express();
const PORT = 3000;
const API_KEY = ‘YOUR_API_KEY’;`

Step 2: Fetching Data from the API

Write an asynchronous function, loadValorantData, to fetch data from the Valorant API.
Use the Riot API endpoint for contents, and parse the response to JSON.
Use transformData to structure the data into categories like agents, weapons, etc.
``async function loadValorantData() {
try {
const response = await fetch(https://eu.api.riotgames.com/val/content/v1/contents?api_key=${API_KEY});

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        return;
    }

    const data = await response.json();
    valorantData.agents = transformData(data.characters || []);
    valorantData.weapons = transformData(data.equips || []);
    // Add other categories as necessary

    console.log("Valorant data loaded successfully.");
} catch (error) {
    console.error("Error loading Valorant data:", error);
}
}``

Step 3: Transforming Data

transformData formats each item to have properties like name, localizedNames, and assetName. This allows you to handle cases where some fields may be missing or require fallback values.
function transformData(items) { return items.reduce((acc, item) => { acc[item.id] = { name: item.name, localizedNames: item.localizedNames || {}, assetName: item.assetName, assetPath: item.assetPath || "N/A" }; return acc; }, {}); }

Step 4: Creating API Endpoints

Use Express to create endpoints for each data type.
Each endpoint retrieves data for the specified content type (e.g., /api/agents, /api/weapons).
Include a locale parameter to allow localization of names.
``const contentTypes = [
‘agents’, ‘weapons’, ‘maps’, ‘chromas’, ‘skins’, ‘gameModes’, ‘sprays’, ‘charms’, ‘playerCards’, ‘playerTitles’
];

contentTypes.forEach(type => {
app.get(/api/${type}, (req, res) => {
const locale = req.query.locale || ‘en-US’;
const localizedData = Object.values(valorantData[type]).map(item => ({
name: item.localizedNames[locale] || item.name,
assetName: item.assetName,
id: item.id
}));
res.json(localizedData);
});
});``

Step 5: Serving HTML and Frontend Buttons

Serve an HTML page with buttons that let users fetch data for each content type.
Use JavaScript to send fetch requests to the server endpoints and display the results.
``app.get(’/’, (req, res) => {
res.send(`

Valorant API Proxy Server

Use the buttons below to display various types of Valorant content.

    <button id="fetchAgents">Show All Valorant Agents</button>
    <button id="fetchWeapons">Show All Valorant Weapons</button>
    <!-- Add other buttons as needed -->

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
    </script>
`);
});``

Step 6: Running the Server

Run the server with node index.mjs.
Navigate to http://localhost:3000 in your browser to test.
Step 7: Expanding to Other Fields

To fetch additional fields (e.g., selecting weapon types), follow these steps:
Identify the API Endpoint: Verify the route and parameters required for the new field.
Add a Button: In the HTML, add a new button for the new field.
Create an Endpoint: Add a new Express route for the field, similar to other endpoints.
Fetch and Display: Use fetchData to retrieve and display the data on the page.
Summary
Configure API Key and Base URL.
Fetch data using the correct route and locale parameters.
Create endpoints for each data type.
Transform data to ensure all items have fallbacks for missing fields.
Serve HTML page with buttons to retrieve and display data.
Expand functionality by repeating steps with new fields.
By following this guide, you can adapt this setup for any future API-based data fetching needs, such as product filtering by categories in an e-commerce site.