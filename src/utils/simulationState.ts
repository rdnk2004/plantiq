import { useState, useEffect, useCallback } from "react";
import { PlantProfile, PLANT_PROFILES } from "./profiles";
import { calculateHealthScore, predictHoursToWatering, isAnomaly } from "./algorithms";

export interface SimulationState {
  plantId: string;
  moistureRaw: number;
  tempC: number;
  lightRaw: number;
  isOffline: boolean;
  lastWateredTime: string; // ISO string
  offlineReadingsCount: number;
  alertHistory: Array<{
    id: string;
    timestamp: string;
    type: "dry" | "overwater" | "heat" | "cold" | "dark" | "bright" | "info" | "system";
    message: string;
  }>;
}

// Generate reasonable initial state for a plant profile
export const getInitialState = (plantId: string): SimulationState => {
  const profile = PLANT_PROFILES[plantId] || PLANT_PROFILES.money_plant;
  
  // Set initial values right in the middle of their ideal ranges
  const initialMoisture = Math.round((profile.moistureMin + profile.moistureMax) / 2);
  const initialTemp = Math.round((profile.tempMin + profile.tempMax) / 2);
  const initialLight = Math.round((profile.lightMin + profile.lightMax) / 2);

  return {
    plantId,
    moistureRaw: initialMoisture,
    tempC: initialTemp,
    lightRaw: initialLight,
    isOffline: false,
    lastWateredTime: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    offlineReadingsCount: 0,
    alertHistory: [
      {
        id: "init-" + Date.now(),
        timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
        type: "info",
        message: `System initialized for ${profile.name}. Calibration complete.`
      }
    ]
  };
};

const LOCAL_STORAGE_KEY_PREFIX = "plantiq_sim_";

