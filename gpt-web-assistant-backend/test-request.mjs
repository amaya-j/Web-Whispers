import fetch from 'node-fetch';

fetch('http://localhost:3000/api/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: "What is this webpage about?",
    pageData: {
      title: "Example Page",
      url: "https://example.com",
      text: "This is an example webpage containing information about various topics."
    }
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
