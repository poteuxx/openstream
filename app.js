// Small static catalog
const catalog = [
  {title:"Big Buck Bunny", link:"https://archive.org/details/BigBuckBunny_124", poster:"https://archive.org/services/img/BigBuckBunny_124"},
  {title:"Sintel", link:"https://archive.org/details/Sintel", poster:"https://archive.org/services/img/Sintel"},
  {title:"Elephants Dream", link:"https://archive.org/details/ElephantsDream", poster:"https://archive.org/services/img/ElephantsDream"}
];

// DOM elements
const content = document.getElementById("content");
const searchInput = document.getElementById("search");

// Build page
function buildHome(list=catalog){
  content.innerHTML = "";
  const section = document.createElement("div");
  section.className = "section";
  section.innerHTML = "<h2>Movies</h2>";
  const row = document.createElement("div");
  row.className = "row";

  list.forEach(movie=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="${movie.poster}"><div style="text-align:center;padding:5px">${movie.title}</div>`;
    // Open movie in new tab
    card.onclick = () => window.open(movie.link, "_blank");
    row.appendChild(card);
  });

  section.appendChild(row);
  content.appendChild(section);
}

// Initial render
buildHome();

// Search functionality
searchInput.addEventListener("input", e=>{
  const q = e.target.value.toLowerCase();
  if(q.length < 1){
    buildHome();
    return;
  }
  const results = catalog.filter(m => m.title.toLowerCase().includes(q));
  buildHome(results);
});

// Optional player modal (if you want embedded testing)
closeBtn.addEventListener("click", ()=>{playerModal.classList.add("hidden"); playerFrame.src="";});
playerModal.addEventListener("click", e=>{if(e.target===playerModal){playerModal.classList.add("hidden"); playerFrame.src="";}});
document.addEventListener("keydown", e=>{if(e.key==="Escape"){playerModal.classList.add("hidden"); playerFrame.src="";}});
