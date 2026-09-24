// index.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;
const RADIUS = 82;

const SPRING_ORBIT = { type: "spring", stiffness: 220, damping: 20, mass: 0.9 };
const SPRING_DIGIT = { type: "spring", stiffness: 400, damping: 22, mass: 0.6 };

const ORBIT_ANGLES = [-90, 0, 90, 180];

function getOrbitPosition(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad) * RADIUS, y: Math.sin(rad) * RADIUS };
}

function useCountdown(seconds) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  const reset = useCallback(() => setRemaining(seconds), [seconds]);
  return [remaining, reset];
}

function BlinkingCaret() {
  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-1/2 h-[40%] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
      animate={{ opacity: [1, 1, 0, 0, 1] }}
      transition={{ duration: 1.2, times: [0, 0.4, 0.5, 0.9, 1], repeat: Infinity, ease: "linear" }}
    />
  );
}

const OtpBox = React.memo(function OtpBox({
  index, value, status, orbiting, orbitAngle, onFocus, onChange, onKeyDown, onPaste, inputRef, reducedMotion,
}) {
  const pos = getOrbitPosition(orbitAngle);

  return (
    <motion.div
      layout
      initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.85 }}
      animate={
        orbiting
          ? { opacity: value ? 1 : 0, x: pos.x, y: pos.y, rotate: [0, 360], scale: value ? 1 : 0.6, position: "absolute" }
          : { opacity: 1, x: 0, y: 0, rotate: 0, scale: status === "focus" ? 1.05 : 1, position: "relative" }
      }
      transition={
        orbiting
          ? {
              x: SPRING_ORBIT,
              y: SPRING_ORBIT,
              scale: SPRING_ORBIT,
              opacity: { duration: 0.3 },
              rotate: { duration: 2.5, repeat: Infinity, ease: "linear" },
            }
          : { x: SPRING_ORBIT, y: SPRING_ORBIT, scale: SPRING_ORBIT, rotate: { duration: 0.4 } }
      }
      style={{ background: "linear-gradient(180deg, #18181b 0%, #09090b 100%)" }}
      className="flex h-16 w-16 items-center justify-center rounded-[1.15rem] shadow-xl sm:h-[72px] sm:w-[72px]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[1.15rem]"
        animate={{
          borderColor: status === "focus" ? "#EF4444" : value ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)",
          boxShadow:
            status === "focus"
              ? "0 0 0 1.5px #EF4444, 0 0 20px 4px rgba(239,68,68,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
              : orbiting
              ? "0 0 0 1px rgba(239,68,68,0.5), 0 0 20px 4px rgba(239,68,68,0.2)"
              : "0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ border: "1.5px solid transparent" }}
      />

      <motion.div
        animate={orbiting ? { rotate: [0, -360] } : { rotate: 0 }}
        transition={orbiting ? { duration: 2.5, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          {value ? (
            <motion.span
              key={value}
              initial={{ opacity: 0, scale: 0.5, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={SPRING_DIGIT}
              className="select-none text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              {value}
            </motion.span>
          ) : (
            status === "focus" && <BlinkingCaret />
          )}
        </AnimatePresence>
      </motion.div>

      {!orbiting && (
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          value={value}
          onFocus={() => onFocus(index)}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          onPaste={onPaste}
          className="absolute inset-0 z-20 h-full w-full cursor-default select-none rounded-[1.15rem] bg-transparent text-center text-transparent caret-transparent outline-none"
        />
      )}
    </motion.div>
  );
});

function OrbitRing({ show }) {
  if (!show) return null;
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: RADIUS * 2 + 40, height: RADIUS * 2 + 40, border: "1px dashed rgba(239,68,68,0.3)" }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: RADIUS * 2 + 100, height: RADIUS * 2 + 100, background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 60%)" }}
      />
    </>
  );
}

