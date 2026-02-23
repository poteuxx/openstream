const fs = require("fs")

async function run(){

let results=[]

for(let page=1; page<=50; page++)
{
const url=`https://archive.org/advancedsearch.php?q=mediatype%3Amovies&fl[]=identifier,title&rows=50&page=${page}&output=json`

const res=await fetch(url)

const data=await res.json()

data.response.docs.forEach(m=>{

if(!m.identifier || !m.title) return

results.push({
title:m.title,
poster:`https://archive.org/services/img/${m.identifier}`,
embed:`https://archive.org/embed/${m.identifier}`
})

})

console.log("page",page)
}

fs.writeFileSync("movies.json",JSON.stringify(results,null,2))

console.log("Total movies:",results.length)
}

run()
