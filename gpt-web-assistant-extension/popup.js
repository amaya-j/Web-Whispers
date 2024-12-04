// popup.js

document.getElementById("askButton").addEventListener("click", () => {
    const question = document.getElementById("questionInput").value.trim();
    if (question) {
      document.getElementById("answerDisplay").innerText = "Fetching answer...";
      getPageData()
        .then((pageData) => {
          chrome.runtime.sendMessage(
            {
              type: "fetchAnswer",
              payload: { question, pageData }
            },
            (response) => {
              document.getElementById("answerDisplay").innerText = response.answer;
            }
          );
        })
        .catch((error) => {
          console.error("Error getting page data:", error);
          document.getElementById("answerDisplay").innerText = "Failed to get page data.";
        });
    } else {
      alert("Please enter a question.");
    }
  });
  
  function getPageData() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { type: "getPageData" }, (response) => {
          if (response && response.pageData) {
            resolve(response.pageData);
          } else {
            reject("No page data received.");
          }
        });
      });
    });
  }
  