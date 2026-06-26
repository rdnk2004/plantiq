'use client';

import { useState, useEffect } from "react";
import { PLANT_PROFILES } from "@/utils/profiles";
import { useSimulation } from "@/utils/simulationState";
import { 
  calculateMoistureScore, 
  calculateTempScore, 
  calculateLightScore,
  constrain,
  mapVal
} from "@/utils/algorithms";
import styles from "@/app/dashboard.module.css";
import passportStyles from "@/app/passport.module.css"; // Reuse for phone preview
import { 
  Droplet, 
  Thermometer, 
  Sun, 
  AlertTriangle, 
  Compass, 
  HeartPulse, 
  Wifi, 
  WifiOff, 
  Send,
  Sparkles,
  Smartphone,
  QrCode,
  Globe,
  TrendingUp,
  Clock,
  Activity,
  Award
} from "lucide-react";

export default function DashboardPage() {
  const [activePlantId, setActivePlantId] = useState<string>("money_plant");
  const [mounted, setMounted] = useState(false);

  // Load simulation state for active plant
  const { 
    state, 
    profile, 
    healthScore, 
    predictedHours, 
    updateSensors, 
    waterPlant,
    resetSimulation
  } = useSimulation(activePlantId);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <h2 style={{ color: '#34d399' }}>Loading PlantIQ Dashboard...</h2>
        </div>
      </div>
    );
  }

  // Predefined scenario triggers
  const triggerScenario = (scenario: "dry" | "heat" | "blockage" | "overwater" | "perfect") => {
    if (state.isOffline) return; // ignore in offline mode
    
    switch (scenario) {
      case "perfect":
        updateSensors({
          moistureRaw: Math.round((profile.moistureMin + profile.moistureMax) / 2),
          tempC: Math.round((profile.tempMin + profile.tempMax) / 2),
          lightRaw: Math.round((profile.lightMin + profile.lightMax) / 2),
        });
        break;
      case "dry":
        // dry means high raw value
        updateSensors({
          moistureRaw: Math.min(4095, profile.moistureMax + 400),
        });
        break;
      case "overwater":
        // wet means low raw value
        updateSensors({
          moistureRaw: Math.max(0, profile.moistureMin - 400),
        });
        break;
      case "heat":
        updateSensors({
          tempC: profile.tempMax + 8,
          lightRaw: Math.min(1023, profile.lightMax + 100),
        });
        break;
      case "blockage":
        updateSensors({
          lightRaw: Math.max(0, profile.lightMin - 150),
        });
        break;
    }
  };

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return "Just now";
    }
  };

  // Score status configuration
  let scoreColor = "#10b981"; // green
  let statusText = "Thriving";
  let statusBadgeClass = passportStyles.badgeThriving;
  
  if (healthScore < 40) {
    scoreColor = "#ef4444"; // red
    statusText = "Critical";
    statusBadgeClass = passportStyles.badgeCritical;
  } else if (healthScore < 80) {
    scoreColor = "#f59e0b"; // amber
    statusText = "Needs Attention";
    statusBadgeClass = passportStyles.badgeAttention;
  }

  // Define dynamic QR link for the plant passport
  // When hosted on Vercel, it uses window.location.origin, otherwise falls back
  const origin = typeof window !== "undefined" ? window.location.origin : "https://plantiq.vercel.app";
  const passportUrl = `${origin}/passport/${activePlantId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(passportUrl)}&color=0-30-23`;

  // Dynamic Weekly Telegram Report Text based on active states
  const generateTelegramReport = () => {
    const today = new Date();
    const startOfWeek = new Date(today.getTime() - 6 * 24 * 3600000);
    const dateStr = `${startOfWeek.getDate()}-${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}`;
    
    // Simulate some report analytics based on current sensor state
    const avgHealth = Math.round(healthScore * 0.95 + 3);
    const bestScore = Math.min(100, Math.max(88, healthScore + 5));
    
    let worstDay = "Friday (score 42 — heat stress at 38°C)";
    let dryAlerts = 0;
    let heatAlerts = 0;
    let overwaterAlerts = 0;
    let recommendations = "Water every 2 days.\nAvoid placing in direct afternoon sun.";

    if (activePlantId === "cactus") {
      worstDay = "Monday (score 72 — light blockage)";
      dryAlerts = 0;
      heatAlerts = 0;
      recommendations = "Excellent drought tolerance.\nEnsure maximum afternoon sun.";
    } else if (activePlantId === "fern") {
      worstDay = "Thursday (score 51 — dry soil alert)";
      dryAlerts = 2;
      recommendations = "Keep soil consistently damp.\nMist leaves to maintain humidity.";
    } else if (state.moistureRaw > profile.moistureMax) {
      worstDay = `Today (score ${healthScore} — dry soil alert)`;
      dryAlerts = 1;
      recommendations = "Water immediately to recover hydration.\nMaintain scheduled checkups.";
    } else if (state.tempC > profile.tempMax) {
      worstDay = `Today (score ${healthScore} — heat stress at ${state.tempC}°C)`;
      heatAlerts = 1;
      recommendations = "Move to shade to cool down.\nWater requirements will increase.";
    }

    return `PlantIQ Weekly Report — Plant: ${profile.name}
Week of ${dateStr}

Average health score: ${avgHealth}/100
Best day: Tuesday (score ${bestScore})
Worst day: ${worstDay}

Events this week:
• ${dryAlerts} dry soil alerts
• ${heatAlerts} heat stress events
• ${overwaterAlerts} overwatering events

Recommendation:
${recommendations}

Next predicted watering: ${predictedHours === 0 ? "Needed immediately!" : predictedHours > 0 ? `In ~${predictedHours} hours` : "Stable"}`;
  };

  // Mock historical points for ThingSpeak charts
  const renderMockLineChart = (type: "moisture" | "temp", activeVal: number, min: number, max: number) => {
    // Generate a nice baseline curve
    let points = [0.2, 0.25, 0.3, 0.45, 0.4, 0.35, 0.5, 0.6, 0.55, 0.7];
    
    // Scale active value to 0-1 range
    const activeScaled = (activeVal - min) / (max - min);
    points.push(activeScaled);

    // Map points to SVG height coordinates (SVG height is 60, range 0 to 50 for padding)
    const svgCoords = points.map((p, i) => {
      const x = i * 10;
      const y = 55 - p * 45; // scale and invert
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg width="100%" height="60" viewBox="0 0 100 60" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        {/* Shaded ideal band for temperature */}
        {type === "temp" && (
          <rect 
            x="0" 
            y={55 - ((profile.tempMax - min) / (max - min)) * 45} 
            width="100" 
            height={(((profile.tempMax - profile.tempMin) / (max - min)) * 45)} 
            fill="rgba(52, 211, 153, 0.08)"
          />
        )}
        <polyline
          fill="none"
          stroke={type === "moisture" ? "#60a5fa" : "#f87171"}
          strokeWidth="2"
          points={svgCoords}
        />
        <circle 
          cx="100" 
          cy={55 - activeScaled * 45} 
          r="4" 
          fill={type === "moisture" ? "#3b82f6" : "#ef4444"} 
        />
      </svg>
    );
  };

  // Mock bar chart for light sensor
  const lightPercent = Math.min(100, Math.round((state.lightRaw / 1023) * 100));

  return (
    <div className={styles.container}>
      
      {/* Upper presentation header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Activity size={32} style={{ color: '#34d399' }} />
          <div>
            <h1 className={styles.title}>PlantIQ</h1>
            <p className={styles.subtitle}>IoT-Based Smart Plant Health Monitoring System</p>
          </div>
        </div>
        <div className={styles.presentationBadge}>
          Live Presenter Mode
        </div>
      </header>

      {/* Metrics of Impact */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper}>
            <Droplet size={24} fill="#34d399" />
          </div>
          <div className={styles.statMeta}>
            <span className={styles.statVal}>~600 Litres</span>
            <span className={styles.statLabel}>Water Saved/Week (50 Plants)</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
            <HeartPulse size={24} />
          </div>
          <div className={styles.statMeta}>
            <span className={styles.statVal}>60% Reduction</span>
            <span className={styles.statLabel}>Preventable Plant Deaths</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' }}>
            <Clock size={24} />
          </div>
          <div className={styles.statMeta}>
            <span className={styles.statVal}>100% Automatic</span>
            <span className={styles.statLabel}>Manual Inspection Eliminated</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)' }}>
            <Award size={24} />
          </div>
          <div className={styles.statMeta}>
            <span className={styles.statVal}>UN SDGs</span>
            <span className={styles.statLabel}>Aligned with SDG 6, 2 & 15</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Sidebar simulator + analytics */}
      <div className={styles.mainLayout}>
        
        {/* Left Side: Simulator and controls */}
        <aside className={styles.sidebar}>
          
          {/* Plant Profiles Selector */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Compass size={18} />
              Plant Species Profiles
            </h2>
            <div className={styles.plantSelector}>
              {Object.values(PLANT_PROFILES).map((p) => (
                <button
                  key={p.id}
                  className={`${styles.plantBtn} ${activePlantId === p.id ? styles.plantBtnActive : ""}`}
                  onClick={() => setActivePlantId(p.id)}
                >
                  <span>{p.name}</span>
                  <span className={styles.plantBtnScientific}>{p.scientificName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sensor Input Simulator */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Activity size={18} />
              ESP32 Sensor Simulator
            </h2>
            
            <div className={styles.sliderGroup}>
              {/* Moisture Slider */}
              <div className={styles.sliderItem}>
                <div className={styles.sliderHeader}>
                  <span>Soil Moisture (Raw ADC)</span>
                  <span className={styles.sliderValue}>{state.moistureRaw}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4095"
                  className={styles.inputSlider}
                  value={state.moistureRaw}
                  disabled={state.isOffline}
                  onChange={(e) => updateSensors({ moistureRaw: parseInt(e.target.value) })}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b' }}>
                  <span>0 (Wet)</span>
                  <span>Ideal: {profile.moistureMin}-{profile.moistureMax}</span>
                  <span>4095 (Dry)</span>
                </div>
              </div>

              {/* Temp Slider */}
              <div className={styles.sliderItem}>
                <div className={styles.sliderHeader}>
                  <span>DHT22 Temperature</span>
                  <span className={styles.sliderValue}>{state.tempC}°C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="45"
                  step="0.5"
                  className={styles.inputSlider}
                  value={state.tempC}
                  disabled={state.isOffline}
                  onChange={(e) => updateSensors({ tempC: parseFloat(e.target.value) })}
                  style={{ accentColor: '#f87171' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b' }}>
                  <span>10°C</span>
                  <span>Ideal: {profile.tempMin}-{profile.tempMax}°C</span>
                  <span>45°C</span>
                </div>
              </div>

              {/* Light Slider */}
              <div className={styles.sliderItem}>
                <div className={styles.sliderHeader}>
                  <span>LDR Light Sensor (Raw)</span>
                  <span className={styles.sliderValue}>{state.lightRaw}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1023"
                  className={styles.inputSlider}
                  value={state.lightRaw}
                  disabled={state.isOffline}
                  onChange={(e) => updateSensors({ lightRaw: parseInt(e.target.value) })}
                  style={{ accentColor: '#fbbf24' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b' }}>
                  <span>0 (Dark)</span>
                  <span>Ideal: {profile.lightMin}-{profile.lightMax}</span>
                  <span>1023 (Blinding)</span>
                </div>
              </div>
            </div>

            {/* Quick Scenarios */}
            <div style={{ marginTop: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>Demo Scenarios</span>
              <div className={styles.scenarioGrid}>
                <button className={styles.scenarioBtn} onClick={() => triggerScenario("perfect")}>
                  Perfect Health
                </button>
                <button className={styles.scenarioBtn} onClick={() => triggerScenario("dry")}>
                  Extreme Dry Out
                </button>
                <button className={styles.scenarioBtn} onClick={() => triggerScenario("heat")}>
                  Summer Heatwave
                </button>
                <button className={styles.scenarioBtn} onClick={() => triggerScenario("blockage")}>
                  Light Blocked
                </button>
              </div>
            </div>

            {/* Simulated hardware controls */}
            <div className={styles.controlButtons}>
              <button className={styles.actionBtn} onClick={waterPlant}>
                <Droplet size={16} fill="white" />
                Water Plant (Trigger Relay)
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.toggleBtn} ${state.isOffline ? styles.toggleBtnActive : ""}`}
                onClick={() => updateSensors({ isOffline: !state.isOffline })}
              >
                {state.isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
                Toggle Hardware Wi-Fi
              </button>
            </div>

          </div>

        </aside>

        {/* Right Side: Visuals, Live phone preview, logs */}
        <main className={styles.dashboardContent}>
          
          {/* Row 1: ThingSpeak Visualizations */}
          <div className={styles.visualsGrid}>
            
            {/* Health Score Gauge */}
            <div className={styles.vizCard}>
              <h3 className={styles.vizTitle}>ThingSpeak: Health Score</h3>
              <div className={styles.gaugeContainer}>
                <span className={styles.gaugeNum} style={{ color: scoreColor }}>{healthScore}</span>
                <span className={styles.gaugeLabel}>composite index</span>
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.75rem' }}>
                  <span className={`${passportStyles.badge} ${statusBadgeClass}`} style={{ fontSize: '0.65rem' }}>
                    {statusText}
                  </span>
                </div>
              </div>
            </div>

            {/* Moisture Line Graph */}
            <div className={styles.vizCard}>
              <h3 className={styles.vizTitle}>ThingSpeak: Moisture Raw</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa' }}>{state.moistureRaw}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Capacitive ADC</span>
              </div>
              {renderMockLineChart("moisture", state.moistureRaw, 0, 4095)}
            </div>

            {/* Temperature Line Graph */}
            <div className={styles.vizCard}>
              <h3 className={styles.vizTitle}>ThingSpeak: Temperature</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>{state.tempC}°C</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>18°C-30°C Shaded Band</span>
              </div>
              {renderMockLineChart("temp", state.tempC, 10, 45)}
            </div>

            {/* Light Bar Chart */}
            <div className={styles.vizCard}>
              <h3 className={styles.vizTitle}>ThingSpeak: Light Level</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>{state.lightRaw}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Ideal: 300-900</span>
              </div>
              
              <div className={styles.barChart}>
                {[15, 30, 45, 60, 40, 50, 75, 90].map((h, i) => (
                  <div key={i} className={styles.barItem} style={{ height: `${h}%` }}></div>
                ))}
                {/* Active bar representing current light percentage */}
                <div 
                  className={`${styles.barItem} ${styles.barItemActive}`} 
                  style={{ height: `${lightPercent}%` }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    top: '-15px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    fontSize: '0.6rem',
                    color: '#fbbf24',
                    fontWeight: 'bold'
                  }}>
                    {lightPercent}%
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Live Smartphone View and System Logs */}
          <div className={styles.grid2Col}>
            
            {/* Column 1: iPhone Preview Frame and QR Code */}
            <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
              <h2 className={styles.cardTitle} style={{ alignSelf: 'stretch' }}>
                <Smartphone size={18} />
                QR Plant Passport Live Sync
              </h2>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* iPhone Simulator Frame */}
                <div className={styles.phoneContainer}>
                  <div className={styles.phoneScreen}>
                    {/* Render the passport view directly inside the simulated phone screen! */}
                    <iframe 
                      src={`/passport/${activePlantId}`} 
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title="Passport Live Preview"
                    />
                  </div>
                </div>

                {/* QR Code section */}
                <div className={styles.qrWidget}>
                  <div className={styles.qrCodeContainer}>
                    {/* Render dynamic QR code using free API */}
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      width="150" 
                      height="150" 
                      style={{ borderRadius: '6px' }}
                    />
                  </div>
                  <div className={styles.qrLabel}>
                    <p style={{ fontWeight: 700, margin: '0 0 0.25rem 0', color: '#e2e8f0' }}>Scan Pot QR Code</p>
                    <span style={{ fontSize: '0.75rem' }}>Open this live passport instantly on your smartphone. Updates in real-time.</span>
                  </div>
                  
                  {/* Quick link button for desktop convenience */}
                  <a 
                    href={passportUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles.scenarioBtn}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', color: '#10b981', borderColor: 'rgba(16,185,129,0.2)' }}
                  >
                    <Globe size={12} />
                    Open Passport in New Tab
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Stress Alert Logs and Weekly Report */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Alert Logs */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <AlertTriangle size={18} />
                  ESP32 Stress Event Log
                </h2>
                <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  <table className={styles.alertLogTable}>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Alert Type</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.alertHistory.slice(0, 8).map((alert) => {
                        let badgeColor = "#64748b";
                        if (alert.type === "dry" || alert.type === "cold") badgeColor = "#3b82f6";
                        else if (alert.type === "overwater") badgeColor = "#fbbf24";
                        else if (alert.type === "heat" || alert.type === "bright") badgeColor = "#ef4444";
                        else if (alert.type === "system") badgeColor = "#8b5cf6";
                        
                        return (
                          <tr key={alert.id}>
                            <td style={{ color: '#64748b', whiteSpace: 'nowrap' }}>{formatDate(alert.timestamp)}</td>
                            <td>
                              <span 
                                className={styles.alertTypeBadge} 
                                style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}
                              >
                                {alert.type}
                              </span>
                            </td>
                            <td style={{ color: '#e2e8f0' }}>{alert.message}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Weekly Telegram report */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>
                  <Send size={16} style={{ color: '#38bdf8' }} />
                  Weekly Telegram Report (Auto-Generated)
                </h2>
                <div className={styles.telegramReportTitle}>
                  <Sparkles size={12} />
                  Telegram Bot Broadcast Format
                </div>
                <div className={styles.telegramReport}>
                  {generateTelegramReport()}
                </div>
              </div>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}
