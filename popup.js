async function fetchData() {
  try {
    const moviename = document.getElementById("MovieName").value;
    const movieyear = document.getElementById("MovieYear").value;
    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(moviename)}&y=${movieyear}&apikey="place_your_api_key_here"`);
    const data = await response.json();
    if (!response.ok) throw new Error("API Error");
    if (data.Response === "False") {
      console.error(data.Error);
      alert(data.Error);
      return;
    }
    alert("The rating of the movie is " + data.imdbRating);
  } catch (error) {
    console.error(error);
    alert("Error: " + error.message);
  }
}


document.getElementById("getRating").addEventListener("click", fetchData);
