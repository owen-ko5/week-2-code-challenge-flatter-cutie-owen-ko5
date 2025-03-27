document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    let characterVotes = {}; 
    let selectedCharacter = null; 

    fetch("https://flater-cutie-backend-repo.vercel.app/characters")
        .then(response => response.json())
        .then(characters => {
            characterBar.innerHTML = ""; 

            characters.forEach(character => {
                const span = document.createElement("span");
                span.textContent = character.name;
                span.classList.add("character-name");

                
                characterVotes[character.id] = character.votes;

                
                span.addEventListener("click", () => {
                    selectedCharacter = character; 
                    displayCharacterDetails(character);
                    highlightSelectedCharacter(span);
                });

                characterBar.appendChild(span);
            });

           
            if (characters.length > 0) {
                selectedCharacter = characters[0]; 
                displayCharacterDetails(characters[0]);
                highlightSelectedCharacter(characterBar.children[0]);
            }
        })
        .catch(error => console.error("Error fetching characters:", error));

    
    function displayCharacterDetails(character) {
        detailedInfo.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <p>Votes: <span id="vote-count">${characterVotes[character.id]}</span></p>
            <input type="number" id="vote-input" placeholder="Enter votes" min="1">
            <button id="vote-button" class="vote-btn">🔥 Vote</button>
            <button id="reset-button" class="reset-btn">🔄 Reset Votes</button>
        `;

        
        document.getElementById("vote-button").addEventListener("click", () => voteCharacter(character));
        document.getElementById("reset-button").addEventListener("click", () => resetVotes(character));
    }

    
    function voteCharacter(character) {
        const voteInput = document.getElementById("vote-input");
        const voteAmount = parseInt(voteInput.value, 10);

        if (!voteAmount || voteAmount < 1) {
            alert("Please enter a valid number of votes.");
            return;
        }

        characterVotes[character.id] += voteAmount;
        updateVoteCount(character);

       
        fetch(`https://flater-cutie-backend-repo.vercel.app/characters/${character.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: characterVotes[character.id] })
        })
        .catch(error => console.error("Error updating votes:", error));

        
        voteInput.value = "";
    }

    
    function resetVotes(character) {
        characterVotes[character.id] = 0;
        updateVoteCount(character);

        
        fetch(`https://flater-cutie-backend-repo.vercel.app/characters/${character.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: 0 })
        })
        .catch(error => console.error("Error resetting votes:", error));
    }

   
    function updateVoteCount(character) {
        const voteCount = document.getElementById("vote-count");
        voteCount.textContent = characterVotes[character.id];

        
        voteCount.style.transform = "scale(1.2)";
        setTimeout(() => {
            voteCount.style.transform = "scale(1)";
        }, 300);
    }

    
    function highlightSelectedCharacter(selectedSpan) {
        document.querySelectorAll(".character-name").forEach(span => {
            span.classList.remove("selected-character");
        });
        selectedSpan.classList.add("selected-character");
    }
});
