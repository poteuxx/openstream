let catalog = []

fetch("movies.json")
.then(r=>r.json())
.then(data=>{
    catalog = data
    document.getElementById("loading").style.display="none"
    buildHome()
})
.catch(err=>{
    document.getElementById("loading").innerText = "Failed to load movies.json"
    console.error(err)
})

function buildHome()
{
const rows = document.getElementById("rows")
rows.innerHTML=""

createRow("Trending", shuffle(catalog).slice(0,40))

createRow("Popular", catalog.slice(0,40))

createRow("More Movies", shuffle(catalog).slice(40,80))

createRow("Watch Now", shuffle(catalog).slice(80,120))
}

function createRow(title,list)
{
const rows = document.getElementById("rows")

const row = document.createElement("div")
row.className="row"

row.innerHTML=`<h2>${title}</h2>`

const scroller = document.createElement("div")
scroller.className="rowScroll"

list.forEach(movie=>{

const card = document.createElement("div")
card.className="card"

card.innerHTML=`<img src="${movie.poster}">`

card.onclick = ()=>openPlayer(movie)

scroller.appendChild(card)

})

row.appendChild(scroller)

rows.appendChild(row)
}

function shuffle(array)
{
return array.sort(()=>Math.random()-0.5)
}

function openPlayer(movie)
{
document.getElementById("playerModal").classList.remove("hidden")

document.getElementById("title").innerText = movie.title

document.getElementById("playerFrame").src = movie.embed
}

function closePlayer()
{
document.getElementById("playerModal").classList.add("hidden")

document.getElementById("playerFrame").src=""
}

document.getElementById("search").addEventListener("input", e => {

const q = e.target.value.toLowerCase()

if(q.length < 2)
{
buildHome()
return
}

const results = catalog.filter(m => m.title.toLowerCase().includes(q))

const rows = document.getElementById("rows")
rows.innerHTML=""

createRow("Results", results)

})
