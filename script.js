// ELEMENTS
const navEl = document.querySelector(".nav");
const pokedexEl = document.querySelector(".pokedex");
const entryTemplateEl = document.querySelector("#entry_template");
const modalTemplateEl = document.querySelector("#modal_template");

let colors = {
    normal: '#A8A77A80',
    fire: '#EE813080',
    water: '#6390F080',
    electric: '#F7D02C80',
    grass: '#7AC74C80',
    ice: '#96D9D680',
    fighting: '#C22E2880',
    poison: '#A33EA180',
    ground: '#E2BF6580',
    flying: '#A98FF380',
    psychic: '#F9558780',
    bug: '#A6B91A80',
    rock: '#B6A13680',
    ghost: '#73579780',
    dragon: '#6F35FC80',
    dark: '#70574680',
    steel: '#B7B7CE80',
    fairy: '#D685AD80',
};

let pokemonData;
// GENERIC FUNCTIONS
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
function formatNumber(nb){
    return '#' + nb.toString().padStart(3, '0');
}
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
                    id: formatNumber(data.id),
                    type: data.types[0].type.name,
                    type2: data.types.length > 1 ? data.types[1].type.name : null,
                    src: data.sprites.other.showdown.front_default ? data.sprites.other.showdown.front_default : data.sprites.front_default,
                    abilities: data.abilities,
                    height: data.height,
                    weight: data.weight,
                    stats: data.stats,
                };

                // Push object in array at a determined index
                pokemonData[data.id - 1] = currentPokemon;
            });
    });

    // Await all pending promises
    await Promise.all(pokemonPromises);

    pokemonData.forEach((pokemon) => {
        // Clone template
        let templateClone = document.importNode(entryTemplateEl.content, true);
        // Select template elements
        let entry = templateClone.querySelector(".entry");
        
        // Input relevant data
        templateClone.querySelector(".name").textContent = capitalizeFirstLetter(pokemon.name);
        templateClone.querySelector(".id").textContent = pokemon.id;
        templateClone.querySelector(".type").textContent = pokemon.type;
        templateClone.querySelector(".type2").textContent = pokemon.type2;
        templateClone.querySelector(".img").src = pokemon.src;

        // Add relevant classes
        entry.classList.add(pokemon.type);

        pokedexEl.appendChild(templateClone);

    });

    // HANDLE COLORS FOR BASE CARDS
    for(color in colors) {
        let colorCards = document.querySelectorAll(`.${color}`);
        
        colorCards.forEach(card => {
            card.querySelector('.type').style.backgroundColor = colors[color].slice(0, -2);

            card.style.background = `linear-gradient(${colors[color].slice(0, -2)}, #fff)`;
        })
    }
    let secondTypeEl = document.querySelectorAll('.type2');
    secondTypeEl.forEach(type => {

    let typeTxt = type.textContent;
        for(color in colors){
            if(color == typeTxt){
                type.style.backgroundColor = colors[color].slice(0, -2);
            }
        }
    })
}

// GET REGION POKEDEX
async function getGenerationPokedex() {
    // Fetch generation to get generation names
    const response = await fetch("https://pokeapi.co/api/v2/generation");
    const data = await response.json();

    data.results.forEach((generation) => {
        // For each generation
        let generationBtn = document.createElement("button"); // Create a btn element
        generationBtn.textContent = generation.name.replace('eration', ''); // Add the generation name as text in btn
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


// HANDLE COLOR OF CARDS


// ON LOAD
getGenerationPokedex();
getGenerationPokemonInfo("https://pokeapi.co/api/v2/generation/1");

