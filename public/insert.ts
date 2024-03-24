import CharacterGenerator from "./generator.js";

document.addEventListener("DOMContentLoaded", () => {
    const generator = new CharacterGenerator();
    const character = generator.generate();
    

    let a = document.createElement("a");
    a.text = `${character.name} (${character.pronouns})\n A ${character.demeanor} ${character.culture}, who wants to ${character.goal}, and is/has ${character.quirk}`
    document.body.appendChild(a)
})