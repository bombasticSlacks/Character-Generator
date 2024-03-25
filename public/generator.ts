// Generates A Collection Of Information To Represent A Character
import { Prole } from "./data/Prole.js";
import { Demeanor } from "./data/Demeanor.js";
import { Goals } from "./data/Goal.js";
import { Quirks } from "./data/Quirk.js";
import { Appearance } from "./data/Appearance.js";
import { Kaar } from "./data/Kaar.js";
import { Envoy } from "./data/Envoy.js";
import { IPC } from "./data/IPC.js";
import { Unborn } from "./data/Unborn.js";
interface PronounDetails {
  chance: number;
  firstNames: string[];
  secondNames: string[];
  hair: string[];
  hairColour: string[];
  eyes: string[];
}

interface PronounArrays {
  firstNames: string[];
  secondNames: string[];
  hair: string[];
  hairColour: string[];
  eyes: string[];
}

interface WeightedCulture {
  data: CultureData;
  weight: number;
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

const details = new Map<Culture, WeightedCulture>();
details.set(Culture.Prole, Prole);
details.set(Culture.Kaar, Kaar);
details.set(Culture.Envoy, Envoy);
details.set(Culture.IPC, IPC);
details.set(Culture.Unborn, Unborn);

function getCultureData(culture: Culture): CultureData {
  const cd = details.get(culture);
  if (!cd) {
    throw new TypeError();
  }
  return cd.data;
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

// Get the expected table, the fallback (they) or fallback to the prole info
function getTable(
  culture: Culture,
  pronouns: Pronouns,
  accessor: keyof PronounArrays
): string[] {
  const data = getCultureData(culture);
  if (data[pronouns][accessor].length !== 0) {
    return data[pronouns][accessor];
  } else if (data[Pronouns.They][accessor].length !== 0) {
    return data[Pronouns.They][accessor];
  } else {
    const proleData = getCultureData(Culture.Prole);
    if (proleData[pronouns][accessor].length !== 0) {
      return proleData[pronouns][accessor];
    } else if (proleData[Pronouns.They][accessor].length !== 0) {
      return proleData[Pronouns.They][accessor];
    }
  }

  // somehow failed return nothing
  return [];
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
    const selection = new Map<string, number>();
    for (const value of details.entries()) {
      selection.set(value[0], value[1].weight);
    }
    return getRandomWeighted(selection) as Culture;
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
    let potentialFirstNames = getTable(culture, pronouns, "firstNames");
    let potentialSecondNames = getTable(culture, pronouns, "secondNames");

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
    let potentialEyes = getTable(culture, pronouns, "eyes");
    let potentialHair = getTable(culture, pronouns, "hair");
    let potentialHairColour = getTable(culture, pronouns, "hairColour");

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
