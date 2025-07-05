export interface Rune {
  id: string;
  symbol: string;
  name: string;
  meaning: string;
  description: string;
}

export const runes: Rune[] = [
  {
    id: "fehu",
    symbol: "ᚠ",
    name: "Fehu",
    meaning: "Cattle, Wealth, Prosperity",
    description: "Represents material wealth, abundance, and the power of creation. It symbolizes the energy of manifestation and the flow of resources in your life."
  },
  {
    id: "uruz",
    symbol: "ᚢ",
    name: "Uruz",
    meaning: "Aurochs, Strength, Vitality",
    description: "Embodies raw strength, primal energy, and the power of transformation. It represents the wild, untamed force within and the courage to face challenges."
  },
  {
    id: "thurisaz",
    symbol: "ᚦ",
    name: "Thurisaz",
    meaning: "Thorn, Protection, Defense",
    description: "Symbolizes protection, defense, and the power to overcome obstacles. It represents the warrior spirit and the ability to defend what is important."
  },
  {
    id: "ansuz",
    symbol: "ᚨ",
    name: "Ansuz",
    meaning: "God, Communication, Wisdom",
    description: "Represents divine wisdom, communication, and the power of words. It symbolizes inspiration, knowledge, and the connection to higher consciousness."
  },
  {
    id: "raidho",
    symbol: "ᚱ",
    name: "Raidho",
    meaning: "Journey, Travel, Movement",
    description: "Embodies the journey of life, both physical and spiritual. It represents progress, movement forward, and the path of personal development."
  },
  {
    id: "kenaz",
    symbol: "ᚲ",
    name: "Kenaz",
    meaning: "Torch, Knowledge, Creativity",
    description: "Symbolizes the light of knowledge, creativity, and inspiration. It represents the fire of transformation and the power to illuminate the path ahead."
  },
  {
    id: "gebo",
    symbol: "ᚷ",
    name: "Gebo",
    meaning: "Gift, Exchange, Partnership",
    description: "Represents the sacred exchange of gifts, partnerships, and the balance of giving and receiving. It symbolizes harmony and mutual respect."
  },
  {
    id: "wunjo",
    symbol: "ᚹ",
    name: "Wunjo",
    meaning: "Joy, Harmony, Bliss",
    description: "Embodies joy, harmony, and the fulfillment of desires. It represents the state of perfect happiness and the alignment of will with destiny."
  },
  {
    id: "hagalaz",
    symbol: "ᚺ",
    name: "Hagalaz",
    meaning: "Hail, Disruption, Change",
    description: "Symbolizes sudden change, disruption, and the forces of nature. It represents the necessary destruction that precedes creation and renewal."
  },
  {
    id: "naudhiz",
    symbol: "ᚾ",
    name: "Naudhiz",
    meaning: "Need, Necessity, Constraint",
    description: "Represents need, necessity, and the constraints that shape our character. It symbolizes the lessons learned through hardship and limitation."
  },
  {
    id: "isa",
    symbol: "ᛁ",
    name: "Isa",
    meaning: "Ice, Stillness, Patience",
    description: "Embodies stillness, patience, and the power of waiting. It represents the frozen moment and the need to pause before moving forward."
  },
  {
    id: "jera",
    symbol: "ᛃ",
    name: "Jera",
    meaning: "Harvest, Year, Cycle",
    description: "Symbolizes the harvest, the completion of cycles, and the rewards of patience. It represents the natural rhythm of life and the fruits of labor."
  },
  {
    id: "eihwaz",
    symbol: "ᛇ",
    name: "Eihwaz",
    meaning: "Yew Tree, Endurance, Death",
    description: "Represents the yew tree, endurance, and the cycle of death and rebirth. It symbolizes the strength to endure and the wisdom of transformation."
  },
  {
    id: "perthro",
    symbol: "ᛈ",
    name: "Perthro",
    meaning: "Dice Cup, Mystery, Fate",
    description: "Embodies mystery, fate, and the unknown. It represents the hidden aspects of life and the role of chance in our destiny."
  },
  {
    id: "algiz",
    symbol: "ᛉ",
    name: "Algiz",
    meaning: "Elk, Protection, Connection",
    description: "Symbolizes protection, connection to the divine, and the power of spiritual defense. It represents the bridge between heaven and earth."
  },
  {
    id: "sowilo",
    symbol: "ᛋ",
    name: "Sowilo",
    meaning: "Sun, Success, Energy",
    description: "Represents the sun, success, and the life-giving energy that sustains all things. It symbolizes victory, power, and the force of will."
  },
  {
    id: "tiwaz",
    symbol: "ᛏ",
    name: "Tiwaz",
    meaning: "Tyr, Justice, Honor",
    description: "Embodies justice, honor, and the warrior's code. It represents the sacrifice for the greater good and the pursuit of truth and righteousness."
  },
  {
    id: "berkano",
    symbol: "ᛒ",
    name: "Berkano",
    meaning: "Birch, Growth, New Beginnings",
    description: "Symbolizes growth, new beginnings, and the nurturing energy of the earth. It represents fertility, renewal, and the power of creation."
  },
  {
    id: "ehwaz",
    symbol: "ᛖ",
    name: "Ehwaz",
    meaning: "Horse, Partnership, Movement",
    description: "Represents partnership, trust, and the power of movement. It symbolizes the bond between rider and horse, and the journey of cooperation."
  },
  {
    id: "mannaz",
    symbol: "ᛗ",
    name: "Mannaz",
    meaning: "Human, Community, Intelligence",
    description: "Embodies humanity, community, and the power of human intelligence. It represents the social nature of humans and the importance of relationships."
  },
  {
    id: "laguz",
    symbol: "ᛚ",
    name: "Laguz",
    meaning: "Water, Flow, Intuition",
    description: "Symbolizes water, flow, and the power of intuition. It represents the unconscious mind, emotions, and the ability to adapt to change."
  },
  {
    id: "ingwaz",
    symbol: "ᛜ",
    name: "Ingwaz",
    meaning: "Ing, Fertility, Completion",
    description: "Represents fertility, completion, and the power of the earth. It symbolizes the harvest of life's work and the fulfillment of potential."
  },
  {
    id: "dagaz",
    symbol: "ᛞ",
    name: "Dagaz",
    meaning: "Day, Awakening, Transformation",
    description: "Embodies the dawn, awakening, and the power of transformation. It represents the moment of enlightenment and the beginning of a new day."
  },
  {
    id: "othala",
    symbol: "ᛟ",
    name: "Othala",
    meaning: "Heritage, Home, Ancestors",
    description: "Symbolizes heritage, home, and the connection to ancestors. It represents the wisdom of the past and the foundation of family and tradition."
  }
];

export const getRandomRune = (): Rune => {
  const randomIndex = Math.floor(Math.random() * runes.length);
  return runes[randomIndex];
}; 