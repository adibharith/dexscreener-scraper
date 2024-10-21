document.getElementById('scrapeButton').addEventListener('click', () => {
  const tokenLimit = parseInt(document.getElementById('tokenLimit').value, 10); // Get the user-specified limit
  if (isNaN(tokenLimit) || tokenLimit <= 0) {
    document.getElementById('output').textContent = 'Please enter a valid number of tokens to scrape.';
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: scrapeDexscreener,
      args: [tokenLimit] // Pass the limit to the content script
    }, (results) => {
      const tokenAddresses = results && results[0].result ? results[0].result : [];

      // Display the token addresses in the popup
      document.getElementById('output').textContent = tokenAddresses.join(',\n');

      // Only show the download button if there are token addresses
      if (tokenAddresses.length > 0) {
        document.getElementById('downloadButton').style.display = 'block';

        // Set up the download button with the token addresses
        document.getElementById('downloadButton').addEventListener('click', () => {
          downloadTokenAddresses(tokenAddresses);
        });
      } else {
        document.getElementById('output').textContent = 'No token addresses found.';
        document.getElementById('downloadButton').style.display = 'none';
      }
    });
  });
});

function downloadTokenAddresses(addresses) {
  const formattedAddresses = addresses.join(',\n'); // Format the addresses
  const blob = new Blob([formattedAddresses], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  // Create a temporary download link
  const a = document.createElement('a');
  a.href = url;
  a.download = 'token_addresses.txt';

  // Trigger the download
  a.click();

  // Clean up
  URL.revokeObjectURL(url);
}

// Content script logic to scrape token addresses, limited by tokenLimit
function scrapeDexscreener(tokenLimit) {
  const tokens = [];
  const tokenElements = document.querySelectorAll('a.ds-dex-table-row.ds-dex-table-row-top');

  tokenElements.forEach((tokenElement, index) => {
    if (index >= tokenLimit) return; // Stop once we reach the limit

    const href = tokenElement.getAttribute('href');
    if (href) {
      const tokenAddress = href.split('/').pop();
      tokens.push(tokenAddress);
    }
  });

  return tokens;
}
