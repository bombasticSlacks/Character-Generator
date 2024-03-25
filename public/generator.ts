// Generates A Collection Of Information To Represent A Character
import { Prole } from "./data/Prole.js";
import { Demeanor } from "./data/Demeanor.js";
import { Goals } from "./data/Goal.js";
import { Quirks } from "./data/Quirk.js";
import { Appearance } from "./data/Appearance.js";

interface PronounDetails {
  chance: number;
  firstNames: string[];
  secondNames: string[];
  hair: string[];
  hairColour: string[];
  eyes: string[];
}

interface CultureData {
  He: PronounDetails;
  She: PronounDetails;
  They: PronounDetails;
  Hey: PronounDetails;
  Shey: PronounDetails;
  It: PronounDetails;
}

enum Culture {
  Envoy = "Envoy",
  IPC = "IPC",
  Kaar = "Kaar",
  Noble = "Noble",
  Outsider = "Outsider",
  Prole = "Prole",
  Unborn = "Unborn",
}

enum Pronouns {
  He = "He",
  She = "She",
  Hey = "Hey",
  Shey = "Shey",
  They = "They",
  It = "It",
}

interface Character {
  culture?: Culture;
  pronouns?: Pronouns;
  name?: string;
  demeanor?: string;
  goal?: string;
  quirk?: string;
  appearance?: string;
}

const details = new Map<Culture, CultureData>();
details.set(Culture.Prole, Prole);

function getCultureData(culture: Culture): CultureData {
  const data = details.get(culture);
  if (!data) {
    throw new TypeError();
  }
  return data;
}

// Get a random value that are weighted from a hash map
function getRandomWeighted(values: Map<string, number>): string {
  let total = 0;
  for (const entry of values) {
    total += entry[1];
  }

  let roll = Math.floor(Math.random() * total);
  let value = "";

  for (const entry of values) {
    value = entry[0];
    if (roll < entry[1]) {
      break;
    } else {
      roll -= entry[1];
    }
  }

  return value;
}

// Get a random unweighted value from an array
function getRandom(values: Array<string>): string {
  let roll = Math.floor(Math.random() * (values.length - 1));

  return values[roll];
}

export default class CharacterGenerator {
  // Create A Character
  // Can override randomness with passed values
  generate(character?: Character): Character {
    if (!character) {
      character = {
        culture: undefined,
        name: undefined,
        pronouns: undefined,
        demeanor: undefined,
        goal: undefined,
        quirk: undefined,
      };
    }

    if (!character.culture) {
      character.culture = this.generateCulture();
    }
    if (!character.pronouns) {
      character.pronouns = this.generatePronouns(character.culture);
    }
    if (!character.name) {
      character.name = this.generateName(character.culture, character.pronouns);
    }
    if (!character.demeanor) {
      character.demeanor = this.generateDemeanor();
    }
    if (!character.goal) {
      character.goal = this.generateGoal();
    }
    if (!character.quirk) {
      character.quirk = this.generateQuirk();
    }
    if (!character.appearance) {
      character.appearance = this.generateAppearance(
        character.culture,
        character.pronouns
      );
    }

    return character;
  }

  // Create A Culture
  generateCulture(): Culture {
    return Culture.Prole;
  }

  // Create Pronouns
  generatePronouns(culture: Culture): Pronouns {
    const data = getCultureData(culture);
    let options = new Map<string, number>();
    for (const key of Object.keys(data)) {
      options.set(key, data[key as keyof CultureData].chance);
    }

    return getRandomWeighted(options) as Pronouns;
  }

  // Create A Name
  generateName(culture: Culture, pronouns: Pronouns): string {
    const data = getCultureData(culture);
    let potentialFirstNames: string[] = [];
    let potentialSecondNames: string[] = [];
    if (data[pronouns].firstNames.length === 0) {
      // if the array is empty default to they/them
      potentialFirstNames = data.They.firstNames;
    } else {
      potentialFirstNames = data[pronouns].firstNames;
    }

    if (data[pronouns].secondNames.length === 0) {
      // if the array is empty default to they/them
      potentialSecondNames = data.They.secondNames;
    } else {
      potentialSecondNames = data[pronouns].secondNames;
    }

    return `${getRandom(potentialFirstNames)} ${getRandom(
      potentialSecondNames
    )}`;
  }

  // Create A Demeanor
  generateDemeanor(): string {
    return getRandom(Demeanor.Entries);
  }

  // Create A Goal
  generateGoal(): string {
    return getRandom(Goals.Entries);
  }

  // Create A Quirk
  generateQuirk(): string {
    return getRandom(Quirks.Entries);
  }

  // Create An Appearance
  generateAppearance(culture: Culture, pronouns: Pronouns): string {
    // get 1 to 3 appearance traits
    let appearance = getRandom(Appearance.Entries);
    let roll = Math.floor(Math.random() * 100);
    if (roll < 20) {
      appearance = `${appearance}, ${getRandom(Appearance.Entries)}`;
    }
    if (roll < 60) {
      `${appearance}, ${getRandom(Appearance.Entries)}`;
    }

    const data = getCultureData(culture);
    let potentialEyes: string[] = [];
    let potentialHair: string[] = [];
    let potentialHairColour: string[] = [];
    if (data[pronouns].hair.length === 0) {
      // if the array is empty default to they/them
      potentialHair = data.They.hair;
    } else {
      potentialHair = data[pronouns].hair;
    }

    if (data[pronouns].hairColour.length === 0) {
      // if the array is empty default to they/them
      potentialHairColour = data.They.hairColour;
    } else {
      potentialHairColour = data[pronouns].hairColour;
    }

    if (data[pronouns].eyes.length === 0) {
      // if the array is empty default to they/them
      potentialEyes = data.They.eyes;
    } else {
      potentialEyes = data[pronouns].eyes;
    }

    return `${getRandom(potentialHair)} ${getRandom(
      potentialHairColour
    )} hair, ${getRandom(potentialEyes)} eyes, ${appearance}`;
  }

  // Convert Pronoun Enum To Value
  convertPronouns(pronoun?: Pronouns): string {
    switch (pronoun) {
      case Pronouns.He:
        return "He/Him";
      case Pronouns.She:
        return "She/Her";
      case Pronouns.They:
        return "They/Them";
      case Pronouns.Hey:
        return "He/They";
      case Pronouns.Shey:
        return "She/They";
      case Pronouns.It:
        return "It/Its";
    }

    return "They/Them";
  }
}
