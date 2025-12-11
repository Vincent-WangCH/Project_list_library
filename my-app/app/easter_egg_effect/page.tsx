"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { HomeButton } from "../components/HomeButton";

// Types
type Mode = "line" | "tree" | "heart";

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  opacity: number;
  velocityX: number;
  velocityY: number;
  type: "main" | "decoration";
  decorationType?: "snowflake" | "ornament" | "sparkle";
}

// Color palettes for different modes
const colorPalettes = {
  line: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"],
  tree: ["#DC2626", "#16A34A", "#EAB308", "#FFFFFF", "#22C55E"],
  heart: ["#EC4899", "#F472B6", "#F9A8D4", "#FB7185", "#E11D48"],
};

// Helper to generate random number in range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate particles for Line mode
function generateLineParticles(
  width: number,
  height: number,
  count: number
): Particle[] {
  const particles: Particle[] = [];
  const centerY = height / 2;
  const lineLength = width * 0.7;
  const startX = (width - lineLength) / 2;

  for (let i = 0; i < count; i++) {
    const progress = i / count;
    const x = startX + progress * lineLength;
    // Size: thicker in middle, thinner at edges
    const distFromCenter = Math.abs(progress - 0.5) * 2;
    const baseSize = 8 - distFromCenter * 6 + random(0, 2);
    // Add some vertical scatter at edges (shattered effect)
    const scatter = distFromCenter * 30;
    const y = centerY + random(-scatter, scatter);

    particles.push({
      id: i,
      x: random(0, width),
      y: random(0, height),
      targetX: x,
      targetY: y,
      size: Math.max(2, baseSize),
      color: colorPalettes.line[Math.floor(random(0, colorPalettes.line.length))],
      opacity: 1 - distFromCenter * 0.3,
      velocityX: 0,
      velocityY: 0,
      type: "main",
    });
  }

  // Add decorative particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      id: count + i,
      x: random(0, width),
      y: random(0, height),
      targetX: random(startX - 50, startX + lineLength + 50),
      targetY: centerY + random(-80, 80),
      size: random(1, 3),
      color: colorPalettes.line[Math.floor(random(0, colorPalettes.line.length))],
      opacity: random(0.3, 0.7),
      velocityX: random(-0.5, 0.5),
      velocityY: random(-0.5, 0.5),
      type: "decoration",
      decorationType: "sparkle",
    });
  }

  return particles;
}

// Generate particles for Christmas Tree mode
function generateTreeParticles(
  width: number,
  height: number,
  count: number
): Particle[] {
  const particles: Particle[] = [];
  const centerX = width / 2;
  const treeHeight = height * 0.7;
  const treeTop = height * 0.1;
  const treeBottom = treeTop + treeHeight;
  const maxWidth = width * 0.4;

  // Spiral formation for tree
  for (let i = 0; i < count; i++) {
    const progress = i / count;
    const heightProgress = progress;
    const currentY = treeTop + heightProgress * treeHeight;
    const currentWidth = (heightProgress * maxWidth) / 2;
    // Spiral angle
    const angle = progress * Math.PI * 8;
    const radius = currentWidth * Math.sin(angle * 0.5 + Math.PI / 2);
    const x = centerX + radius * Math.cos(angle);

    const isGreen = i % 3 !== 0;
    const color = isGreen
      ? colorPalettes.tree[Math.floor(random(1, 3))]
      : colorPalettes.tree[Math.floor(random(0, colorPalettes.tree.length))];

    particles.push({
      id: i,
      x: random(0, width),
      y: random(0, height),
      targetX: x,
      targetY: currentY,
      size: random(3, 6),
      color,
      opacity: random(0.7, 1),
      velocityX: 0,
      velocityY: 0,
      type: "main",
    });
  }

  // Add snowflakes and ornaments
  for (let i = 0; i < 40; i++) {
    const isSnowflake = i < 25;
    particles.push({
      id: count + i,
      x: random(0, width),
      y: random(0, height),
      targetX: random(0, width),
      targetY: random(0, height),
      size: isSnowflake ? random(2, 4) : random(4, 8),
      color: isSnowflake ? "#FFFFFF" : colorPalettes.tree[Math.floor(random(0, 2))],
      opacity: random(0.5, 0.9),
      velocityX: isSnowflake ? random(-0.3, 0.3) : 0,
      velocityY: isSnowflake ? random(0.5, 1.5) : 0,
      type: "decoration",
      decorationType: isSnowflake ? "snowflake" : "ornament",
    });
  }

  return particles;
}

