import React, {
  useState,
  useRef,
  useCallback,
  useId,
  useMemo,
} from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useMotionValue,
  useSpring,
  MotionConfig,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Static product data — no external assets. Each drink renders a     */
/*  realistic canned-drink illustration built entirely from SVG.       */
/* ------------------------------------------------------------------ */
const PRODUCTS = [
  {
    id: "p1",
    name: "Drink 1",
    rating: 4.5,
    reviews: 52,
    price: 3.99,
    canTop: "#eef7d8",
    canBody: "linear-gradient(180deg,#eef9c8 0%,#c7e26a 45%,#8fb93a 100%)",
    labelColor: "#d7ec7a",
    withCitrus: true,
  },
  {
    id: "p2",
    name: "Drink 2",
    rating: 4.5,
    reviews: 159,
    price: 12.99,
    canTop: "#3a3324",
    canBody: "linear-gradient(180deg,#4a4230 0%,#2a2416 55%,#171307 100%)",
    labelColor: "#c9a53f",
    withCitrus: false,
  },
];

const BRAND_PINK = "#ec4869";
const BRAND_PINK_DARK = "#d63a5a";
const CHECKOUT_DARK = "#171126";

/* Slower, softer spring presets — premium and unhurried rather than    */
/* snappy. Every choreography stage now has room to breathe.            */
const SPRING_BUTTON = { type: "spring", stiffness: 260, damping: 26, mass: 0.6 };
const SPRING_MORPH = { type: "spring", stiffness: 130, damping: 24, mass: 1 };
const SPRING_SOFT = { type: "spring", stiffness: 120, damping: 20, mass: 1 };
const SPRING_PANEL = { type: "spring", stiffness: 190, damping: 26, mass: 0.8 };
const FLIGHT_DURATION = 1.15;
const FLIGHT_EASE = [0.22, 1, 0.36, 1];

