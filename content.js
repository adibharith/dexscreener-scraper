console.log("Content script is running on this page!");

const scrapeDexscreener = () => {
  const tokens = [];
  const tokenElements = document.querySelectorAll('a.ds-dex-table-row.ds-dex-table-row-top'); // Adjusted selector

  console.log("Found token elements:", tokenElements.length); // Log how many elements were found

  tokenElements.forEach((tokenElement) => {
    const href = tokenElement.getAttribute('href');
    if (href) {
      // Extract the token address from the href attribute (e.g., /solana/token_address)
      const tokenAddress = href.split('/').pop();
      tokens.push(tokenAddress);
    }
  });

  console.log("Extracted token addresses:", tokens); // Log the token addresses
  return tokens;
};

scrapeDexscreener(); // Call the function to scrape tokens when the script runs
