import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
const PORT = process.env.PORT || 4000;

if (!apiKey) {
    console.error("Error: GOOGLE_API_KEY is not defined in the environment variables.");
    process.exit(1);
}

const url = "https://places.googleapis.com/v1/places:searchText";

async function searchPlaces(textQuery = "transportation in Anaheim, CA", pageSize = 3) {
    const payload = { textQuery, pageSize };
    const headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.rating,places.userRatingCount,places.reviews,places.displayName,places.generativeSummary,places.formattedAddress,places.shortFormattedAddress,places.primaryType,places.primaryTypeDisplayName,places.types,places.websiteUri"
    };

    try {
        console.log(`Searching places for query: "${textQuery}"...\n`);
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            console.error(await response.text());
            return;
        }

        const data = await response.json();
        const places = data.places || [];

        if (places.length === 0) {
            console.log("No places found for the given query.");
            return;
        }

        places.forEach((place, index) => {
            console.log(`Place ${index + 1}:`);
            console.log(`- Name: ${place.displayName?.text || "N/A"}`);
            console.log(`- Rating: ${place.rating || "N/A"}`);
            console.log(`- # of Ratings: ${place.userRatingCount || "N/A"}`);
            console.log(`- Short Address: ${place.shortFormattedAddress || "N/A"}`);
            console.log(`- Long Address: ${place.formattedAddress || "N/A"}`);
            console.log(`- Types: ${place.types?.join(", ") || "N/A"}`);
            console.log(`- Primary Type: ${place.primaryType || "N/A"}`);
            console.log(`- Primary Type Display Name: ${place.primaryTypeDisplayName || "N/A"}`);
            console.log(`- Generative Summary: ${place.generativeSummary || "N/A"}`);
            console.log(`- Website URI: ${place.websiteUri || "N/A"}\n`);
        });
    } catch (error) {
        console.error("An error occurred while fetching places:", error);
    }
}

// Run the searchPlaces function
const query = "transportation in Anaheim, CA"; // Change this to your desired search query
searchPlaces(query);

// Optional: Start a simple server if PORT is required
import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Server is running.');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});