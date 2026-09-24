export const lunaraSignInCode = `import React, { useState, useRef, useCallback, useMemo, useId } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Utility: seeded pseudo-random generator so layout is stable        */
/*  across renders without relying on Math.random() during render.     */
/* ------------------------------------------------------------------ */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Starfield layer                                                    */
/* ------------------------------------------------------------------ */
const Stars = ({ count = 90, seed = 1, depth = 1 }) => {
  const stars = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 55,
      size: rand() * 1.6 + 0.4,
      baseOpacity: rand() * 0.5 + 0.35,
      duration: rand() * 4 + 2.5,
      delay: rand() * 5,
      drift: rand() * 10 - 5,
    }));
  }, [count, seed]);

  return (
    <div
      className="absolute inset-0"
      style={{ transform: \`translateZ(0)\`, willChange: "transform" }}
      aria-hidden="true"
    >
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: \`\${s.x}%\`,
            top: \`\${s.y}%\`,
            width: s.size,
            height: s.size,
            boxShadow: \`0 0 \${s.size * 3}px rgba(210,225,255,0.8)\`,
          }}
          animate={{
            opacity: [
              s.baseOpacity * 0.3,
              s.baseOpacity,
              s.baseOpacity * 0.3,
            ],
            x: [0, s.drift * depth, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Moon with animated bloom / halo / breathing glow                   */
/* ------------------------------------------------------------------ */
const Moon = ({ parallaxX, parallaxY }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        top: "8%",
        left: "50%",
        x: parallaxX,
        y: parallaxY,
        translateX: "-50%",
      }}
      initial={{ opacity: 0, scale: 0.7, y: -40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      <div className="relative w-40 h-40 sm:w-52 sm:h-52">
        {/* outer breathing halo */}
        <motion.div
          className="absolute -inset-16 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(190,210,255,0.25) 0%, rgba(150,180,255,0.08) 45%, rgba(0,0,0,0) 70%)",
            filter: "blur(6px)",
          }}
          animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* mid bloom */}
        <motion.div
          className="absolute -inset-6 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(225,235,255,0.55) 0%, rgba(190,210,255,0.18) 55%, rgba(0,0,0,0) 75%)",
            filter: "blur(2px)",
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* moon disk */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 32%, #ffffff 0%, #eef3ff 30%, #cddcf7 60%, #a9bfe8 100%)",
            boxShadow:
              "0 0 60px 10px rgba(200,215,255,0.55), inset -10px -10px 25px rgba(120,145,200,0.35), inset 6px 6px 18px rgba(255,255,255,0.6)",
          }}
        >
          {/* subtle craters */}
          <div
            className="absolute rounded-full opacity-30"
            style={{
              width: "18%",
              height: "18%",
              top: "28%",
              left: "22%",
              background:
                "radial-gradient(circle, rgba(140,160,205,0.6), transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full opacity-20"
            style={{
              width: "12%",
              height: "12%",
              top: "55%",
              left: "58%",
              background:
                "radial-gradient(circle, rgba(140,160,205,0.6), transparent 70%)",
            }}
          />
          <div
            className="absolute rounded-full opacity-20"
            style={{
              width: "9%",
              height: "9%",
              top: "62%",
              left: "30%",
              background:
                "radial-gradient(circle, rgba(140,160,205,0.5), transparent 70%)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Layered dune silhouettes (sky -> horizon depth stack)              */
/* ------------------------------------------------------------------ */
const DuneLayer = ({
  fill,
  path,
  parallaxX,
  parallaxYFactor = 1,
  className = "",
  opacity = 1,
}) => {
  const y = useTransform(parallaxX, (v) => v * parallaxYFactor * 0.15);
  return (
    <motion.svg
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      className={\`absolute bottom-0 left-0 w-full \${className}\`}
      style={{ x: parallaxX, y, opacity }}
      aria-hidden="true"
    >
      <path d={path} fill={fill} />
    </motion.svg>
  );
};

/* ------------------------------------------------------------------ */
/*  Camel caravan: walking silhouette group, loops across the ridge    */
/* ------------------------------------------------------------------ */
const Camel = ({ delay = 0 }) => {
  const legVariants = {
    walk: (i) => ({
      rotate: [0, 18, 0, -18, 0],
      transition: {
        duration: 1.1,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.18,
      },
    }),
  };

  return (
    <svg
      viewBox="0 0 100 60"
      width="46"
      height="28"
      className="overflow-visible"
    >
      {/* body bob */}
      <motion.g
        animate={{ y: [0, -2.4, 0] }}
        transition={{
          duration: 1.1,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {/* legs (behind body) */}
        {[18, 30, 62, 74].map((x, i) => (
          <motion.line
            key={i}
            x1={x}
            y1={38}
            x2={x}
            y2={56}
            stroke="#0b0e14"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transformOrigin: \`\${x}px 38px\` }}
            custom={i}
            variants={legVariants}
            animate="walk"
          />
        ))}
        {/* body + hump */}
        <path
          d="M12 40 Q10 24 26 22 Q30 10 42 12 Q50 4 58 12 Q66 8 70 18 Q84 18 86 34 Q88 40 80 42 L18 42 Q10 42 12 40 Z"
          fill="#0b0e14"
        />
        {/* neck + head */}
        <path
          d="M78 30 Q92 22 96 30 Q98 34 94 36 L86 38 Q80 36 78 30 Z"
          fill="#0b0e14"
        />
      </motion.g>
    </svg>
  );
};

const CaravanTrack = ({ progress }) => {
  const x = useTransform(progress, [0, 1], ["-15%", "115%"]);
  return (
    <motion.div
      className="absolute flex items-end gap-6"
      style={{ left: x, bottom: "9%" }}
      aria-hidden="true"
    >
      <Camel delay={0} />
      <Camel delay={0.15} />
      <Camel delay={0.3} />
      {/* trailing dust */}
      <motion.div
        className="absolute -left-4 bottom-0 w-16 h-3 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(210,200,180,0.35), transparent 70%)",
        }}
        animate={{ opacity: [0.2, 0.5, 0.2], scaleX: [0.8, 1.2, 0.8] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Drifting fog bands                                                 */
/* ------------------------------------------------------------------ */
const Fog = () => (
  <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden pointer-events-none" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute inset-x-0"
        style={{
          bottom: \`\${i * 12}%\`,
          height: "40%",
          background:
            "linear-gradient(to top, rgba(190,205,235,0.10), rgba(190,205,235,0))",
          filter: "blur(6px)",
        }}
        animate={{ x: i % 2 === 0 ? ["-4%", "4%", "-4%"] : ["4%", "-4%", "4%"] }}
        transition={{
          duration: 14 + i * 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Ambient drifting dust / sand particles                             */
/* ------------------------------------------------------------------ */
const DustParticles = ({ count = 26, seed = 7 }) => {
  const particles = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: rand() * 100,
      y: 40 + rand() * 55,
      size: rand() * 2.2 + 0.6,
      duration: rand() * 10 + 8,
      delay: rand() * 8,
      xDrift: rand() * 30 - 15,
    }));
  }, [count, seed]);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: \`\${p.x}%\`,
            top: \`\${p.y}%\`,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(230,225,210,0.8), rgba(230,225,210,0))",
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, p.xDrift, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Glass input field with floating label + focus glow                 */
/* ------------------------------------------------------------------ */
const GlassInput = ({
  label,
  type = "text",
  value,
  onChange,
  showToggle = false,
  visible,
  onToggleVisible,
  autoComplete,
}) => {
  const [focused, setFocused] = useState(false);
  const reactId = useId();
  const filled = value.length > 0;

  return (
    <div className="relative">
      <motion.div
        className="relative rounded-2xl"
        animate={{
          boxShadow: focused
            ? "0 0 0 1px rgba(190,210,255,0.55), 0 0 24px rgba(150,180,255,0.35)"
            : "0 0 0 1px rgba(190,210,255,0.14), 0 0 0px rgba(150,180,255,0)",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div
          className="rounded-2xl backdrop-blur-md"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
          }}
        >
          <input
            id={reactId}
            type={showToggle ? (visible ? "text" : "password") : type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            aria-label={label}
            className="peer w-full bg-transparent outline-none text-[15px] text-slate-100 placeholder-transparent px-4 pt-6 pb-2.5 rounded-2xl"
            placeholder={label}
          />
          <motion.label
            htmlFor={reactId}
            className="absolute left-4 text-slate-300/70 pointer-events-none select-none"
            animate={{
              top: focused || filled ? 8 : "50%",
              y: focused || filled ? 0 : "-50%",
              scale: focused || filled ? 0.78 : 1,
              color: focused ? "rgba(210,222,255,0.95)" : "rgba(203,213,225,0.6)",
            }}
            style={{ originX: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {label}
          </motion.label>

          {showToggle && (
            <button
              type="button"
              onClick={onToggleVisible}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-300/70 hover:text-slate-100 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 transition-colors"
            >
              {visible ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.05 0-9.29-3.14-11-8 0.71-2.02 1.94-3.79 3.5-5.14M9.9 4.24A10.82 10.82 0 0 1 12 4c5.05 0 9.29 3.14 11 8-0.51 1.45-1.32 2.76-2.36 3.85M1 1l22 22" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Magnetic, glowing Sign In button                                   */
/* ------------------------------------------------------------------ */
const SignInButton = ({ loading, success, onClick }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 220, damping: 20, mass: 0.4 });
  const springY = useSpring(my, { stiffness: 220, damping: 20, mass: 0.4 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    mx.set(relX * 0.18);
    my.set(relY * 0.35);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      type="submit"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={loading}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className="relative w-full mt-2 h-[52px] rounded-2xl font-medium text-[15px] tracking-wide text-slate-900 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200/70 disabled:cursor-not-allowed"
    >
      {/* gradient base */}
      <motion.span
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, #f4f7ff 0%, #dce6ff 35%, #c9d9ff 65%, #eef3ff 100%)",
          backgroundSize: "200% 200%",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* hover glow bloom */}
      <motion.span
        className="absolute -inset-6 opacity-0"
        style={{
          background:
            "radial-gradient(circle, rgba(200,220,255,0.9), transparent 70%)",
          filter: "blur(10px)",
        }}
        whileHover={{ opacity: 0.8, scale: 1.15 }}
        transition={{ duration: 0.4 }}
      />
      {/* shadow lift */}
      <motion.span
        className="absolute inset-0 rounded-2xl"
        whileHover={{
          boxShadow: "0 12px 34px -6px rgba(180,200,255,0.55)",
          y: -1,
        }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2 h-full">
        <AnimatePresence mode="wait" initial={false}>
          {success ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Welcome
            </motion.span>
          ) : loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <motion.span
                className="w-4 h-4 rounded-full border-2 border-slate-900/25 border-t-slate-900"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              Signing in
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Sign In
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function LunaraSignIn() {
  const containerRef = useRef(null);

  // Global pointer position, normalized -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springPx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const springPy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });

  // Layer-specific parallax transforms (different depths)
  const skyX = useTransform(springPx, (v) => v * 8);
  const moonX = useTransform(springPx, (v) => v * 14);
  const moonY = useTransform(springPy, (v) => v * 10);
  const farDuneX = useTransform(springPx, (v) => v * 18);
  const midDuneX = useTransform(springPx, (v) => v * 30);
  const nearDuneX = useTransform(springPx, (v) => v * 46);

  const cardRotateX = useTransform(springPy, (v) => v * -8); // max ~4deg since v in [-0.5,0.5]
  const cardRotateY = useTransform(springPx, (v) => v * 8);
  const highlightX = useTransform(springPx, (v) => 50 + v * 60);
  const highlightY = useTransform(springPy, (v) => 50 + v * 60);

  const caravanProgress = useMotionValue(0);

  const handlePointerMove = useCallback(
    (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      px.set(nx);
      py.set(ny);
    },
    [px, py]
  );

  const handlePointerLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1600);
  };

  // Drive caravan looping progress via requestAnimationFrame-free approach:
  // Framer's animate() on a motion value, looping 0 -> 1 indefinitely.
  React.useEffect(() => {
    const controls = caravanProgress;
    let frame;
    let start = performance.now();
    const durationMs = 26000;
    const tick = (now) => {
      const elapsed = (now - start) % durationMs;
      controls.set(elapsed / durationMs);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [caravanProgress]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.09, delayChildren: 0.15 },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-screen min-h-[640px] overflow-hidden select-none"
      style={{
        background:
          "linear-gradient(to bottom, #04060d 0%, #0a0f1f 30%, #10182f 55%, #1b2440 78%, #2a3358 100%)",
      }}
    >
      {/* ---------------- Sky layer: stars + moon ---------------- */}
      <motion.div className="absolute inset-0" style={{ x: skyX }}>
        <Stars count={70} seed={11} depth={0.6} />
        <Stars count={40} seed={42} depth={1.2} />
      </motion.div>

      <Moon parallaxX={moonX} parallaxY={moonY} />

      <Fog />

      {/* ---------------- Dune depth stack ---------------- */}
      <DuneLayer
        parallaxX={farDuneX}
        parallaxYFactor={0.4}
        fill="#141b32"
        opacity={0.85}
        path="M0,220 C180,180 320,240 480,210 C650,180 760,230 960,200 C1150,175 1300,215 1440,190 L1440,400 L0,400 Z"
      />
      <DuneLayer
        parallaxX={midDuneX}
        parallaxYFactor={0.6}
        fill="#0f1526"
        opacity={0.92}
        path="M0,270 C200,230 340,290 520,260 C700,230 820,280 1000,250 C1180,225 1300,265 1440,245 L1440,400 L0,400 Z"
      />

      {/* Caravan walks along the mid ridge, above mid dune, below near dune */}
      <div className="absolute inset-x-0" style={{ bottom: "16%" }}>
        <CaravanTrack progress={caravanProgress} />
      </div>

      <DuneLayer
        parallaxX={nearDuneX}
        parallaxYFactor={0.9}
        fill="#080b16"
        path="M0,320 C220,290 360,335 560,310 C760,285 880,330 1080,305 C1260,283 1360,315 1440,300 L1440,400 L0,400 Z"
      />

      <DustParticles count={30} seed={5} />

      {/* subtle vignette for cinematic depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(2,4,10,0.55) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ---------------- Foreground: login card ---------------- */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-5">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 46 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            rotateX: cardRotateX,
            rotateY: cardRotateY,
            transformPerspective: 900,
          }}
          className="relative w-full max-w-[380px] rounded-[28px] p-7 sm:p-8"
          aria-label="Sign in"
        >
          {/* glass base */}
          <div
            className="absolute inset-0 rounded-[28px] backdrop-blur-2xl"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 100%)",
              border: "1px solid rgba(215,225,255,0.16)",
              boxShadow:
                "0 30px 80px -20px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)",
            }}
          />
          {/* moving specular highlight, follows cursor */}
          <motion.div
            className="absolute inset-0 rounded-[28px] pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            <motion.div
              className="absolute w-[160%] h-[160%]"
              style={{
                left: useTransform(highlightX, (v) => \`\${v - 80}%\`),
                top: useTransform(highlightY, (v) => \`\${v - 80}%\`),
                background:
                  "radial-gradient(circle, rgba(230,238,255,0.16), transparent 55%)",
              }}
            />
          </motion.div>
          {/* noise overlay */}
          <div
            className="absolute inset-0 rounded-[28px] opacity-[0.05] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\\")",
            }}
            aria-hidden="true"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <motion.div variants={fieldVariants} className="mb-7 text-center">
              <h1
                className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-slate-50"
                style={{ textShadow: "0 2px 20px rgba(150,180,255,0.35)" }}
              >
                Welcome to Lunara
              </h1>
              <p className="mt-2 text-[13.5px] text-slate-300/70">
                Sign in and continue your journey beneath the dunes
              </p>
            </motion.div>

            <motion.div variants={fieldVariants} className="mb-4">
              <GlassInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </motion.div>

            <motion.div variants={fieldVariants} className="mb-2">
              <GlassInput
                label="Password"
                showToggle
                visible={showPassword}
                onToggleVisible={() => setShowPassword((v) => !v)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </motion.div>

            <motion.div
              variants={fieldVariants}
              className="flex items-center justify-between mb-5 mt-1 px-0.5"
            >
              <label className="flex items-center gap-2 text-[12.5px] text-slate-300/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded accent-indigo-300"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-[12.5px] text-slate-300/70 hover:text-slate-100 transition-colors focus:outline-none focus-visible:underline"
              >
                Forgot password?
              </button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="mb-3 text-[12.5px] text-rose-300/90"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div variants={fieldVariants}>
              <SignInButton loading={loading} success={success} />
            </motion.div>

            <motion.p
              variants={fieldVariants}
              className="mt-6 text-center text-[12.5px] text-slate-300/60"
            >
              New to Lunara?{" "}
              <button
                type="button"
                className="text-slate-100 hover:underline focus:outline-none focus-visible:underline"
              >
                Create an account
              </button>
            </motion.p>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
`;