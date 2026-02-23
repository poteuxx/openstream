let catalog = [];
let currentPage = 1;
const pageSize = 50;
let isLoading = false;

async function loadMovies(page = 1) {
    isLoading = true;
    try {
        const url = `https://archive.org/advancedsearch.php?q=mediatype%3Amovies&fl[]=identifier,title&rows=${pageSize}&page=${page}&output=json`;
        const res = await fetch(url);
        const data = await res.json();
        const movies = data.response.docs.map(m => ({
            title: m.title,
            poster: `https://archive.org/services/img/${m.identifier}`,
            embed: `https://archive.org/embed/${m.identifier}`
        }));
        catalog = catalog.concat(movies);
        buildHome();
    } catch (e) {
        console.error("Error loading movies", e);
    }
    isLoading = false;
}

function buildHome() {
    const container = document.getElementById("content");
    container.innerHTML = "";
    createSection("Movies", catalog.slice(0, currentPage * pageSize));
}

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

// Player functions
function openPlayer(movie) {
    document.getElementById("playerModal").classList.remove("hidden");
    document.getElementById("playerTitle").innerText = movie.title;
    document.getElementById("playerFrame").src = movie.embed;
}
function closePlayer() {
    document.getElementById("playerModal").classList.add("hidden");
    document.getElementById("playerFrame").src = "";
}

// Search
document.getElementById("search").addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    if (q.length < 2) {
        buildHome();
        return;
    }
    const results = catalog.filter(m => m.title.toLowerCase().includes(q));
    showSearch(results);
});
function showSearch(list) {
    const container = document.getElementById("content");
    container.innerHTML = "";
    createSection("Search Results", list.slice(0, 60));
}

// Infinite scroll
window.addEventListener("scroll", () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200 && !isLoading) {
        currentPage++;
        loadMovies(currentPage);
    }
});

// Initial load
loadMovies(currentPage);
