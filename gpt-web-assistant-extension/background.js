// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "fetchAnswer") {
    const { question, pageData } = request.payload;

    // Fetch linked pages
    fetchLinkedPages(pageData.links)
      .then((linkedContent) => {
        // Aggregate current page content with linked pages' content
        const aggregatedContent = {
          title: pageData.title,
          url: pageData.url,
          text: `${pageData.text} \n\n ${linkedContent}`
        };

        // Fetch answer from the backend
        return fetchAnswer(question, aggregatedContent);
      })
      .then((answer) => {
        sendResponse({ answer });
      })
      .catch((error) => {
        console.error("Error fetching answer:", error);
        sendResponse({ answer: "An error occurred while fetching the answer." });
      });

    return true; // Indicates asynchronous response
  }
});

async function fetchLinkedPages(links) {
  const maxPages = 3; // Limit the number of pages to fetch
  const pageContents = [];

  for (let i = 0; i < Math.min(links.length, maxPages); i++) {
    try {
      const response = await fetch(links[i]);
      const html = await response.text();

      // Parse the HTML to extract visible text
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const text = doc.body.innerText.slice(0, 5000); // Limit text length
      pageContents.push(text);
    } catch (error) {
      console.error(`Error fetching linked page: ${links[i]}`, error);
    }
  }

  return pageContents.join("\n\n");
}

async function fetchAnswer(question, pageData) {
  try {
    const response = await fetch("http://localhost:3000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question, pageData })
    });

    const data = await response.json();
    return data.answer;
  } catch (error) {
    throw new Error("Failed to fetch answer from backend server.");
  }
}
