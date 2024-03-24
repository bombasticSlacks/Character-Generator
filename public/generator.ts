// Generates A Collection Of Information To Represent A Character
import { Prole } from "./data/Prole.js";
import { Demeanor } from "./data/Demeanor.js";
import { Goals } from "./data/Goal.js";
import { Quirks } from "./data/Quirk.js";

interface CultureData {
  He: { chance: number; firstNames: string[]; secondNames: string[] };
  She: { chance: number; firstNames: string[]; secondNames: string[] };
  They: { chance: number; firstNames: string[]; secondNames: string[] };
  Hey: { chance: number; firstNames: string[]; secondNames: string[] };
  Shey: { chance: number; firstNames: string[]; secondNames: string[] };
  It: { chance: number; firstNames: string[]; secondNames: string[] };
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
}