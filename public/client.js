const proxyForm = document.getElementById("proxy-form");
const title = document.getElementById("title");
const urlInput = document.getElementById("url-input");
const resultContainer = document.getElementById("result-container");
const container = document.getElementsByClassName("container");
resultContainer.style.display = "none";
urlInput.value = "https://";
proxyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const url = urlInput.value;

  try {
    const response = await fetch(`/Elix?url=${encodeURIComponent(url)}`);

    if (response.ok) {
      const data = await response.text();
      resultContainer.innerHTML = data;
      title.style.display = "none";
      urlInput.style.display = "none";
      proxyForm.style.display = "none";
      resultContainer.style.display = "block";
      document.body.style.backgroundColor = "white";
    } else {
      resultContainer.innerHTML = "Error retrieving the URL.";
    }
  } catch (error) {
    resultContainer.innerHTML = "Error occurred while making the request.";
  }
});

// Show the proxy form and URL input initially
container[0].style.display = "block";
