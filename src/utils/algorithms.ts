import { PlantProfile } from "./profiles";

// Restricts a value to be within a range
export const constrain = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, val));
};

// Maps a value from one range to another
export const mapVal = (
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  if (inMax === inMin) return outMin;
  return ((val - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// Algorithm 1: Health Score (Weighted Sensor Fusion)
// Moisture Score: 50% weight
export const calculateMoistureScore = (raw: number, profile: PlantProfile): number => {
  if (raw >= profile.moistureMin && raw <= profile.moistureMax) {
    return 100;
  }
  if (raw < profile.moistureMin) {
    // Overwatering range (0 to moistureMin)
    // 0 is extreme overwatering (0 score), moistureMin is perfect (100 score)
    return Math.round(constrain(mapVal(raw, 0, profile.moistureMin, 0, 100), 0, 100));
  }
  // Underwatering range (moistureMax to 4095)
  // moistureMax is perfect (100 score), 4095 is bone dry (0 score)
  return Math.round(constrain(mapVal(raw, profile.moistureMax, 4095, 100, 0), 0, 100));
};

// Temperature Score: 30% weight
export const calculateTempScore = (t: number, profile: PlantProfile): number => {
  if (t >= profile.tempMin && t <= profile.tempMax) {
    return 100;
  }
  if (t < profile.tempMin) {
    // Under-temperature: subtracts 5 points per degree below min
    return Math.round(constrain(100 - (profile.tempMin - t) * 5, 0, 100));
  }
  // Over-temperature: subtracts 5 points per degree above max
  return Math.round(constrain(100 - (t - profile.tempMax) * 5, 0, 100));
};

// Light Score: 20% weight
export const calculateLightScore = (raw: number, profile: PlantProfile): number => {
  if (raw >= profile.lightMin && raw <= profile.lightMax) {
    return 100;
  }
  if (raw < profile.lightMin) {
    // Too dark: 0 is pitch black (0 score), lightMin is perfect (100 score)
    return Math.round(constrain(mapVal(raw, 0, profile.lightMin, 0, 100), 0, 100));
  }
  // Too bright: lightMax is perfect (100 score), 1023 is blinding light (0 score)
  return Math.round(constrain(mapVal(raw, profile.lightMax, 1023, 100, 0), 0, 100));
};

// Fuses the three scores into a single composite health score (0-100)
export const calculateHealthScore = (
  moistureRaw: number,
  tempC: number,
  lightRaw: number,
  profile: PlantProfile
): number => {
  const mScore = calculateMoistureScore(moistureRaw, profile);
  const tScore = calculateTempScore(tempC, profile);
  const lScore = calculateLightScore(lightRaw, profile);
  
  return Math.round(mScore * 0.5 + tScore * 0.3 + lScore * 0.2);
};

// Algorithm 2: Anomaly Detection (Adaptive Baseline)
// Checks if a reading deviates by more than 25% from the rolling average (baseline)
export const isAnomaly = (currentVal: number, baselineVal: number): boolean => {
  if (baselineVal === 0) return false;
  return Math.abs(currentVal - baselineVal) > baselineVal * 0.25;
};

// Algorithm 3: Predictive Watering Window
// Extrapolates moisture drying rate to predict hours remaining until critical dry threshold
export const predictHoursToWatering = (
  currentMoisture: number,
  prevMoisture: number,
  elapsedHours: number,
  dryThreshold: number // profile.moistureMax is used as the dry threshold
): number => {
  // If the plant is already drier than the dry threshold, it needs water now
  if (currentMoisture >= dryThreshold) return 0;
  
  // If no time has elapsed or no previous moisture recorded, we can't calculate rate yet
  if (elapsedHours <= 0 || prevMoisture === 0) return -1;
  
  // drying rate is raw moisture increase per hour (as raw value increases, soil gets drier)
  const dryingRate = (currentMoisture - prevMoisture) / elapsedHours;
  
  // If rate is <= 0, it means it is not drying (either watered recently or humidity is high)
  if (dryingRate <= 0) return -1;
  
  const hours = (dryThreshold - currentMoisture) / dryingRate;
  return Math.max(0, Math.round(hours));
};