// Generate particles for Heart mode
function generateHeartParticles(
  width: number,
  height: number,
  count: number
): Particle[] {
  const particles: Particle[] = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width, height) * 0.012;

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    // Heart parametric equations
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );

    particles.push({
      id: i,
      x: random(0, width),
      y: random(0, height),
      targetX: centerX + x * scale,
      targetY: centerY + y * scale,
      size: random(3, 6),
      color: colorPalettes.heart[Math.floor(random(0, colorPalettes.heart.length))],
      opacity: random(0.7, 1),
      velocityX: 0,
      velocityY: 0,
      type: "main",
    });
  }

  // Add romantic sparkles
  for (let i = 0; i < 30; i++) {
    particles.push({
      id: count + i,
      x: random(0, width),
      y: random(0, height),
      targetX: centerX + random(-150, 150),
      targetY: centerY + random(-150, 150),
      size: random(1, 3),
      color: colorPalettes.heart[Math.floor(random(0, colorPalettes.heart.length))],
      opacity: random(0.3, 0.6),
      velocityX: random(-0.3, 0.3),
      velocityY: random(-0.3, 0.3),
      type: "decoration",
      decorationType: "sparkle",
    });
  }

  return particles;
}

// Mode Toggle Component
function ModeToggle({
  currentMode,
  onModeChange,
  isTransitioning,
}: {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  isTransitioning: boolean;
}) {
  const modes: { id: Mode; label: string; emoji: string }[] = [
    { id: "line", label: "Line", emoji: "✨" },
    { id: "tree", label: "Tree", emoji: "🎄" },
    { id: "heart", label: "Heart", emoji: "💕" },
  ];

  return (
    <div
      className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-sm rounded-xl p-2 flex gap-1"
      style={{ pointerEvents: isTransitioning ? "none" : "auto" }}
    >
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          disabled={isTransitioning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            currentMode === mode.id
              ? "bg-white text-gray-900 shadow-lg"
              : "text-white hover:bg-white/20"
          } ${isTransitioning ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span>{mode.emoji}</span>
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
}

// Featured Image Component (displayed at center/top of formations)
function FeaturedImage({
  mode,
  isTransitioning,
}: {
  mode: Mode;
  isTransitioning: boolean;
}) {
  const getPosition = () => {
    switch (mode) {
      case "tree":
        return { top: "8%", left: "50%", transform: "translateX(-50%)" };
      case "heart":
        return { top: "35%", left: "50%", transform: "translateX(-50%)" };
      default:
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  };

  const getSize = () => {
    switch (mode) {
      case "tree":
        return "w-16 h-16";
      case "heart":
        return "w-20 h-20";
      default:
        return "w-24 h-24";
    }
  };

  const position = getPosition();

  return (
    <div
      className={`absolute z-20 transition-all duration-1000 ease-in-out ${
        isTransitioning ? "opacity-50 scale-90" : "opacity-100 scale-100"
      }`}
      style={position}
    >
      <div
        className={`${getSize()} rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-2xl transition-all duration-1000`}
        style={{
          boxShadow:
            mode === "tree"
              ? "0 0 30px 10px rgba(234, 179, 8, 0.6)"
              : mode === "heart"
              ? "0 0 30px 10px rgba(236, 72, 153, 0.6)"
              : "0 0 30px 10px rgba(139, 92, 246, 0.6)",
        }}
      >
        <span className="text-3xl">
          {mode === "tree" ? "⭐" : mode === "heart" ? "💖" : "✨"}
        </span>
      </div>
    </div>
  );
}

// Main Page Component
export default function EasterEggEffectPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const [mode, setMode] = useState<Mode>("line");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles based on mode
  const initializeParticles = useCallback(
    (newMode: Mode) => {
      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      const particleCount = 200;
      switch (newMode) {
        case "tree":
          particlesRef.current = generateTreeParticles(width, height, particleCount);
          break;
        case "heart":
          particlesRef.current = generateHeartParticles(width, height, particleCount);
          break;
        default:
          particlesRef.current = generateLineParticles(width, height, particleCount);
      }
    },
    [dimensions]
  );

  // Handle mode change with transition
  const handleModeChange = useCallback(
    (newMode: Mode) => {
      if (newMode === mode || isTransitioning) return;

      setIsTransitioning(true);

      // Generate new target positions
      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      const particleCount = 200;
      let newTargets: Particle[];

      switch (newMode) {
        case "tree":
          newTargets = generateTreeParticles(width, height, particleCount);
          break;
        case "heart":
          newTargets = generateHeartParticles(width, height, particleCount);
          break;
        default:
          newTargets = generateLineParticles(width, height, particleCount);
      }

      // Update existing particles with new targets and colors
      particlesRef.current = particlesRef.current.map((particle, index) => {
        if (index < newTargets.length) {
          return {
            ...particle,
            targetX: newTargets[index].targetX,
            targetY: newTargets[index].targetY,
            color: newTargets[index].color,
            size: newTargets[index].size,
            opacity: newTargets[index].opacity,
            type: newTargets[index].type,
            decorationType: newTargets[index].decorationType,
            velocityX: newTargets[index].velocityX,
            velocityY: newTargets[index].velocityY,
          };
        }
        return particle;
      });

      // Add any extra particles needed
      if (newTargets.length > particlesRef.current.length) {
        for (let i = particlesRef.current.length; i < newTargets.length; i++) {
          particlesRef.current.push(newTargets[i]);
        }
      }

      setMode(newMode);

      // End transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1500);
    },
    [mode, isTransitioning, dimensions]
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize particles when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeParticles(mode);
    }
  }, [dimensions, initializeParticles, mode]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Smooth interpolation towards target
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const easing = 0.03;

        particle.x += dx * easing + particle.velocityX;
        particle.y += dy * easing + particle.velocityY;

        // Handle decoration particles (floating/falling)
        if (particle.type === "decoration") {
          if (particle.decorationType === "snowflake") {
            // Snowflakes fall and reset
            if (particle.y > canvas.height) {
              particle.y = -10;
              particle.x = random(0, canvas.width);
            }
          } else {
            // Sparkles float around
            particle.x += Math.sin(Date.now() * 0.002 + particle.id) * 0.3;
            particle.y += Math.cos(Date.now() * 0.002 + particle.id) * 0.3;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Add glow effect for main particles
        if (particle.type === "main") {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 2
          );
          gradient.addColorStop(0, particle.color + "40");
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Draw special shapes for decorations
        if (particle.decorationType === "snowflake") {
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          ctx.globalAlpha = particle.opacity * 0.5;
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(
              particle.x + Math.cos(angle) * particle.size * 2,
              particle.y + Math.sin(angle) * particle.size * 2
            );
            ctx.stroke();
          }
        }

        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions]);

  // Get background gradient based on mode
  const getBackgroundGradient = () => {
    switch (mode) {
      case "tree":
        return "from-slate-900 via-green-950 to-slate-900";
      case "heart":
        return "from-pink-950 via-rose-900 to-pink-950";
      default:
        return "from-violet-950 via-purple-900 to-violet-950";
    }
  };

  return (
    <main
      className={`relative w-screen h-screen overflow-hidden bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000`}
    >
      {/* Home button */}
      <HomeButton variant="glass" />

      {/* Mode Toggle */}
      <ModeToggle
        currentMode={mode}
        onModeChange={handleModeChange}
        isTransitioning={isTransitioning}
      />

      {/* Title */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 text-center">
        <div className="flex items-center gap-2 text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">
            {mode === "tree"
              ? "Christmas Tree Mode"
              : mode === "heart"
              ? "Valentine's Day Mode"
              : "Line Mode"}
          </span>
          <Sparkles className="w-5 h-5" />
        </div>
        {isTransitioning && (
          <div className="mt-2 text-white/60 text-xs animate-pulse">
            Transitioning...
          </div>
        )}
      </div>

      {/* Featured Image/Star */}
      <FeaturedImage mode={mode} isTransitioning={isTransitioning} />

      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 10 }}
      />

      {/* Ambient background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
            mode === "tree"
              ? "bg-green-500/10"
              : mode === "heart"
              ? "bg-pink-500/10"
              : "bg-purple-500/10"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
            mode === "tree"
              ? "bg-red-500/10"
              : mode === "heart"
              ? "bg-rose-500/10"
              : "bg-violet-500/10"
          }`}
        />
      </div>
    </main>
  );
}


