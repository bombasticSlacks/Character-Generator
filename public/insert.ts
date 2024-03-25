import CharacterGenerator from "./generator.js";

const generator = new CharacterGenerator();
const character = generator.generate();

document.addEventListener("DOMContentLoaded", () => {
  let p = document.querySelector("p");
  if (p && character.pronouns) {
    p.textContent = `${character.name} (${generator.convertPronouns(
      character.pronouns
    )})\n A ${character.demeanor} ${character.culture}, who wants to ${
      character.goal
    }, and is/has ${character.quirk}`;
  }
});
