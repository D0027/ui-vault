import { lazy } from 'react';
import { lampLoginCode } from '../registry/LampLogin/code.js';
import { otpVerificationCode } from '../registry/OtpVerification/code.js';
import { premiumLoginCode } from '../registry/PremiumLogin/code.js';
import { origamiShoppingBagCode } from '../registry/OrigamiShoppingBag/code.js';
import { dreamyForestLoginCode } from '../registry/DreamyForestLogin/code.js';
import { lunaraSignInCode } from '../registry/LunaraSignIn/code.js';
import { floatingCartInteractionCode } from '../registry/FloatingCartInteraction/code.js';
import { animatedLoginFormCode } from '../registry/AnimatedLoginCharacter/code.js';
import { premiumOtpVerificationCode } from '../registry/SmoothOtpVerificationV5/code.js';
import { colaRevealCardCode } from '../registry/ColaRevealCard/code.js';
import { bambooPandaLoginCode } from '../registry/BambooPandaLogin/code.js';
import { sneakerCheckout3DCode } from '../registry/SneakerCheckout3D/code.js';


// 1. Lazy load the component (only downloads when clicked!)
const LampLogin = lazy(() => import('../registry/LampLogin/index.jsx'));
const OtpVerification = lazy(() => import('../registry/OtpVerification/index.jsx'));
const PremiumLogin = lazy(() => import('../registry/PremiumLogin/index.jsx'));
const OrigamiShoppingBag = lazy(() => import('../registry/OrigamiShoppingBag/index.jsx'));
const DreamyForestLogin = lazy(() => import('../registry/DreamyForestLogin/index.jsx'));
const LunaraSignIn = lazy(() => import('../registry/LunaraSignIn/index.jsx'));
const FloatingCartInteraction = lazy(() => import('../registry/FloatingCartInteraction/index.jsx'));
const AnimatedLoginForm = lazy(() => import('../registry/AnimatedLoginCharacter/index.jsx'));
const PremiumOtpVerification = lazy(() => import('../registry/SmoothOtpVerificationV5/index.jsx'));
const ColaRevealCard = lazy(() => import('../registry/ColaRevealCard/index.jsx'));
const BambooPandaLogin = lazy(() => import('../registry/BambooPandaLogin/index.jsx'));
const SneakerCheckout3D = lazy(() => import('../registry/SneakerCheckout3D/index.jsx'));

