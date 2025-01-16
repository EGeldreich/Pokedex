// ELEMENTS
const navEl = document.querySelector(".nav");
const pokedexEl = document.querySelector(".pokedex");
const entryTemplateEl = document.querySelector("#entry_template");

let pokemonData;

// // POKEDEX URL SEEKER FUNCTION
// async function getGenerationPokedexEndpoint(inputGeneration) {
//     // seek the correct pokedex from pokedex list
//     const response = await fetch("https://pokeapi.co/api/v2/pokedex?limit=100");
//     const data = await response.json();

//     // Seek the right generation from data
//     for (let generation of data.results) {
//         if (
//             generation.name == inputGeneration ||
//             generation.name == `original-${inputGeneration}` ||
//             generation.name == `${inputGeneration}-central`
//         ) {
//             return generation.url; // Return the url
//         }
//     }
//     return null; // Failsafe in case of no result
// }

// GET REGION POKEDEX
async function getGenerationPokedex() {
    // Fetch generation to get generation names
    const response = await fetch("https://pokeapi.co/api/v2/generation");
    const data = await response.json();

    data.results.forEach((generation) => {
        // For each generation
        let generationBtn = document.createElement("button"); // Create a btn element
        generationBtn.textContent = generation.name; // Add the generation name as text in btn
        generationBtn.classList.add("generation"); // Add the generation class for styling reason
        navEl.appendChild(generationBtn); // Append in to the nav

        // Add event listener on click
        generationBtn.addEventListener("click", async () => {
            // Clean DOM
            pokedexEl.innerHTML = "";
            // Set up Pokemon Data
            pokemonData = [];

            // Fetch generation pokedex
            const response = await fetch(generation.url);
            // console.log(generation.url);
            const data = await response.json();

            data.pokemon_species.forEach((pokemon) => {
                // Fetch pokemon data
                let pokemonUrl = pokemon.url.replace("-species", "");
                fetch(pokemonUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);

                        // Clone template
                        let templateClone = document.importNode(
                            entryTemplateEl.content,
                            true
                        );
                        // Select template elements
                        let entry = templateClone.querySelector(".entry");
                        let name = templateClone.querySelector(".name");
                        let nb = templateClone.querySelector(".nb");
                        let type = templateClone.querySelector(".type");
                        let img = templateClone.querySelector(".img");

                        // Input relevant data
                        entry.classList.add(data.types[0].type.name, data.id);
                        name.textContent = data.name;
                        nb.textContent = data.id;
                        type.textContent = data.types[0].type.name;
                        img.src = data.sprites.front_default;

                        pokedexEl.appendChild(templateClone);
                    });
            });
        });
    });
}

// ON LOAD
getGenerationPokedex();