export const useSimulation = (plantId: string) => {
  const profile = PLANT_PROFILES[plantId] || PLANT_PROFILES.money_plant;
  const storageKey = `${LOCAL_STORAGE_KEY_PREFIX}${plantId}`;

  const [state, setState] = useState<SimulationState>(() => {
    // Try server-side safe initialization
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse simulation state", e);
        }
      }
    }
    return getInitialState(plantId);
  });

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, storageKey]);

  // Sync state between tabs/windows on the same browser
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to sync storage change", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageKey]);

  // General update function
  const updateSensors = useCallback((updates: Partial<Pick<SimulationState, "moistureRaw" | "tempC" | "lightRaw" | "isOffline">>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      
      // Handle offline readings accumulation
      if (updates.isOffline === true) {
        newState.offlineReadingsCount = prev.offlineReadingsCount + 1;
        
        // Add offline warning alert if it just went offline
        if (!prev.isOffline) {
          newState.alertHistory = [
            {
              id: "offline-" + Date.now(),
              timestamp: new Date().toISOString(),
              type: "system",
              message: "Wi-Fi disconnected. Entering Offline Failsafe Mode. Storing readings in local flash."
            },
            ...prev.alertHistory
          ];
        }
      } else if (updates.isOffline === false && prev.isOffline) {
        // Just came back online
        newState.offlineReadingsCount = 0;
        newState.alertHistory = [
          {
            id: "online-" + Date.now(),
            timestamp: new Date().toISOString(),
            type: "system",
            message: `Wi-Fi reconnected. Batch uploaded ${prev.offlineReadingsCount} stored readings to cloud.`
          },
          ...prev.alertHistory
        ];
      }

      // Automatically trigger alerts if sensors cross thresholds (only when online)
      if (!newState.isOffline) {
        const alertsToAdd: SimulationState["alertHistory"] = [];
        
        // Check Moisture
        if (newState.moistureRaw > profile.moistureMax && prev.moistureRaw <= profile.moistureMax) {
          alertsToAdd.push({
            id: "dry-" + Date.now(),
            timestamp: new Date().toISOString(),
            type: "dry",
            message: `Dry Soil Alert: Moisture at ${newState.moistureRaw}. Water recommended.`
          });
        } else if (newState.moistureRaw < profile.moistureMin && prev.moistureRaw >= profile.moistureMin) {
          alertsToAdd.push({
            id: "overwater-" + Date.now(),
            timestamp: new Date().toISOString(),
            type: "overwater",
            message: `Overwatering Warning: Soil moisture is high (${newState.moistureRaw}).`
          });
        }

        // Check Temperature
        if (newState.tempC > profile.tempMax && prev.tempC <= profile.tempMax) {
          alertsToAdd.push({
            id: "heat-" + Date.now(),
            timestamp: new Date().toISOString(),
            type: "heat",
            message: `Heat Stress: Temperature reached ${newState.tempC}°C (Ideal max: ${profile.tempMax}°C).`
          });
        } else if (newState.tempC < profile.tempMin && prev.tempC >= profile.tempMin) {
          alertsToAdd.push({
            id: "cold-" + Date.now(),
            timestamp: new Date().toISOString(),
            type: "cold",
            message: `Cold Stress: Temperature dropped to ${newState.tempC}°C (Ideal min: ${profile.tempMin}°C).`
          });
        }

        // Check Light
        if (newState.lightRaw < profile.lightMin && prev.lightRaw >= profile.lightMin) {
          alertsToAdd.push({
            id: "dark-" + Date.now(),
            timestamp: new Date().toISOString(),
            type: "dark",
            message: `Light Deprivation: Light level is low (${newState.lightRaw}).`
          });
        } else if (newState.lightRaw > profile.lightMax && prev.lightRaw <= profile.lightMax) {
          alertsToAdd.push({
            id: "bright-" + Date.now(),
            timestamp: new Date().toISOString(),
            type: "bright",
            message: `Excessive Sunlight: Light level is high (${newState.lightRaw}).`
          });
        }

        if (alertsToAdd.length > 0) {
          newState.alertHistory = [...alertsToAdd, ...prev.alertHistory].slice(0, 50); // limit history
        }
      }

      return newState;
    });
  }, [profile]);

  // Water the plant action
  const waterPlant = useCallback(() => {
    setState((prev) => {
      // Set moisture back to a very healthy level (near moistureMin, which is wet but not overwatered)
      const healthyMoisture = Math.round(profile.moistureMin + (profile.moistureMax - profile.moistureMin) * 0.2);
      
      const newAlert = {
        id: "water-" + Date.now(),
        timestamp: new Date().toISOString(),
        type: "info" as const,
        message: `Plant watered. Moisture restored from ${prev.moistureRaw} to ${healthyMoisture}.`
      };

      return {
        ...prev,
        moistureRaw: healthyMoisture,
        lastWateredTime: new Date().toISOString(),
        alertHistory: [newAlert, ...prev.alertHistory].slice(0, 50)
      };
    });
  }, [profile]);

  // Periodic simulation loop (natural decay)
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        // 1. Soil slowly dries out over time (raw moisture value increases)
        // A standard drying speed, with a bit of randomness
        let moistureDelta = Math.round(1 + Math.random() * 2);
        
        // If the plant is already bone dry, don't exceed 4095
        let newMoisture = Math.min(4095, prev.moistureRaw + moistureDelta);

        // 2. Temperature fluctuates slightly around its current value
        let tempDelta = (Math.random() - 0.5) * 0.4;
        let newTemp = Math.round((prev.tempC + tempDelta) * 10) / 10;
        newTemp = constrainTemp(newTemp);

        // 3. Light fluctuates slightly based on noise
        let lightDelta = Math.round((Math.random() - 0.5) * 10);
        let newLight = Math.max(0, Math.min(1023, prev.lightRaw + lightDelta));

        // If offline, accumulate flash storage count
        const newOfflineCount = prev.isOffline ? prev.offlineReadingsCount + 1 : prev.offlineReadingsCount;

        return {
          ...prev,
          moistureRaw: newMoisture,
          tempC: newTemp,
          lightRaw: newLight,
          offlineReadingsCount: newOfflineCount
        };
      });
    }, 4000); // simulation tick every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Helper to keep temp within reasonable physical limits (10°C to 45°C) for the simulation
  const constrainTemp = (t: number) => Math.max(10, Math.min(45, t));

  // Compute stats on the fly
  const healthScore = calculateHealthScore(state.moistureRaw, state.tempC, state.lightRaw, profile);
  
  // Calculate predicted watering window based on current moisture and an assumed drying rate
  // Let's assume a slow drying rate in our simulation of about 20 raw units per hour (or compute it)
  // For the presentation, we can make this look realistic:
  const assumedDryingRateRawPerHour = 45; // raw units per hour
  const predictedHours = predictHoursToWatering(
    state.moistureRaw,
    state.moistureRaw - 5, // mock previous reading to show drying
    5 / assumedDryingRateRawPerHour,
    profile.moistureMax
  );

  return {
    state,
    profile,
    healthScore,
    predictedHours,
    updateSensors,
    waterPlant,
    resetSimulation: () => setState(getInitialState(plantId))
  };
};
