document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const detailedInfo = document.getElementById("detailed-info");
    let characterVotes = {}; 
    let selectedCharacter = null; 

    // Fetch characters from backend
    fetch("https://flater-cutie-backend-repo.vercel.app/characters")
        .then(response => response.json())
        .then(characters => {
            characterBar.innerHTML = ""; 

            characters.forEach(character => {
                const span = document.createElement("span");
                span.textContent = character.name;
                span.classList.add("character-name");

                // Store votes for each character
                characterVotes[character.id] = character.votes;

                // Add event listener for selecting a character
                span.addEventListener("click", () => {
                    selectedCharacter = character; 
                    displayCharacterDetails(character);
                    highlightSelectedCharacter(span);
                });

                characterBar.appendChild(span);
            });

            // Auto-display first character
            if (characters.length > 0) {
                selectedCharacter = characters[0]; 
                displayCharacterDetails(characters[0]);
                highlightSelectedCharacter(characterBar.children[0]);
            }
        })
        .catch(error => console.error("Error fetching characters:", error));

    // Function to display character details
    function displayCharacterDetails(character) {
        detailedInfo.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <p>Votes: <span id="vote-count">${characterVotes[character.id]}</span></p>
            <input type="number" id="vote-input" placeholder="Enter votes" min="1">
            <button id="vote-button" class="vote-btn">🔥 Vote</button>
            <button id="reset-button" class="reset-btn">🔄 Reset Votes</button>
        `;

        // Add event listeners (ensuring we don’t add duplicates)
        document.getElementById("vote-button").addEventListener("click", () => voteCharacter(character));
        document.getElementById("reset-button").addEventListener("click", () => resetVotes(character));
    }

    // Function to update votes in UI and backend
    function voteCharacter(character) {
        const voteInput = document.getElementById("vote-input");
        const voteAmount = parseInt(voteInput.value, 10);

        if (!voteAmount || voteAmount < 1) {
            alert("Please enter a valid number of votes.");
            return;
        }

        characterVotes[character.id] += voteAmount;
        updateVoteCount(character);

        // Send updated votes to backend
        fetch(`https://flater-cutie-backend-repo.vercel.app/characters/${character.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: characterVotes[character.id] })
        })
        .catch(error => console.error("Error updating votes:", error));

        // Clear input field after voting
        voteInput.value = "";
    }

    // Function to reset votes to 0
    function resetVotes(character) {
        characterVotes[character.id] = 0;
        updateVoteCount(character);

        // Update backend with 0 votes
        fetch(`https://flater-cutie-backend-repo.vercel.app/characters/${character.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: 0 })
        })
        .catch(error => console.error("Error resetting votes:", error));
    }

    // Function to update vote count in UI
    function updateVoteCount(character) {
        const voteCount = document.getElementById("vote-count");
        voteCount.textContent = characterVotes[character.id];

        // Small animation effect
        voteCount.style.transform = "scale(1.2)";
        setTimeout(() => {
            voteCount.style.transform = "scale(1)";
        }, 300);
    }

    // Function to highlight selected character
    function highlightSelectedCharacter(selectedSpan) {
        document.querySelectorAll(".character-name").forEach(span => {
            span.classList.remove("selected-character");
        });
        selectedSpan.classList.add("selected-character");
    }
});
