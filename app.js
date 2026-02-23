let catalog = []

fetch("movies.json")
.then(r=>r.json())
.then(data=>{
catalog = data
render(catalog)
})

function render(list)
{
const grid = document.getElementById("grid")
grid.innerHTML=""

list.forEach(movie=>{

const card=document.createElement("div")
card.className="card"

card.innerHTML=`
<img src="${movie.poster}">
<div style="padding:10px">${movie.title}</div>
`

card.onclick=()=>open(movie)

grid.appendChild(card)

})
}

function open(movie)
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

document.getElementById("search").addEventListener("input",e=>{

const q=e.target.value.toLowerCase()

const filtered=catalog.filter(m=>m.title.toLowerCase().includes(q))

render(filtered)

})
