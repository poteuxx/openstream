(async function(){
    let results = [];
    const totalPages = 20; // 20 pages × 50 movies = ~1000 movies

    for(let page=1; page<=totalPages; page++){
        const url = `https://archive.org/advancedsearch.php?q=mediatype%3Amovies&fl[]=identifier,title&rows=50&page=${page}&output=json`;

        try{
            const res = await fetch(url);
            const data = await res.json();

            data.response.docs.forEach(m=>{
                if(!m.identifier || !m.title) return;

                results.push({
                    title: m.title,
                    poster: `https://archive.org/services/img/${m.identifier}`,
                    embed: `https://archive.org/embed/${m.identifier}`
                });
            });

            console.log(`Loaded page ${page}, total movies so far: ${results.length}`);
        }catch(e){
            console.error("Error fetching page", page, e);
        }

        // Slow down to prevent overloading server
        await new Promise(r=>setTimeout(r, 500));
    }

    // Convert to JSON string
    const json = JSON.stringify(results, null, 2);

    // Trigger download
    const a = document.createElement("a");
    const file = new Blob([json], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = "movies.json";
    a.click();

    console.log("Done! Total movies:", results.length);
})();