const getRect = (el) => {
  if (!el) return { left: 0, top: 0, width: 0, height: 0 };
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

/* ------------------------------------------------------------------ */
/*  Lemon slice garnish — pure SVG, used only on the citrus drink.     */
/* ------------------------------------------------------------------ */
const LemonSlice = ({ size = 30, rotate = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    style={{ transform: `rotate(${rotate}deg)` }}
    aria-hidden="true"
  >
    <circle cx="20" cy="20" r="19" fill="#f4c430" />
    <circle cx="20" cy="20" r="15.5" fill="#fbe27a" />
    <circle cx="20" cy="20" r="12.5" fill="#fdf3b8" />
    {Array.from({ length: 8 }).map((_, i) => (
      <line
        key={i}
        x1="20"
        y1="20"
        x2={20 + 12 * Math.cos((i * Math.PI) / 4)}
        y2={20 + 12 * Math.sin((i * Math.PI) / 4)}
        stroke="#f4c430"
        strokeWidth="1.4"
        opacity="0.7"
      />
    ))}
    <circle cx="20" cy="20" r="3.4" fill="#fff8de" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Realistic-ish drink can — vertical cylinder built from gradients,  */
/*  a top ellipse, a label band, and a specular highlight strip.       */
/* ------------------------------------------------------------------ */
const DrinkCan = ({ product, size = 88 }) => {
  const w = size * 0.5;
  const h = size;
  return (
    <div
      className="relative"
      style={{ width: w, height: h }}
      aria-hidden="true"
    >
      {/* body */}
      <div
        className="absolute inset-0 rounded-[10px]"
        style={{
          background: product.canBody,
          boxShadow: "inset -6px 0 10px rgba(0,0,0,0.25), inset 4px 0 8px rgba(255,255,255,0.25)",
        }}
      />
      {/* top rim */}
      <div
        className="absolute left-0 right-0 rounded-full"
        style={{
          top: -h * 0.028,
          height: h * 0.09,
          background: product.canTop,
          boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.2)",
        }}
      />
      {/* label band */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{
          top: h * 0.34,
          height: h * 0.34,
          background: product.labelColor,
          opacity: 0.92,
        }}
      >
        <div
          className="w-[62%] h-[2px] rounded-full"
          style={{ background: "rgba(255,255,255,0.6)" }}
        />
      </div>
      {/* specular highlight strip */}
      <div
        className="absolute rounded-full"
        style={{
          left: "12%",
          top: "6%",
          width: "16%",
          height: "84%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.05))",
          filter: "blur(0.5px)",
        }}
      />
      {/* bottom shading */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-b-[10px]"
        style={{
          height: "10%",
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.28))",
        }}
      />
    </div>
  );
};

const ProductArt = ({ product, size = 88 }) => (
  <div className="relative flex items-center justify-center">
    {product.withCitrus && (
      <>
        <div className="absolute -left-3 bottom-1 rotate-[-8deg]">
          <LemonSlice size={size * 0.34} rotate={-10} />
        </div>
        <div className="absolute -right-3 bottom-3 rotate-[10deg]">
          <LemonSlice size={size * 0.3} rotate={16} />
        </div>
      </>
    )}
    <DrinkCan product={product} size={size} />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Star rating                                                        */
/* ------------------------------------------------------------------ */
const StarRating = ({ value, reviews }) => (
  <div className="flex items-center gap-1">
    <div className="flex" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < Math.round(value) ? "#f5b342" : "#e5e7eb"}>
          <path d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.7L12 17.3l-6.1 3.4 1.5-6.7-5.1-4.6 6.8-.7L12 2.5z" />
        </svg>
      ))}
    </div>
    <span className="text-[11.5px] text-slate-400">
      {value} ({reviews})
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Inline icons                                                       */
/* ------------------------------------------------------------------ */
const CartIcon = ({ size = 16, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const PlusIcon = ({ size = 12, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const CheckIcon = ({ size = 13, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ChevronIcon = ({ size = 13, color = "rgba(255,255,255,0.85)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const CloseIcon = ({ size = 13, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const TruckIcon = ({ size = 13, color = "rgba(255,255,255,0.85)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h13v13H1z" />
    <path d="M14 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18" r="1.6" />
    <circle cx="18.5" cy="18" r="1.6" />
  </svg>
);

const Spinner = ({ size = 13, color = "rgba(255,255,255,0.95)" }) => (
  <motion.span
    className="rounded-full"
    style={{ width: size, height: size, border: `2px solid rgba(255,255,255,0.3)`, borderTopColor: color, display: "inline-block" }}
    animate={{ rotate: 360 }}
    transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
  />
);

/* ------------------------------------------------------------------ */
/*  Add button — brand-pink pill, gentle hover lift, calm compress on   */
/*  press, and a slower, smoother cross-fade between its three states.  */
/*  Its own footprint never changes, so the card around it never shifts.*/
/* ------------------------------------------------------------------ */
const AddButton = React.forwardRef(function AddButton(
  { onTrigger, phase },
  ref
) {
  const disabled = phase !== "idle";

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={onTrigger}
      whileHover={phase === "idle" ? { y: -1.5 } : undefined}
      whileTap={phase === "idle" ? { scale: 0.95 } : undefined}
      transition={SPRING_BUTTON}
      aria-label="Add to cart"
      className="relative h-9 px-4 rounded-full text-[12.5px] font-semibold overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 disabled:cursor-default min-w-[84px]"
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        animate={{
          background:
            phase === "success"
              ? "linear-gradient(135deg,#19a463,#0f9455)"
              : `linear-gradient(135deg, ${BRAND_PINK}, ${BRAND_PINK_DARK})`,
        }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow:
            phase === "idle"
              ? "0 6px 16px -6px rgba(236,72,105,0.55)"
              : "0 4px 10px -6px rgba(15,148,85,0.5)",
        }}
        transition={{ duration: 0.4 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-1.5 text-white">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "loading" ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-1.5"
            >
              <Spinner />
            </motion.span>
          ) : phase === "success" ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex items-center gap-1.5"
            >
              <CheckIcon />
              Added
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-1.5"
            >
              <PlusIcon />
              Add
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
});

/* ------------------------------------------------------------------ */
/*  Flying can — the real drink illustration glides along a wide,      */
/*  unhurried arc from the card into the cart, decelerating smoothly   */
/*  on arrival instead of snapping through several jerky stages.       */
/* ------------------------------------------------------------------ */
const FlyingCan = ({ start, end, product, onComplete }) => {
  const controlX = (start.left + end.left) / 2 + (end.left - start.left) * 0.15;
  const controlY = Math.min(start.top, end.top) - 170;

  const steps = 16;
  const xs = [];
  const ys = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) * (1 - t) * start.left + 2 * (1 - t) * t * controlX + t * t * end.left;
    const y = (1 - t) * (1 - t) * start.top + 2 * (1 - t) * t * controlY + t * t * end.top;
    xs.push(x);
    ys.push(y);
  }

  return (
    <motion.div
      className="fixed z-40 pointer-events-none"
      style={{ width: 34, height: 34 }}
      initial={{ left: xs[0], top: ys[0], scale: 1, opacity: 1, rotate: 0 }}
      animate={{
        left: xs,
        top: ys,
        scale: [1, 1.02, 0.42],
        rotate: [0, 14, -10],
        opacity: [1, 1, 0.85],
      }}
      transition={{ duration: FLIGHT_DURATION, ease: FLIGHT_EASE }}
      onAnimationComplete={onComplete}
      aria-hidden="true"
    >
      <div style={{ transform: "scale(0.55)", transformOrigin: "top left" }}>
        <DrinkCan product={product} size={62} />
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Ghost morph shell — appears exactly over the clicked button so the */
/*  card itself never shifts, then yields (via shared layoutId) to the */
/*  persistent floating pill, producing a seamless button -> capsule    */
/*  morph with no snapping.                                             */
/* ------------------------------------------------------------------ */
const MorphGhost = ({ rect }) => (
  <motion.div
    layoutId="cart-shared-shell"
    layout
    transition={SPRING_MORPH}
    className="fixed z-30 rounded-full pointer-events-none"
    style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
    aria-hidden="true"
  />
);

/* ------------------------------------------------------------------ */
/*  Cart row — quantity-aware. Adding the same drink again bumps this  */
/*  row's price line with a gentle pop rather than duplicating it.     */
/* ------------------------------------------------------------------ */
const CartRow = ({ item, isNew }) => (
  <motion.li
    layout
    initial={isNew ? { opacity: 0, x: 18 } : false}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 18, transition: { duration: 0.25 } }}
    transition={SPRING_PANEL}
    className="flex items-center gap-3 py-3"
  >
    <div className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-white/15 overflow-hidden">
      <div style={{ transform: "scale(0.42)" }}>
        <DrinkCan product={item} size={88} />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold tracking-wide text-white/60 uppercase">
        Drink
      </p>
      <p className="text-[13px] font-medium text-white truncate">{item.name}</p>
    </div>
    <div className="flex flex-col items-end">
      <span className="text-[13.5px] font-semibold text-white">
        ${(item.price * item.qty).toFixed(2)}
      </span>
      {item.qty > 1 && (
        <motion.span
          key={item.qty}
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className="text-[10.5px] text-white/60"
        >
          ×{item.qty}
        </motion.span>
      )}
    </div>
  </motion.li>
);

/* ------------------------------------------------------------------ */
/*  Delivery progress indicator — a slow indeterminate sweep, echoing  */
/*  "checking free delivery eligibility" from the reference.           */
/* ------------------------------------------------------------------ */
const DeliveryProgress = () => (
  <div className="mx-4 mt-1 mb-3 rounded-xl bg-white/10 px-3 py-2.5 flex items-center gap-2 overflow-hidden">
    <TruckIcon />
    <div className="flex-1 relative h-1.5 rounded-full bg-white/15 overflow-hidden">
      <motion.div
        className="absolute inset-y-0 w-1/3 rounded-full"
        style={{ background: "rgba(255,255,255,0.75)" }}
        animate={{ left: ["-35%", "100%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    <span className="text-[10.5px] text-white/70 whitespace-nowrap">
      Checking delivery
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Cart panel — expands upward from the pill, brand-pink surface,     */
/*  header with live count + close control, item rows, delivery        */
/*  progress, subtotal and a dark checkout button.                      */
/* ------------------------------------------------------------------ */
const CartPanel = ({ items, subtotal, onClose, lastAddedId }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 18, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 14, scale: 0.96, transition: { duration: 0.25 } }}
    transition={SPRING_PANEL}
    className="mb-3 w-[280px] rounded-[22px] overflow-hidden"
    style={{
      background: `linear-gradient(160deg, ${BRAND_PINK} 0%, ${BRAND_PINK_DARK} 100%)`,
      boxShadow: "0 30px 70px -18px rgba(214,58,90,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
    }}
    role="dialog"
    aria-label="Cart preview"
  >
    <div className="flex items-center justify-between px-4 pt-4 pb-1">
      <div className="flex items-center gap-2">
        <span className="text-[13.5px] font-semibold text-white">Your Cart</span>
        <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-white/20 text-white text-[10.5px] font-semibold">
          {items.reduce((s, it) => s + it.qty, 0)}
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close cart"
        className="w-6 h-6 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <CloseIcon size={11} />
      </button>
    </div>

    <ul className="px-4 divide-y divide-white/12 max-h-[220px] overflow-y-auto">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <CartRow key={item.id} item={item} isNew={item.id === lastAddedId} />
        ))}
      </AnimatePresence>
    </ul>

    <DeliveryProgress />

    <div className="px-4 pb-3 flex items-center justify-between">
      <span className="text-[11.5px] text-white/70">Subtotal</span>
      <span className="text-[15px] font-semibold text-white">
        ${subtotal.toFixed(2)}
      </span>
    </div>

    <div className="px-4 pb-4">
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={SPRING_BUTTON}
        className="w-full h-11 rounded-xl flex items-center justify-between px-4 text-white text-[13px] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ background: CHECKOUT_DARK }}
      >
        <span>Proceed to Checkout</span>
        <span className="flex items-center gap-1 font-semibold">
          ${subtotal.toFixed(2)}
          <ChevronIcon />
        </span>
      </motion.button>
    </div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Persistent floating cart pill — two-line label matching the        */
/*  reference ("View cart" / "N item(s)"), gentle idle breathing and   */
/*  glow, click toggles the panel above it.                            */
/* ------------------------------------------------------------------ */
const FloatingCartPill = React.forwardRef(function FloatingCartPill(
  { count, open, onToggle },
  ref
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onToggle}
      layoutId="cart-shared-shell"
      layout
      transition={SPRING_MORPH}
      whileTap={{ scale: 0.97 }}
      aria-expanded={open}
      aria-label={`${open ? "Close" : "Open"} cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative flex items-center gap-3 rounded-full pl-4 pr-5 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={{
        background: `linear-gradient(135deg, ${BRAND_PINK}, ${BRAND_PINK_DARK})`,
        boxShadow: "0 20px 45px -12px rgba(214,58,90,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      <motion.span
        className="absolute -inset-2 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.28), transparent 70%)", filter: "blur(10px)" }}
        animate={{ opacity: [0.35, 0.65, 0.35], y: [0, -3, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="relative flex items-center justify-center w-8 h-8 rounded-full"
        style={{ background: "rgba(255,255,255,0.18)" }}
      >
        <CartIcon size={15} />
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 18 }}
              className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-white text-[10px] font-bold"
              style={{ color: BRAND_PINK_DARK }}
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="relative flex flex-col items-start leading-tight">
        <span className="text-white text-[13px] font-semibold">View cart</span>
        <span className="text-white/75 text-[10.5px]">
          {count} item{count === 1 ? "" : "s"}
        </span>
      </span>
    </motion.button>
  );
});

/* ------------------------------------------------------------------ */
/*  Product card — position and size never move; only the button's     */
/*  internal label changes. All outward motion is layered above the    */
/*  page, so the card grid stays perfectly stable at all times.         */
/* ------------------------------------------------------------------ */
const ProductCard = ({ product, onAdd, phase, buttonRef }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -5 : 0,
        boxShadow: hovered
          ? "0 22px 50px -18px rgba(15,23,42,0.18), 0 0 0 1px rgba(236,72,105,0.18)"
          : "0 8px 24px -14px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.04)",
      }}
      transition={SPRING_SOFT}
      className="relative flex flex-col rounded-[22px] bg-white p-4 w-full max-w-[210px]"
    >
      <div className="h-32 flex items-center justify-center">
        <motion.div
          animate={{ y: hovered ? -4 : 0 }}
          transition={SPRING_SOFT}
        >
          <ProductArt product={product} size={88} />
        </motion.div>
      </div>

      <div className="mt-2">
        <p className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: BRAND_PINK }}>
          Drink
        </p>
        <h3 className="text-[14px] font-semibold text-slate-900 leading-snug">
          {product.name}
        </h3>
        <div className="mt-1">
          <StarRating value={product.rating} reviews={product.reviews} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[15px] font-semibold text-slate-900">
          ${product.price.toFixed(2)}
        </span>
        <AddButton ref={buttonRef} phase={phase} onTrigger={() => onAdd(product)} />
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
export default function FloatingCartInteraction() {
  const [cartItems, setCartItems] = useState({}); // { [id]: { ...product, qty } }
  const [pillVisible, setPillVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [morphRect, setMorphRect] = useState(null);
  const [flyingCan, setFlyingCan] = useState(null);
  const [buttonPhases, setButtonPhases] = useState({});
  const [lastAddedId, setLastAddedId] = useState(null);

  const buttonRefs = useRef({});
  const pillRef = useRef(null);
  const timeoutsRef = useRef([]);
  const flightId = useId();

  const setButtonRef = useCallback(
    (id) => (el) => {
      buttonRefs.current[id] = el;
    },
    []
  );

  const clearScheduled = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
  };

  const cartList = useMemo(() => Object.values(cartItems), [cartItems]);
  const cartCount = useMemo(() => cartList.reduce((sum, it) => sum + it.qty, 0), [cartList]);
  const subtotal = useMemo(
    () => cartList.reduce((sum, it) => sum + it.price * it.qty, 0),
    [cartList]
  );

  const handleAdd = useCallback(
    (product) => {
      const buttonEl = buttonRefs.current[product.id];
      const sourceRect = getRect(buttonEl);
      const targetRect = getRect(pillRef.current);

      clearScheduled();
      setButtonPhases((p) => ({ ...p, [product.id]: "loading" }));
      setMorphRect(sourceRect);

      // 1. Brief, unhurried "loading" beat on the button itself.
      const t1 = window.setTimeout(() => {
        setButtonPhases((p) => ({ ...p, [product.id]: "success" }));

        // 2. The real can glides along a wide, slow arc into the cart.
        setFlyingCan({
          key: `${flightId}-${Date.now()}`,
          product,
          start: {
            left: sourceRect.left + sourceRect.width / 2 - 17,
            top: sourceRect.top + sourceRect.height / 2 - 17,
          },
          end: {
            left: targetRect.left + targetRect.width / 2 - 17,
            top: targetRect.top + targetRect.height / 2 - 17,
          },
        });
      }, 480);

      // 3. Once the can has visibly begun its arc, the button/ghost
      //    yields to the persistent pill and the count updates.
      const t2 = window.setTimeout(() => {
        setPillVisible(true);
        setMorphRect(null);
        setCartItems((prev) => {
          const existing = prev[product.id];
          return {
            ...prev,
            [product.id]: existing
              ? { ...existing, qty: existing.qty + 1 }
              : { ...product, qty: 1 },
          };
        });
        setLastAddedId(product.id);
      }, 900);

      // 4. Button eases back to idle only after everything has settled.
      const t3 = window.setTimeout(() => {
        setButtonPhases((p) => ({ ...p, [product.id]: "idle" }));
      }, 1500);

      timeoutsRef.current.push(t1, t2, t3);
    },
    [flightId]
  );

  const handleCanComplete = useCallback(() => {
    setFlyingCan(null);
  }, []);

  const containerVariants = useMemo(
    () => ({
      hidden: {},
      visible: { transition: { staggerChildren: 0.1 } },
    }),
    []
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative w-full min-h-screen flex flex-col" style={{ background: "#f7f6f4" }}>
        {/* ---------------- Storefront nav bar ---------------- */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-10 h-16 bg-[#f7f6f4]/90 backdrop-blur-md border-b border-black/5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: BRAND_PINK }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3z" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </span>
            <span className="text-[14px] font-semibold text-slate-900 tracking-tight">Sipzy</span>
          </div>
          <nav className="hidden sm:flex items-center gap-7 text-[13px] text-slate-500">
            <span className="text-slate-900 font-medium">Shop</span>
            <span>New</span>
            <span>Journal</span>
            <span>About</span>
          </nav>
          <span className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
        </header>

        {/* ---------------- Section heading ---------------- */}
        <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-5">
          <h1 className="text-[20px] font-semibold tracking-tight text-slate-900">
            Popular Products
          </h1>
        </div>

        {/* ---------------- Product grid ---------------- */}
        <div className="relative flex-1 px-6 sm:px-10 pb-28">
          <LayoutGroup>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-wrap gap-5"
            >
              {PRODUCTS.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: SPRING_SOFT } }}
                >
                  <ProductCard
                    product={product}
                    onAdd={handleAdd}
                    phase={buttonPhases[product.id] || "idle"}
                    buttonRef={setButtonRef(product.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            <AnimatePresence>{morphRect && <MorphGhost rect={morphRect} />}</AnimatePresence>

            {/* ---------------- Floating cart + expandable panel ---------------- */}
            {pillVisible && (
              <div className="fixed bottom-6 right-6 z-20 flex flex-col items-end">
                <AnimatePresence>
                  {panelOpen && cartList.length > 0 && (
                    <CartPanel
                      items={cartList}
                      subtotal={subtotal}
                      onClose={() => setPanelOpen(false)}
                      lastAddedId={lastAddedId}
                    />
                  )}
                </AnimatePresence>
                <FloatingCartPill
                  ref={pillRef}
                  count={cartCount}
                  open={panelOpen}
                  onToggle={() => setPanelOpen((v) => !v)}
                />
              </div>
            )}

            {!pillVisible && (
              <div
                ref={pillRef}
                className="fixed bottom-6 right-6 w-[150px] h-[46px] opacity-0 pointer-events-none"
                aria-hidden="true"
              />
            )}
          </LayoutGroup>

          <AnimatePresence>
            {flyingCan && (
              <FlyingCan
                key={flyingCan.key}
                start={flyingCan.start}
                end={flyingCan.end}
                product={flyingCan.product}
                onComplete={handleCanComplete}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}