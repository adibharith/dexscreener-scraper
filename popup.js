document.getElementById('scrapeButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        const tokens = [];
        document.querySelectorAll('a.ds-dex-table-row.ds-dex-table-row-top').forEach((tokenElement) => {
          const href = tokenElement.getAttribute('href');
          if (href) {
            tokens.push(href.split('/').pop());
          }
        });
        return tokens;
      }
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }

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
