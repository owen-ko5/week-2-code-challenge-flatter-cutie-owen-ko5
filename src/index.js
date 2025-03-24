document.addEventListener("DOMContentLoaded", () => {
  const characterBar = document.getElementById("character-bar");
  const detailedInfo = document.getElementById("detailed-info");
  let characterVotes = {}; 
  fetch("https://flater-cutie-backend-repo.vercel.app/characters")
      .then(response => response.json())
      .then(characters => {
          characterBar.innerHTML = ""; 

          characters.forEach(character => {
              const span = document.createElement("span");
              span.textContent = character.name;
              span.classList.add("character-name");
              
              
              if (!characterVotes[character.id]) {
                  characterVotes[character.id] = character.votes;
              }

              span.addEventListener("click", () => {
                  displayCharacterDetails(character);
                  highlightSelectedCharacter(span);
              });

              characterBar.appendChild(span);
          });

          
          if (characters.length > 0) {
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
          <button id="vote-button" class="vote-btn">🔥 Vote</button>
          <button id="reset-button" class="reset-btn">🔄 Reset Votes</button>
      `;

    
      document.getElementById("vote-button").addEventListener("click", () => {
          characterVotes[character.id] += 1;
          updateVoteCount();
      });

    
      document.getElementById("reset-button").addEventListener("click", () => {
          characterVotes[character.id] = 0;
          updateVoteCount();
      });
  }

  
  function updateVoteCount() {
      const voteCount = document.getElementById("vote-count");
      voteCount.style.transform = "scale(1.2)";
      setTimeout(() => {
          voteCount.style.transform = "scale(1)";
      }, 300);
      voteCount.textContent = characterVotes[selectedCharacter.id];
  }

  function highlightSelectedCharacter(selectedSpan) {
      document.querySelectorAll(".character-name").forEach(span => {
          span.classList.remove("selected-character");
      });
      selectedSpan.classList.add("selected-character");
  }
});