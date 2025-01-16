// ELEMENTS
const navEl = document.querySelector(".nav");
const pokedexEl = document.querySelector(".pokedex");
const entryTemplateEl = document.querySelector("#entry_template");

let pokemonData;

// GET POKEMON INFORMATION
async function getGenerationPokemonInfo(generationUrl) {
    // Fetch generation pokedex
    const response = await fetch(generationUrl);
    const data = await response.json();

    // Initialize pokemonData array / Or reset for each generation
    pokemonData = [];

    // GET POKEMON DATAS AND PUT IT IN ARRAY
    // Using an array to regroup promises in order to user Promise.all later
    const pokemonPromises = data.pokemon_species.map((pokemon) => {
        //
        // Fetch pokemon data
        // Get Pokemon Endpoint by removing -species from url (not the same informations are retrieved)
        let pokemonUrl = pokemon.url.replace("-species", "");
        // RETURN needed to answer Promise.all
        return fetch(pokemonUrl)
            .then((response) => response.json())
            .then((data) => {
                // Get relevant informations and set temporary object
                let currentPokemon = {
                    name: data.name,
                    id: data.id,
                    type: data.types[0].type.name,
                    src: data.sprites.front_default,
                };
                // Push object in array at a determined index
                pokemonData[data.id - 1] = currentPokemon;
            });
    });

    // Await all pending promises
    await Promise.all(pokemonPromises);

    console.log(pokemonData);

    pokemonData.forEach((pokemon) => {
        console.log("test");
        // Clone template
        let templateClone = document.importNode(entryTemplateEl.content, true);
        // Select template elements
        let entry = templateClone.querySelector(".entry");
        let name = templateClone.querySelector(".name");
        let id = templateClone.querySelector(".id");
        let type = templateClone.querySelector(".type");
        let img = templateClone.querySelector(".img");

        // Input relevant data
        name.textContent = pokemon.name;
        id.textContent = pokemon.id;
        type.textContent = pokemon.type;
        img.src = pokemon.src;

        // Add relevant classes
        entry.classList.add(pokemon.type);

        pokedexEl.appendChild(templateClone);
    });

    // console.log(pokemonData);
}

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
            // Get and set up Pokemon Data, then fill up DOM
            getGenerationPokemonInfo(generation.url);
        });
    });
}

// ON LOAD
getGenerationPokedex();