// 2. Export the array of all your components
export const components = [
  {
    id: 'lamp-login',
    category: 'Authentication',
    title: 'Lamp Login Animation',
    description: 'A physics-based pull-string lamp that reveals a dark mode login form.',
    tags: ['Framer Motion', 'Physics', 'Dark Mode'],
    previewImage: '/assets/lamp-login.png', // <-- ADDED PREVIEW IMAGE
    component: <LampLogin />, 
    code: lampLoginCode,      
  },
  {
    id: 'otp-verification',
    category: 'Authentication',
    title: 'Animated OTP Verification',
    description: 'A modern 6-digit OTP input with focus glow, resend timer, and an animated success checkmark.',
    tags: ['Framer Motion', 'Dark Mode', 'Forms'],
    previewImage: '/assets/otp-verification.png', // <-- ADDED PREVIEW IMAGE
    component: <OtpVerification />,
    code: otpVerificationCode,
  },
  {
    id: 'premium-login',
    category: 'Authentication',
    title: 'Premium Panda Login',
    description: 'A gradient cloud-themed login/signup card with a panda mascot that covers its eyes on password entry.',
    tags: ['Framer Motion', 'Light Mode', 'Forms'],
    previewImage: '/assets/premium-login.png', // <-- ADDED PREVIEW IMAGE
    component: <PremiumLogin />,
    code: premiumLoginCode,
  },
  {
    id: 'origami-shopping-bag',
    category: 'Buttons',
    title: 'Origami Shopping Bag',
    description: 'A premium animated "Add to Bag" button that folds like origami into a package with satisfying success states.',
    tags: ['Framer Motion', 'Micro-interactions', 'E-commerce'],
    previewImage: '/assets/origami-shopping-bag.png', // <-- ADDED PREVIEW IMAGE
    component: <OrigamiShoppingBag />,
    code: origamiShoppingBagCode,
  },
  {
    id: 'dreamy-forest-login',
    category: 'Authentication',
    title: 'Dreamy Forest Login',
    description: 'A premium fantasy-inspired glassmorphism login page featuring 3D parallax, floating leaves, fireflies, and volumetric lighting.',
    tags: ['Framer Motion', 'Glassmorphism', 'Parallax', 'Dark Mode'],
    previewImage: '/assets/dreamy-forest-login.png', // <-- ADDED PREVIEW IMAGE
    component: <DreamyForestLogin />,
    code: dreamyForestLoginCode,
  },
  {
    id: 'lunara-sign-in',
    category: 'Authentication',
    title: 'Lunara Desert Sign In',
    description: 'A cinematic moonlit desert login experience with layered parallax dunes, a walking camel caravan, glowing bloom moon, and magnetic glass card interactions.',
    tags: ['Framer Motion', 'Glassmorphism', 'Parallax', 'Dark Mode'],
    previewImage: '/assets/lunara-sign-in.png', // <-- ADDED PREVIEW IMAGE
    component: <LunaraSignIn />,
    code: lunaraSignInCode,
  },
  {
    id: 'floating-cart-interaction',
    category: 'E-commerce',
    title: 'Floating Cart & Morphing Add Button',
    description: 'A premium micro-interaction where adding a product triggers a button morph and springs up a glassmorphism floating cart notification.',
    tags: ['Framer Motion', 'E-commerce', 'Micro-interactions', 'Shopping'],
    previewImage: '/assets/floating-cart-interaction.png', // <-- ADDED PREVIEW IMAGE
    component: <FloatingCartInteraction />,
    code: floatingCartInteractionCode,
  },
  {
    id: 'animated-login-form',
    category: 'Authentication',
    title: 'Character Reveal Login Form',
    description: 'A beautifully animated login component where a vector character slides a rod across the screen to reveal a dark-themed login card, complete with a mockup code editor below.',
    tags: ['Framer Motion', 'Micro-interactions', 'Forms', 'Character Rigging'],
    previewImage: '/assets/animated-login-form.png', // <-- ADDED PREVIEW IMAGE
    component: <AnimatedLoginForm />,
    code: animatedLoginFormCode,
  },
  {
    id: 'premium-otp-verification',
    category: 'Authentication',
    title: 'Premium OTP Verification',
    description: 'A fintech-grade 4-digit OTP verification card with orange focus glow, spring digit entry, auto-verify, and a morphing success checkmark state.',
    tags: ['Framer Motion', 'Dark Mode', 'Forms', 'Micro-interactions'],
    previewImage: '/assets/premium-otp-verification.png',
    component: <PremiumOtpVerification />,
    code: premiumOtpVerificationCode,
  },
  {
    id: 'cola-reveal-card',
    category: 'E-commerce',
    title: 'Tap-to-Open Cola Reveal Card',
    description: 'An interactive can that cracks open with cinematic physics, floods the card with neon colour via an expanding mask, repaints the can, then springs into a full landscape product showcase.',
    tags: ['Framer Motion', 'Micro-interactions', 'E-commerce', 'SVG Masks'],
    previewImage: '/assets/cola-reveal-card.png',
    component: <ColaRevealCard />,
    code: colaRevealCardCode,
  },
  {
    id: 'bamboo-panda-login',
    category: 'Authentication',
    title: 'Bamboo Panda Login',
    description: 'A panda-themed login screen featuring a physical pull-cord light toggle and an interactive panda avatar that tracks cursor input and covers its eyes.',
    tags: ['Framer Motion', 'Interactive Avatar', 'Forms', 'Dark Mode'],
    previewImage: '/assets/bamboo-panda-login.png',
    component: <BambooPandaLogin />,
    code: bambooPandaLoginCode,
  },
  {
    id: 'sneaker-checkout-3d',
    category: 'E-commerce',
    title: '3D Sneaker Checkout',
    description: 'An advanced e-commerce micro-interaction where a sneaker drops into a 3D cardboard box, folds up, and gets shipped away in a delivery truck.',
    tags: ['Framer Motion', '3D CSS', 'Micro-interactions', 'E-commerce'],
    previewImage: '/assets/sneaker-checkout-3d.png',
    component: <SneakerCheckout3D />,
    code: sneakerCheckout3DCode,
  },


  // When you build the next component, you just add it right below this!
];