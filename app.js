let catalog = [];
let currentPage = 1;
const pageSize = 20; // small batch to avoid run cancelled
let isLoading = false;

// DOM elements
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
            link: `https://archive.org/details/${m.identifier}`
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
    createSection("Movies", catalog);
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
        card.innerHTML = `<img loading="lazy" src="https://archive.org/services/img/${movie.title.replace(/\s/g,'')}"><div style="padding:5px;text-align:center">${movie.title}</div>`;
        // Open in new tab
        card.onclick = ()=>window.open(movie.link,"_blank");
        row.appendChild(card);
    });

    section.appendChild(row);
    content.appendChild(section);
}

// Search
searchInput.addEventListener("input", e=>{
    const q = e.target.value.toLowerCase();
    if(q.length<2){
        buildHome();
        return;
    }
    const results = catalog.filter(m=>m.title.toLowerCase().includes(q));
    content.innerHTML = "";
    createSection("Search Results", results);
});

// Small batch infinite scroll
window.addEventListener("scroll", ()=>{
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight-200 && !isLoading){
        currentPage++;
        loadMovies(currentPage);
    }
});

// Initial load
loadMovies(currentPage);