// ---- Success shockwave rings — expand THEN fade, looping cleanly ----
function ShockwaveRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: "2px solid rgba(34,197,94,0.7)" }}
          initial={{ width: 80, height: 80, opacity: 0 }}
          animate={{ width: [80, 240], height: [80, 240], opacity: [0.9, 0] }}
          transition={{ duration: 2.2, delay: i * 0.55, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function AmbientBackground({ reducedMotion, celebrate }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050505]">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: celebrate
            ? "radial-gradient(120% 100% at 50% -10%, rgba(34,197,94,0.16), transparent 70%)"
            : "radial-gradient(120% 100% at 50% -10%, rgba(239,68,68,0.12), transparent 70%)",
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* animated grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.05]"
        animate={{ backgroundPosition: celebrate ? ["0px 0px", "0px -32px"] : "0px 0px" }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 90%)",
        }}
      />
      {/* drifting orbs */}
      <motion.div
        className="absolute -left-32 top-1/4 h-80 w-80 rounded-full blur-[100px]"
        animate={{
          x: reducedMotion ? 0 : [0, 45, 0],
          y: reducedMotion ? 0 : [0, -35, 0],
          backgroundColor: celebrate ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.14)",
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full blur-[100px]"
        animate={{
          x: reducedMotion ? 0 : [0, -45, 0],
          y: reducedMotion ? 0 : [0, 35, 0],
          backgroundColor: celebrate ? "rgba(74,222,128,0.13)" : "rgba(255,107,53,0.10)",
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* success flash burst */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: celebrate ? [0, 0.6, 0] : 0, scale: celebrate ? [0.8, 1.6] : 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{ background: "radial-gradient(circle at 50% 42%, rgba(34,197,94,0.22) 0%, transparent 60%)" }}
      />
      {/* noise */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_50%,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}

export default function SmoothOtpVerificationV5({ onVerify }) {
  const reducedMotion = useReducedMotion();
  const [values, setValues] = useState(Array(OTP_LENGTH).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState("entering"); // entering -> orbiting -> success
  const [remaining, resetCountdown] = useCountdown(RESEND_SECONDS);
  const inputsRef = useRef([]);
  const liveRegionRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputsRef.current[0]?.focus(), 700);
    return () => clearTimeout(t);
  }, []);

  const boxStatus = useCallback(
    (i) => (i === activeIndex && phase === "entering" ? "focus" : values[i] ? "filled" : "idle"),
    [activeIndex, phase, values]
  );

  const runVerification = useCallback(
    (code) => {
      setPhase("orbiting");
      if (liveRegionRef.current) liveRegionRef.current.textContent = "Verifying code";

      setTimeout(() => {
        setPhase("success");
        if (liveRegionRef.current) liveRegionRef.current.textContent = "Verified and secured";
        setTimeout(() => onVerify?.(true, code), 2500);
      }, 2200);
    },
    [onVerify]
  );

  const handleChange = useCallback(
    (index, raw) => {
      const digit = raw.replace(/\D/g, "").slice(-1);
      setValues((prev) => {
        const next = [...prev];
        next[index] = digit;
        if (digit && index < OTP_LENGTH - 1) {
          setActiveIndex(index + 1);
          setTimeout(() => inputsRef.current[index + 1]?.focus(), 40);
        }
        if (digit && index === OTP_LENGTH - 1) {
          const code = next.join("");
          if (code.length === OTP_LENGTH) setTimeout(() => runVerification(code), 300);
        }
        return next;
      });
    },
    [runVerification]
  );

  const handleKeyDown = useCallback((index, e) => {
    if (e.key === "Backspace") {
      setValues((prev) => {
        const next = [...prev];
        if (next[index]) { next[index] = ""; return next; }
        if (index > 0) {
          next[index - 1] = "";
          setActiveIndex(index - 1);
          setTimeout(() => inputsRef.current[index - 1]?.focus(), 0);
        }
        return next;
      });
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      setActiveIndex(index + 1);
      inputsRef.current[index + 1]?.focus();
    }
  }, []);

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (!pasted) return;
      const next = Array(OTP_LENGTH).fill("");
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      setValues(next);
      const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
      setActiveIndex(lastIndex);
      inputsRef.current[lastIndex]?.focus();
      if (pasted.length === OTP_LENGTH) setTimeout(() => runVerification(pasted), 300);
    },
    [runVerification]
  );

  const handleResend = useCallback(() => {
    if (remaining > 0) return;
    resetCountdown();
    setValues(Array(OTP_LENGTH).fill(""));
    setPhase("entering");
    setActiveIndex(0);
    inputsRef.current[0]?.focus();
  }, [remaining, resetCountdown]);

  const setInputRef = useMemo(() => (i) => (el) => { inputsRef.current[i] = el; }, []);

  const orbiting = phase === "orbiting";
  const success = phase === "success";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6 font-sans">
      <AmbientBackground reducedMotion={reducedMotion} celebrate={success} />
      <span ref={liveRegionRef} className="sr-only" role="status" aria-live="polite" />

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          boxShadow: success
            ? "0 25px 80px -20px rgba(34,197,94,0.4), 0 10px 30px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 25px 80px -20px rgba(0,0,0,0.9), 0 10px 30px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] p-8 sm:p-10"
        style={{
          background: "linear-gradient(180deg, #18181b 0%, #09090b 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="mx-auto mb-8 h-1 w-12 rounded-full bg-white/10" />

        <div className="h-[90px]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={success ? "title-success" : "title-default"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center text-3xl font-bold tracking-tight text-white"
            >
              {success ? "Verified successfully" : "Let's verify your number"}
            </motion.h1>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={success ? "desc-success" : "desc-default"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-3 text-center text-sm leading-relaxed text-[#A1A1AA]"
            >
              {success
                ? "Your phone number has been verified."
                : "We've sent a 4-digit code to your phone. It'll auto-verify once entered."}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Animation container — taller to give the shockwave rings and label room */}
        <div className="relative mt-8 flex h-[300px] items-center justify-center">
          <OrbitRing show={orbiting} />

          <AnimatePresence>
            {!success && (
              <motion.div
                key="orbit-container"
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <AnimatePresence>
                  {orbiting && (
                    <motion.div
                      key="center-lock"
                      initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 15 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute z-0 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {values.map((v, i) => (
                  <OtpBox
                    key={i}
                    index={i}
                    value={v}
                    status={boxStatus(i)}
                    orbiting={orbiting}
                    orbitAngle={ORBIT_ANGLES[i]}
                    onFocus={setActiveIndex}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    inputRef={setInputRef(i)}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success state — shockwave rings that expand-and-fade on loop, badge fixed on top, label below with real spacing */}
          <AnimatePresence>
            {success && (
              <motion.div
                key="success-container"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="relative flex h-[180px] w-[180px] items-center justify-center">
                  <ShockwaveRings />

                  <motion.div
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-[1.15rem] border-2 border-[#22c55e] bg-[#09090b] shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                  >
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20, delay: 0.15 }}
                      width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.25 }} />
                    </motion.svg>
                  </motion.div>
                </div>

                {/* label sits in normal flow below the ring box — no more overlap */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-[#22c55e]"
                >
                  Verified &amp; Secured
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          animate={{ opacity: phase === "entering" ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="mt-4 h-[20px] text-center text-sm text-[#A1A1AA]"
        >
          {phase === "entering" && (
            <>
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={remaining > 0}
                className={`font-semibold underline-offset-4 transition-colors ${
                  remaining > 0 ? "cursor-not-allowed text-[#52525b]" : "cursor-pointer text-red-500 underline hover:text-red-400"
                }`}
              >
                {remaining > 0 ? `Resend in ${remaining}s` : "Resend"}
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}