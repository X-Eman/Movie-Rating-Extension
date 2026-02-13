console.log("Content script running on:", window.location.href);

const timer = setInterval(async () => {
  const items = document.querySelectorAll(".film_list-wrap .flw-item");
  if (items.length === 0) return; // keep checking

  clearInterval(timer);

  console.log(`Found ${items.length} movie items – fetching ratings...`);

  for (const item of items) {
    const nameElem = item.querySelector(".film-name a");
    const yearElem = item.querySelector(".fd-infor .fdi-item");

    const name = nameElem?.textContent?.trim();
    let year = yearElem?.textContent?.trim();

    if (!name) continue;

    // Clean year if needed (e.g. "2023 • HD" → "2023")
    year = year ? year.split(/[^\d]/)[0] : "";

    try {
      const url = `https://www.omdbapi.com/?t=${encodeURIComponent(name)}&y=${year}&apikey=20fcc249`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.Response === "True" && data.imdbRating && data.imdbRating !== "N/A") {
        // Create a nice badge/span
        const ratingSpan = document.createElement("span");
        ratingSpan.style.cssText = `
          background: #f5c518;
          color: black;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
          font-size: 0.9em;
          vertical-align: middle;
        `;
        ratingSpan.textContent = `${data.imdbRating}`;

        // Insert right after the movie name
        nameElem.appendChild(ratingSpan);
      } else {
        ratingSpan.textContent = `N/A`;
        ratingSpan.style.cssText = `
          background: #f5c518;
          color: black;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
          font-size: 0.9em;
          vertical-align: middle;
        `;
        // Optional: show "N/A" or nothing
        console.log(`No rating for "${name}" (${year})`);
      }
    } catch (err) {
      console.error(`OMDB fetch failed for "${name}":`, err);
    }
  }

  console.log("Ratings added!");
}, 3000);