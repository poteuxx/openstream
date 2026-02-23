let catalog = [];
let currentPage = 1;
const pageSize = 50;
let isLoading = false;

// DOM elements
const playerModal = document.getElementById("playerModal");
const playerFrame = document.getElementById("playerFrame");
const playerTitle = document.getElementById("playerTitle");
const closeBtn = document.getElementById("closeBtn");
const content = document.getElementById("content");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("search");

// Load movies dynamically from Internet Archive
async function loadMovies(page = 1){
    isLoading = true;
    try{
        const url = `https://archive.org/advancedsearch.php?q=mediatype%3Amovies&fl[]=identifier,title&rows=${pageSize}&page=${page}&output=json`;
        const res = await fetch(url);
        const data = await res.json();
        const movies = data.response.docs.map(m=>({
            title: m.title,
            poster: `https://archive.org/services/img/${m.identifier}`,
            embed: `https://archive.org/embed/${m.identifier}`
        }));
        catalog = catalog.concat(movies);
        loading.style.display = "none";
        buildHome();
    }catch(e){
        console.error("Error loading movies", e);
    }
    isLoading = false;
}

// Build home page
function buildHome(){
    content.innerHTML = "";
    createSection("Movies", catalog.slice(0, currentPage * pageSize));
}

// Create section
function createSection(title, list){
    const section = document.createElement("div");
    section.className = "section";
    section.innerHTML = `<h2>${title}</h2>`;
    const row = document.createElement("div");
    row.className = "row";

    list.forEach(movie=>{
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<img loading="lazy" src="${movie.poster}">`;
        card.onclick = ()=>openPlayer(movie);
        row.appendChild(card);
    });

    section.appendChild(row);
    content.appendChild(section);
}

// Player functions
function openPlayer(movie){
    playerModal.classList.remove("hidden");
    playerTitle.innerText = movie.title;
    playerFrame.src = movie.embed;
}

function closePlayer(){
    playerModal.classList.add("hidden");
    playerFrame.src = "";
}

// Event listeners
closeBtn.addEventListener("click", closePlayer);

playerModal.addEventListener("click", e=>{
    if(e.target === playerModal) closePlayer();
});

document.addEventListener("keydown", e=>{
    if(e.key === "Escape") closePlayer();
});

// Search
searchInput.addEventListener("input", e=>{
    const q = e.target.value.toLowerCase();
    if(q.length<2){
        buildHome();
        return;
    }
    const results = catalog.filter(m=>m.title.toLowerCase().includes(q));
    content.innerHTML = "";
    createSection("Search Results", results.slice(0,60));
});

// Infinite scroll for lazy loading
window.addEventListener("scroll", ()=>{
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight-200 && !isLoading){
        currentPage++;
        loadMovies(currentPage);
    }
});

// Initial load
loadMovies(currentPage);
