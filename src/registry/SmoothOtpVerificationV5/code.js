// code.js
export const premiumOtpVerificationCode = `import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence, useAnimationControls, useReducedMotion } from "framer-motion";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

const SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 0.8 };
const SPRING_SOFT = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 };
const SPRING_DIGIT = { type: "spring", stiffness: 420, damping: 18, mass: 0.6 };
const SPRING_SUCCESS = { type: "spring", stiffness: 300, damping: 20, mass: 0.7 };

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

function BlinkingCaret({ show }) {
  if (!show) return null;
  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-1/2 h-[42%] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6B35]"
      animate={{ opacity: [1, 1, 0, 0, 1] }}
      transition={{ duration: 1.4, times: [0, 0.4, 0.5, 0.9, 1], repeat: Infinity, ease: "linear" }}
    />
  );
}

const OtpBox = React.memo(function OtpBox({
  index,
  value,
  isActive,
  status,
  onFocus,
  onChange,
  onKeyDown,
  onPaste,
  inputRef,
  reducedMotion,
}) {
  const borderColor =
    status === "success"
      ? "#22C55E"
      : status === "error"
      ? "#EF4444"
      : status === "focus" || status === "verifying"
      ? "#FF6B35"
      : value
      ? "rgba(255,107,53,0.35)"
      : "rgba(255,255,255,0.08)";

  const glow =
    status === "success"
      ? "0 0 0 1.5px #22C55E, 0 0 22px 4px rgba(34,197,94,0.35), 0 0 40px 10px rgba(34,197,94,0.15)"
      : status === "error"
      ? "0 0 0 1.5px #EF4444, 0 0 18px 3px rgba(239,68,68,0.35)"
      : status === "focus" || status === "verifying"
      ? "0 0 0 1.5px #FF6B35, 0 0 20px 3px rgba(255,107,53,0.4), 0 0 40px 8px rgba(255,107,53,0.18), inset 0 1px 0 rgba(255,255,255,0.06)"
      : "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)";

  return (
    <motion.div
      layout
      initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.85 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: status === "focus" ? 1.03 : 1,
        x: status === "error" ? [0, -6, 6, -4, 4, 0] : 0,
      }}
      transition={{
        opacity: { duration: 0.4, delay: reducedMotion ? 0 : index * 0.06 },
        y: { ...SPRING, delay: reducedMotion ? 0 : index * 0.06 },
        scale: SPRING_SOFT,
        x: { duration: 0.4, ease: "easeInOut" },
      }}
      style={{ background: "linear-gradient(180deg, #181818 0%, #121212 100%)" }}
      className="relative flex h-16 w-16 items-center justify-center rounded-[20px] sm:h-[74px] sm:w-[74px]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        animate={{ boxShadow: glow, borderColor }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ border: "1px solid", borderColor }}
      />

      <AnimatePresence mode="wait">
        {value ? (
          <motion.span
            key={value}
            initial={{ opacity: 0, scale: 0.7, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={SPRING_DIGIT}
            className="relative z-10 select-none text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            {value}
          </motion.span>
        ) : (
          <BlinkingCaret show={status === "focus"} />
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        autoComplete={index === 0 ? "one-time-code" : "off"}
        aria-label={\`Digit \${index + 1} of \${OTP_LENGTH}\`}
        value={value}
        onFocus={() => onFocus(index)}
        onChange={(e) => onChange(index, e.target.value)}
        onKeyDown={(e) => onKeyDown(index, e)}
        onPaste={onPaste}
        className="absolute inset-0 z-20 h-full w-full cursor-default select-none rounded-[20px] bg-transparent text-center text-transparent caret-transparent outline-none"
      />
    </motion.div>
  );
});

function SuccessCheck() {
  return (
    <motion.svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 1], opacity: 1 }}
      transition={{ ...SPRING_SUCCESS, duration: 0.5 }}
    >
      <circle cx="36" cy="36" r="34" fill="rgba(34,197,94,0.12)" />
      <circle cx="36" cy="36" r="28" stroke="#22C55E" strokeWidth="2.5" fill="none" />
      <motion.path
        d="M22 37 L31 46 L50 26"
        stroke="#22C55E"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

function AmbientBackground({ reducedMotion }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 80% at 50% -10%, rgba(255,107,53,0.08), transparent 60%)" }}
      />
      <motion.div
        className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
        animate={reducedMotion ? {} : { x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl"
        animate={reducedMotion ? {} : { x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\\")",
        }}
      />
    </div>
  );
}

export default function PremiumOtpVerification({ onVerify, correctCode = "1234" }) {
  const reducedMotion = useReducedMotion();
  const [values, setValues] = useState(Array(OTP_LENGTH).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState("entering");
  const [remaining, resetCountdown] = useCountdown(RESEND_SECONDS);
  const inputsRef = useRef([]);
  const liveRegionRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputsRef.current[0]?.focus(), 700);
    return () => clearTimeout(t);
  }, []);

  const boxStatus = useCallback(
    (i) => {
      if (phase === "success") return "success";
      if (phase === "error") return "error";
      if (phase === "verifying") return "verifying";
      if (i === activeIndex && phase !== "verifying") return "focus";
      if (values[i]) return "filled";
      return "idle";
    },
    [phase, activeIndex, values]
  );

  const runVerification = useCallback(
    (code) => {
      setPhase("verifying");
      if (liveRegionRef.current) liveRegionRef.current.textContent = "Verifying code";
      setTimeout(() => {
        const ok = code === correctCode;
        setPhase(ok ? "success" : "error");
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = ok ? "Verification successful" : "Incorrect code, try again";
        }
        onVerify?.(ok, code);
        if (!ok) {
          setTimeout(() => {
            setValues(Array(OTP_LENGTH).fill(""));
            setPhase("entering");
            setActiveIndex(0);
            inputsRef.current[0]?.focus();
          }, 900);
        }
      }, 1100);
    },
    [correctCode, onVerify]
  );

  const handleChange = useCallback(
    (index, raw) => {
      const digit = raw.replace(/\\D/g, "").slice(-1);
      setValues((prev) => {
        const next = [...prev];
        next[index] = digit;
        if (digit && index < OTP_LENGTH - 1) {
          setActiveIndex(index + 1);
          setTimeout(() => inputsRef.current[index + 1]?.focus(), 40);
        }
        if (digit && index === OTP_LENGTH - 1) {
          const code = next.join("");
          if (code.length === OTP_LENGTH) {
            setTimeout(() => runVerification(code), 200);
          }
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
        if (next[index]) {
          next[index] = "";
          return next;
        }
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
      const pasted = e.clipboardData.getData("text").replace(/\\D/g, "").slice(0, OTP_LENGTH);
      if (!pasted) return;
      const next = Array(OTP_LENGTH).fill("");
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      setValues(next);
      const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
      setActiveIndex(lastIndex);
      inputsRef.current[lastIndex]?.focus();
      if (pasted.length === OTP_LENGTH) {
        setTimeout(() => runVerification(pasted), 200);
      }
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

  const setInputRef = useMemo(
    () => (i) => (el) => {
      inputsRef.current[i] = el;
    },
    []
  );

  return (
    <div
      className="relative flex min-h-[640px] w-full items-center justify-center overflow-hidden p-6"
      style={{ background: "#090909" }}
    >
      <AmbientBackground reducedMotion={reducedMotion} />

      <span ref={liveRegionRef} className="sr-only" role="status" aria-live="polite" />

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: [0, -1, 0] }}
        transition={{
          opacity: { duration: 0.6, ease: "easeOut" },
          scale: { duration: 0.6, ease: "easeOut" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
        }}
        className="relative z-10 w-full max-w-sm rounded-[32px] p-8"
        style={{
          background: "#151515",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 20px 60px -20px rgba(0,0,0,0.7), 0 8px 24px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <AnimatePresence mode="wait">
          {phase !== "success" ? (
            <motion.div key="otp-flow" exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }}>
              <motion.h1
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-center text-2xl font-bold tracking-tight text-white sm:text-[28px]"
              >
                Verify your number
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.23 }}
                className="mt-2 text-center text-sm text-[#A1A1AA]"
              >
                Enter the 4-digit code sent to your phone
              </motion.p>

              <div className="mt-8 flex items-center justify-center gap-[18px]">
                {values.map((v, i) => (
                  <OtpBox
                    key={i}
                    index={i}
                    value={v}
                    isActive={activeIndex === i}
                    status={boxStatus(i)}
                    onFocus={setActiveIndex}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    inputRef={setInputRef(i)}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>

              <AnimatePresence>
                {phase === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-center text-xs font-medium text-[#EF4444]"
                  >
                    Incorrect code — please try again
                  </motion.p>
                )}
                {phase === "verifying" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex items-center justify-center gap-2 text-xs text-[#A1A1AA]"
                  >
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-[#FF6B35]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                    />
                    Verifying…
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-8 text-center text-xs text-[#A1A1AA]"
              >
                Didn't receive the code?{" "}
                <motion.button
                  type="button"
                  onClick={handleResend}
                  disabled={remaining > 0}
                  whileHover={remaining === 0 ? { scale: 1.01 } : {}}
                  whileTap={remaining === 0 ? { scale: 0.98 } : {}}
                  className={\`relative font-semibold \${
                    remaining > 0 ? "cursor-not-allowed text-[#6b6b6f]" : "cursor-pointer text-[#FF6B35] hover:opacity-80"
                  }\`}
                >
                  {remaining > 0 ? \`Resend in \${remaining}s\` : "Resend code"}
                  {remaining === 0 && (
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#FF6B35] transition-all duration-300 group-hover:w-full" />
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center py-4"
            >
              <SuccessCheck />
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-5 text-xl font-bold text-white"
              >
                Verified successfully
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-1.5 text-sm text-[#A1A1AA]"
              >
                Your identity has been confirmed
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
`;