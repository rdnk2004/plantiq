'use client';

import { use, useEffect, useState } from "react";
import { useSimulation } from "@/utils/simulationState";
import { PLANT_PROFILES } from "@/utils/profiles";
import { 
  calculateMoistureScore, 
  calculateTempScore, 
  calculateLightScore 
} from "@/utils/algorithms";
import styles from "@/app/passport.module.css";
import { 
  Droplet, 
  Thermometer, 
  Sun, 
  Clock, 
  AlertTriangle, 
  HeartPulse, 
  Compass, 
  CheckCircle,
  WifiOff
} from "lucide-react";

interface PageProps {
  params: Promise<{ plantId: string }>;
}

export default function PassportPage({ params }: PageProps) {
  // Use React's `use` hook to read the params promise (Next.js 15+ convention)
  const resolvedParams = use(params);
  const rawPlantId = resolvedParams.plantId;
  
  // Validate plantId, fallback to money_plant if invalid
  const plantId = PLANT_PROFILES[rawPlantId] ? rawPlantId : "money_plant";
  
  const { 
    state, 
    profile, 
    healthScore, 
    predictedHours, 
    waterPlant 
  } = useSimulation(plantId);

  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div className={styles.scoreLabel}>Loading Plant Passport...</div>
        </div>
      </div>
    );
  }

  // Get status class and text
  let statusText = "Thriving";
  let statusClass = styles.badgeThriving;
  let scoreColor = "#10b981"; // emerald

  if (healthScore < 40) {
    statusText = "Critical";
    statusClass = styles.badgeCritical;
    scoreColor = "#ef4444"; // red
  } else if (healthScore < 80) {
    statusText = "Needs Attention";
    statusClass = styles.badgeAttention;
    scoreColor = "#f59e0b"; // amber
  }

  // Formatting date/time helper
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Just now";
    }
  };

  // SVG Progress Ring Calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  // Individual sensor status helpers
  const getMoistureStatus = (raw: number) => {
    if (raw < profile.moistureMin) return { text: "Wet / Over", type: styles.statusWarning };
    if (raw > profile.moistureMax) return { text: "Too Dry", type: styles.statusAlert };
    return { text: "Ideal", type: styles.statusIdeal };
  };

  const getTempStatus = (t: number) => {
    if (t < profile.tempMin) return { text: "Cold Stress", type: styles.statusAlert };
    if (t > profile.tempMax) return { text: "Heat Stress", type: styles.statusAlert };
    return { text: "Ideal", type: styles.statusIdeal };
  };

  const getLightStatus = (raw: number) => {
    if (raw < profile.lightMin) return { text: "Too Dark", type: styles.statusWarning };
    if (raw > profile.lightMax) return { text: "Too Bright", type: styles.statusWarning };
    return { text: "Ideal", type: styles.statusIdeal };
  };

  const moistureStatus = getMoistureStatus(state.moistureRaw);
  const tempStatus = getTempStatus(state.tempC);
  const lightStatus = getLightStatus(state.lightRaw);

  // Dynamic sparkline generator based on active healthScore to show stability
  const generateSparklinePath = () => {
    const baselineY = 20; // middle
    // Generate a set of points that ends at the current healthScore mapping
    const mappedScoreY = 30 - (healthScore / 100) * 25; // 5 to 30 range
    
    // Custom pseudo-random historical wave
    const points = [
      { x: 0, y: 15 },
      { x: 15, y: 12 },
      { x: 30, y: 18 },
      { x: 45, y: 8 },
      { x: 60, y: 22 },
      { x: 75, y: 14 },
      { x: 90, y: 18 },
      { x: 100, y: mappedScoreY }
    ];
    
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Header section */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <Compass size={24} style={{ color: '#34d399' }} />
            <h1 className={styles.title}>{profile.name}</h1>
          </div>
          <p className={styles.scientificName}>{profile.scientificName}</p>
          
          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${statusClass}`}>
              <HeartPulse size={12} />
              {statusText}
            </span>
            {state.isOffline && (
              <span className={`${styles.badge} ${styles.badgeCritical}`}>
                <WifiOff size={12} />
                Offline Mode
              </span>
            )}
          </div>
        </div>

        {/* Offline notification bar */}
        {state.isOffline && (
          <div className={styles.offlineAlert}>
            <AlertTriangle size={16} />
            <span>Failsafe Mode active: Storing data in local flash.</span>
          </div>
        )}

        {/* Radial Health Score Gauge */}
        <div className={styles.scoreContainer}>
          <svg className={styles.scoreCircle} width="140" height="140">
            <circle
              className={styles.scoreTrack}
              cx="70"
              cy="70"
              r={radius}
            />
            <circle
              className={styles.scoreValue}
              cx="70"
              cy="70"
              r={radius}
              stroke={scoreColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className={styles.scoreText}>
            <span className={styles.scoreNum}>{healthScore}</span>
            <span className={styles.scoreLabel}>Health IQ</span>
          </div>
        </div>

        {/* Prediction Window Info Box */}
        <div className={styles.predictions}>
          <div className={styles.predictionItem}>
            <div className={styles.predictionIcon}>
              <Clock size={18} />
            </div>
            <div className={styles.predictionText}>
              <span className={styles.predictionLabel}>Predictive Watering Window</span>
              <span className={styles.predictionVal}>
                {predictedHours === 0 
                  ? "Water immediately!" 
                  : predictedHours > 0 
                    ? `Needs water in ~${predictedHours} hours` 
                    : "Moisture levels stable"}
              </span>
            </div>
          </div>
          <div className={styles.predictionItem}>
            <div className={`${styles.predictionIcon} ${styles.predictionIconBlue}`}>
              <CheckCircle size={18} />
            </div>
            <div className={styles.predictionText}>
              <span className={styles.predictionLabel}>Last Watered</span>
              <span className={styles.predictionVal}>
                Today at {formatTime(state.lastWateredTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Live Sensors Grid */}
        <div className={styles.sensorGrid}>
          {/* Moisture Sensor Card */}
          <div className={styles.sensorCard}>
            <div className={styles.sensorInfo}>
              <div className={styles.sensorIconWrapper} style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)' }}>
                <Droplet size={20} />
              </div>
              <div className={styles.sensorMeta}>
                <span className={styles.sensorName}>Soil Hydration (Raw)</span>
                <span className={styles.sensorValue}>{state.moistureRaw}</span>
              </div>
            </div>
            <span className={`${styles.sensorStatus} ${moistureStatus.type}`}>
              {moistureStatus.text}
            </span>
          </div>

          {/* Temperature Sensor Card */}
          <div className={styles.sensorCard}>
            <div className={styles.sensorInfo}>
              <div className={styles.sensorIconWrapper} style={{ color: '#f87171', background: 'rgba(248, 113, 113, 0.1)' }}>
                <Thermometer size={20} />
              </div>
              <div className={styles.sensorMeta}>
                <span className={styles.sensorName}>Air Temperature</span>
                <span className={styles.sensorValue}>{state.tempC}°C</span>
              </div>
            </div>
            <span className={`${styles.sensorStatus} ${tempStatus.type}`}>
              {tempStatus.text}
            </span>
          </div>

          {/* Light Sensor Card */}
          <div className={styles.sensorCard}>
            <div className={styles.sensorInfo}>
              <div className={styles.sensorIconWrapper} style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)' }}>
                <Sun size={20} />
              </div>
              <div className={styles.sensorMeta}>
                <span className={styles.sensorName}>Photosynthesis (Light)</span>
                <span className={styles.sensorValue}>{state.lightRaw}</span>
              </div>
            </div>
            <span className={`${styles.sensorStatus} ${lightStatus.type}`}>
              {lightStatus.text}
            </span>
          </div>
        </div>

        {/* Dynamic Sparkline Chart */}
        <div className={styles.sparklineSection}>
          <div className={styles.sparklineHeader}>
            <h3 className={styles.sparklineTitle}>7-Day Health Trend</h3>
            <span className={styles.sparklinePeriod}>Rolling Baseline</span>
          </div>
          <div className={styles.sparklineWrapper}>
            <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d={generateSparklinePath()}
                fill="none"
                stroke="url(#sparklineGradient2)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="sparklineGradient2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor={scoreColor} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Action Button */}
        <button className={styles.waterButton} onClick={waterPlant}>
          <Droplet size={18} fill="white" />
          Water Plant (Simulate)
        </button>

        {/* Plant Species Profile Card */}
        <div className={styles.profileSection}>
          <h3 className={styles.profileTitle}>Species Profile</h3>
          <p className={styles.profileDesc}>{profile.description}</p>
          
          <div className={styles.profileDetails}>
            <div className={styles.profileDetailItem}>
              <span className={styles.profileDetailLabel}>Water Frequency</span>
              <span className={styles.profileDetailVal}>{profile.wateringInterval}</span>
            </div>
            <div className={styles.profileDetailItem}>
              <span className={styles.profileDetailLabel}>Best Placement</span>
              <span className={styles.profileDetailVal}>{profile.placement}</span>
            </div>
            <div className={styles.profileDetailItem} style={{ marginTop: '0.5rem' }}>
              <span className={styles.profileDetailLabel}>Ideal Temperature</span>
              <span className={styles.profileDetailVal}>{profile.tempMin}°C - {profile.tempMax}°C</span>
            </div>
            <div className={styles.profileDetailItem} style={{ marginTop: '0.5rem' }}>
              <span className={styles.profileDetailLabel}>Ideal Light Range</span>
              <span className={styles.profileDetailVal}>{profile.lightMin} - {profile.lightMax}</span>
            </div>
          </div>
        </div>

      </div>
      <div className={styles.footer}>
        PlantIQ IoT Smart Plant Passport • Powered by ESP32
      </div>
    </div>
  );
}
