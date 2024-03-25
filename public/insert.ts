import CharacterGenerator from "./generator.js";

const generator = new CharacterGenerator();
const character = generator.generate();

// checks if something should start with an or a
function anCheck(val?: string) {
  if (val) {
    const c = val.charAt(0).toLocaleLowerCase();
    if (c === "a" || c === "e" || c === "i" || c === "o" || c === "u") {
      return "An";
    }
  }

  return "A";
}

document.addEventListener("DOMContentLoaded", () => {
  let p = document.querySelector("p");
  if (p) {
    p.textContent = `${character.name} (${generator.convertPronouns(
      character.pronouns
    )}) ${anCheck(character.demeanor)} ${character.demeanor} ${
      character.culture
    }, who wants to ${character.goal}, and ${character.quirk}`;
  }
});
