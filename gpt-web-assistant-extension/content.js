// content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getPageData") {
      const pageData = {
        title: document.title,
        url: window.location.href,
        text: getVisibleText()
      };
      sendResponse({ pageData });
    }
  });
  
  function getVisibleText() {
    // Function to get visible text from the page
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (
            node.parentNode.tagName !== "SCRIPT" &&
            node.parentNode.tagName !== "STYLE" &&
            node.parentNode.tagName !== "NOSCRIPT"
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      },
      false
    );
  
    let node;
    let textContent = "";
    while ((node = walker.nextNode())) {
      textContent += node.nodeValue + " ";
    }
  
    // Limit text length to avoid exceeding token limits
    return textContent.slice(0, 10000); // Adjust as needed
  }
  