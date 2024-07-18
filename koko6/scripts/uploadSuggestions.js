const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const API_URL = 'http://172.20.0.119:5000/api/suggestions';

const sampleSuggestions = [
  { title: 'Summer Sale', image: 'summer_sale.jpg' },
  { title: 'New Arrivals', image: 'new_arrivals.jpg' },
  { title: 'Flash Deal', image: 'flash_deal.jpg' },
  { title: 'Clearance', image: 'clearance.jpg' },
];

async function uploadSuggestion(suggestion) {
     const formData = new FormData();
     formData.append('title', suggestion.title);
     formData.append('background_image', fs.createReadStream(path.join(__dirname, suggestion.image)));
   
     try {
       const response = await axios.post(API_URL, formData, {
         headers: {
           ...formData.getHeaders(),
         },
       });
       console.log(`Uploaded suggestion: ${suggestion.title}`);
       return response.data;
     } catch (error) {
       console.error(`Error uploading suggestion ${suggestion.title}:`);
       if (error.response) {
         console.error('Response status:', error.response.status);
         console.error('Response data:', error.response.data);
       } else {
         console.error('Error:', error.message);
       }
     }
   }

async function populateSuggestions() {
  for (const suggestion of sampleSuggestions) {
    await uploadSuggestion(suggestion);
  }
  console.log('Finished populating suggestions');
}

populateSuggestions();