let catalog = []

// Load movies.json
fetch("movies.json")
.then(r => r.json())
.then(data => {
    catalog = data;
    document.getElementById("loading").style.display = "none";
    buildHome();
})
.catch(err => {
    document.getElementById("loading").innerText = "Failed to load movies.json";
    console.error(err);
});

// Build home sections
function buildHome() {
    const container = document.getElementById("content");
    container.innerHTML = "";

    createSection("Trending", shuffle(catalog).slice(0,40));
    createSection("Popular", catalog.slice(0,40));
    createSection("Recently Added", shuffle(catalog).slice(40,80));
    createSection("Watch Now", shuffle(catalog).slice(80,120));
}

// Create a single row section
function createSection(title, list) {
    const container = document.getElementById("content");
    const section = document.createElement("div");
    section.className = "section";
    section.innerHTML = `<h2>${title}</h2>`;

    const row = document.createElement("div");
    row.className = "row";

    list.forEach(movie => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<img loading="lazy" src="${movie.poster}">`;
        card.onclick = () => openPlayer(movie);
        row.appendChild(card);
    });

    section.appendChild(row);
    container.appendChild(section);
}

// Shuffle helper
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// Open player
function openPlayer(movie) {
    document.getElementById("playerModal").classList.remove("hidden");
    document.getElementById("playerTitle").innerText = movie.title;
    document.getElementById("playerFrame").src = movie.embed;
}

// Close player
function closePlayer() {
    document.getElementById("playerModal").classList.add("hidden");
    document.getElementById("playerFrame").src = "";
}

// Search
document.getElementById("search").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();

    if(q.length < 2) {
        buildHome();
        return;
    }

    const results = catalog.filter(m => m.title.toLowerCase().includes(q));
    showSearch(results);
});

function showSearch(list) {
    const container = document.getElementById("content");
    container.innerHTML = "";
    createSection("Search Results", list.slice(0,60));
}
