export interface PlantProfile {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  moistureMin: number; // raw value (lower is wetter)
  moistureMax: number; // raw value (higher is drier)
  tempMin: number;     // °C
  tempMax: number;     // °C
  lightMin: number;    // raw value (lower is darker)
  lightMax: number;    // raw value (higher is brighter)
  wateringInterval: string;
  placement: string;
}

export const PLANT_PROFILES: Record<string, PlantProfile> = {
  tulsi: {
    id: "tulsi",
    name: "Tulsi (Holy Basil)",
    scientificName: "Ocimum tenuiflorum",
    description: "Holy Basil (Tulsi) is a sacred, highly medicinal herb in Ayurveda. It thrives in warm temperatures, consistent moisture, and bright indirect sunlight.",
    moistureMin: 800,
    moistureMax: 1800,
    tempMin: 20,
    tempMax: 35,
    lightMin: 300,
    lightMax: 900,
    wateringInterval: "Every 2-3 days",
    placement: "Bright indirect sunlight / outdoors"
  },
  cactus: {
    id: "cactus",
    name: "Desert Cactus",
    scientificName: "Cactaceae",
    description: "Adapted to extremely dry, hot environments. Highly sensitive to overwatering.",
    moistureMin: 1400, // Likes dry soil (raw value high)
    moistureMax: 2800, // Can tolerate very dry soil
    tempMin: 22,       // Warm temperature
    tempMax: 38,
    lightMin: 500,     // Loves bright direct light
    lightMax: 1000,
    wateringInterval: "Every 2-3 weeks",
    placement: "Direct afternoon sun"
  },
  fern: {
    id: "fern",
    name: "Boston Fern",
    scientificName: "Nephrolepis exaltata",
    description: "Thrives in rich, humid, moist conditions with indirect, filtered light.",
    moistureMin: 600,  // Likes wet soil (raw value low)
    moistureMax: 1300, // Becomes stressed quickly if dry
    tempMin: 16,       // Prefers cooler temps
    tempMax: 24,
    lightMin: 150,     // Low to moderate indirect light
    lightMax: 450,
    wateringInterval: "Every 2-3 days",
    placement: "Indirect light / shaded corner"
  },
  rose: {
    id: "rose",
    name: "Miniature Rose",
    scientificName: "Rosa chinensis",
    description: "Requires consistent moisture and plenty of sunlight to bloom successfully.",
    moistureMin: 800,
    moistureMax: 1600,
    tempMin: 18,
    tempMax: 28,
    lightMin: 400,
    lightMax: 850,
    wateringInterval: "Every 4-5 days",
    placement: "Sunny windowsill"
  },
  tomato: {
    id: "tomato",
    name: "Cherry Tomato",
    scientificName: "Solanum lycopersicum",
    description: "Heavy feeder that needs high moisture, warm conditions, and maximum sunlight.",
    moistureMin: 700,
    moistureMax: 1500,
    tempMin: 20,
    tempMax: 32,
    lightMin: 600,
    lightMax: 950,
    wateringInterval: "Every 2-3 days",
    placement: "Direct sunlight / outdoor balcony"
  },
  money_plant: {
    id: "money_plant",
    name: "Money Plant",
    scientificName: "Epipremnum aureum",
    description: "Extremely resilient plant that tolerates low light and occasional underwatering.",
    moistureMin: 900,
    moistureMax: 1800,
    tempMin: 18,
    tempMax: 30,
    lightMin: 200,
    lightMax: 600,
    wateringInterval: "Every 7-10 days",
    placement: "Indirect sunlight / indoors"
  }
};
