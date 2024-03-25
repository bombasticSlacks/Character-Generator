import CharacterGenerator from "./generator.js";

document.addEventListener("DOMContentLoaded", () => {
    const generator = new CharacterGenerator();
    const character = generator.generate();
    
    let a = document.querySelector("a");
    if(a && character.pronouns) {
        a.text = `${character.name} (${generator.convertPronouns(character.pronouns)})\n A ${character.demeanor} ${character.culture}, who wants to ${character.goal}, and is/has ${character.quirk}`
        document.body.appendChild(a)
    }
})