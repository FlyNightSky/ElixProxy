const proxyForm = document.getElementById('proxy-form');
const urlInput = document.getElementById('url-input');
const resultContainer = document.getElementById('result-container');

proxyForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = urlInput.value;

  try {
    const response = await fetch(`/Elix?url=${encodeURIComponent(url)}`); // Updated endpoint

    if (response.ok) {
      const data = await response.text();
      resultContainer.innerHTML = data;
      urlInput.style.display = 'none';
      proxyForm.style.display = 'none';
    } else {
      resultContainer.innerHTML = 'Error retrieving the URL.';
    }
  } catch (error) {
    resultContainer.innerHTML = 'Error occurred while making the request.';
  }
});

// Show the proxy form and URL input initially

