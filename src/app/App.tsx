import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
} from "motion/react";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ExternalLink,
  Download,
  ArrowUp,
  ArrowRight,
  Menu,
  X,
  Send,
  Code2,
  Palette,
  Zap,
  Users,
  BookOpen,
  Globe,
  CheckCircle,
  Circle,
  Sparkles,
} from "lucide-react";
import Lenis from "lenis";
import * as THREE from "three";
import monu from "./assets/monu.png";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "Projects", "Skills", "Experience", "About", "Contact"];

const ROLES = [
  "Frontend Developer",
  "Angular Developer",
  "React Developer",
  "UI Designer",
  "Learning Backend · Node.js",
];

type Skill = { name: string; color: string; tag: string };
const SKILLS: Skill[] = [
  { name: "React", color: "#61DAFB", tag: "⚛" },
  { name: "Angular", color: "#DD0031", tag: "Ng" },
  { name: "JavaScript", color: "#F7DF1E", tag: "JS" },
  { name: "TypeScript", color: "#3178C6", tag: "TS" },
  { name: "Tailwind CSS", color: "#06B6D4", tag: "TW" },
  { name: "Bootstrap", color: "#7952B3", tag: "BS" },
  { name: "HTML5", color: "#E34F26", tag: "H5" },
  { name: "CSS3", color: "#1572B6", tag: "C3" },
  { name: "Node.js", color: "#339933", tag: "No" },
  { name: "Express", color: "#aaaaaa", tag: "Ex" },
  { name: "MongoDB", color: "#47A248", tag: "Mg" },
  { name: "Git", color: "#F05032", tag: "Gt" },
  { name: "GitHub", color: "#cccccc", tag: "GH" },
  { name: "Figma", color: "#F24E1E", tag: "Fi" },
  { name: "Photoshop", color: "#31A8FF", tag: "Ps" },
  { name: "Illustrator", color: "#FF9A00", tag: "Ai" },
  { name: "Responsive", color: "#5B8CFF", tag: "RD" },
  { name: "REST APIs", color: "#00E5FF", tag: "~/" },
];

type Project = {
  title: string;
  desc: string;
  tags: string[];
  img: string;
  featured: boolean;
};
const PROJECTS: Project[] = [
  {
    title: "NLD India Website",
    desc: "Comprehensive organizational portal with dynamic content management, event listings, and membership modules. Built with Angular and optimized for scale.",
    tags: ["Angular", "TypeScript", "SCSS", "REST API"],
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=560&fit=crop&auto=format",
    featured: true,
  },
  {
    title: "Portfolio 2026",
    desc: "This very portfolio — award-level design with 3D interactions, aurora animations, and immersive scroll storytelling.",
    tags: ["React", "Three.js", "Framer Motion", "Tailwind"],
    img: "https://images.unsplash.com/photo-1555099962-4199c17e2165?w=900&h=560&fit=crop&auto=format",
    featured: true,
  },
  {
    title: "Swiggy Clone",
    desc: "Full-featured food delivery app with real-time cart management, restaurant search, and live API integration.",
    tags: ["React", "Redux", "Tailwind"],
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format",
    featured: false,
  },
  {
    title: "Flipkart Clone",
    desc: "E-commerce platform with product browsing, cart, authentication and seamless checkout experience.",
    tags: ["React", "Firebase", "CSS3"],
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format",
    featured: false,
  },
  {
    title: "Home Service App UI",
    desc: "Premium mobile-first UI for a home services marketplace — elegant booking flow and provider profiles.",
    tags: ["Figma", "React", "Tailwind"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format",
    featured: false,
  },
  {
    title: "Social Media UI",
    desc: "Sleek social platform with feed, stories, messaging and profile components — dark and light themes.",
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop&auto=format",
    featured: false,
  },
];

const EXPERIENCE = [
  {
    role: "Frontend Developer",
    company: "Freelance · Self-employed",
    period: "2022 – Present",
    desc: "Crafting modern web applications for clients across India with a focus on React, Angular, and UI excellence. Delivered 20+ projects end-to-end.",
    tags: ["React", "Angular", "TypeScript", "Tailwind"],
  },
  {
    role: "UI Designer & Web Developer",
    company: "NLD India",
    period: "2023 – Present",
    desc: "Led the complete redesign and development of the NLD India website. Improved user engagement by 40% through modern design patterns and performance optimization.",
    tags: ["Angular", "Figma", "SCSS", "REST API"],
  },
  {
    role: "React Developer · Internship",
    company: "Tech Startup",
    period: "2022 – 2023",
    desc: "Contributed to a SaaS product dashboard. Built a reusable component library and improved Lighthouse scores by 30+ points through lazy-loading and bundle optimization.",
    tags: ["React", "Redux", "CSS Modules"],
  },
];

const JOURNEY = [
  { label: "Frontend Foundations", detail: "HTML5, CSS3, JavaScript ES6+", done: true },
  { label: "Advanced React", detail: "Hooks, Context, Redux, Next.js", done: true },
  { label: "Angular Development", detail: "Components, Services, RxJS, NgRx", done: true },
  { label: "Node.js & Express", detail: "REST APIs, Auth, Middleware", done: false, current: true },
  { label: "MongoDB & Databases", detail: "CRUD, Aggregation, Mongoose", done: false },
  { label: "Full Stack Engineer", detail: "MEAN / MERN · Cloud Deployment", done: false },
];

const FIGMA_SHOWCASES = [
  {
    title: "Analytics Dashboard UI Kit",
    sub: "Data-dense dashboard with light/dark modes and custom chart components.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop&auto=format",
  },
  {
    title: "Mobile Banking App",
    sub: "Frictionless fintech UI — onboarding, home, transactions, and settings.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=700&fit=crop&auto=format",
  },
  {
    title: "E-Commerce Redesign",
    sub: "Full product browsing, cart, and checkout flow optimised for conversion.",
    img: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=1200&h=700&fit=crop&auto=format",
  },
  {
    title: "Travel Booking Platform",
    sub: "Search, filters, destination cards, and booking flow in one cohesive system.",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=700&fit=crop&auto=format",
  },
  {
    title: "SaaS Onboarding Flow",
    sub: "Step-by-step onboarding with progress tracking and micro-animations.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=700&fit=crop&auto=format",
  },
  {
    title: "Health & Wellness App",
    sub: "Calm, accessible health tracker with custom data visualisation.",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=700&fit=crop&auto=format",
  },
];

const WHY_ME = [
  { icon: Code2, title: "Clean Code", desc: "Maintainable, purposeful code that scales with teams and time.", color: "#5B8CFF" },
  { icon: Palette, title: "Modern UI", desc: "Pixel-perfect interfaces drawn from the best of 2026 design.", color: "#7C3AED" },
  { icon: Zap, title: "Performance", desc: "Lazy loading, optimized bundles, and fast Core Web Vitals by default.", color: "#00E5FF" },
  { icon: Globe, title: "Responsive", desc: "Flawless on every screen — 320 px to 4K, portrait to landscape.", color: "#5B8CFF" },
  { icon: BookOpen, title: "Fast Learner", desc: "Angular to Node.js in months. Adaptable and always leveling up.", color: "#7C3AED" },
  { icon: Users, title: "Team Player", desc: "Clear async communication and collaborative across disciplines.", color: "#00E5FF" },
];

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useTypewriter(words: string[]) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let id: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (display.length < word.length) {
        id = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), 100);
      } else {
        id = setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (display.length > 0) {
        id = setTimeout(() => setDisplay(display.slice(0, -1)), 48);
      } else {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      }
    }
    return () => clearTimeout(id);
  }, [display, deleting, wordIdx, words]);

  return display;
}

function useCounter(target: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const steps = 60;
    const inc = target / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(cur));
    }, 2000 / steps);
    return () => clearInterval(id);
  }, [target, active]);
  return count;
}

// ─── THREE.JS CRYSTAL ────────────────────────────────────────────────────────

function Crystal({ mouse }: { mouse: { x: number; y: number } }) {
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current) {
      outerRef.current.rotation.y += 0.004;
      outerRef.current.rotation.x = THREE.MathUtils.lerp(
        outerRef.current.rotation.x,
        mouse.y * 0.4,
        0.04
      );
    }
    if (innerRef.current) {
      innerRef.current.rotation.x += 0.007;
      innerRef.current.rotation.z = Math.sin(t * 0.6) * 0.12;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} color="#5B8CFF" intensity={4} />
      <pointLight position={[-4, -3, -3]} color="#7C3AED" intensity={3} />
      <pointLight position={[0, -4, 3]} color="#00E5FF" intensity={2} />

      <Float speed={2} floatIntensity={0.9} rotationIntensity={0.2}>
        <group>
          <mesh ref={outerRef}>
            <icosahedronGeometry args={[1.65, 1]} />
            <meshBasicMaterial color="#5B8CFF" wireframe transparent opacity={0.25} />
          </mesh>

          <mesh ref={innerRef} scale={0.82}>
            <icosahedronGeometry args={[1.65, 2]} />
            <MeshDistortMaterial
              color="#7C3AED"
              transparent
              opacity={0.65}
              distort={0.45}
              speed={2}
              roughness={0.05}
              metalness={0.85}
            />
          </mesh>

          <mesh scale={0.42}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color="#00E5FF"
              transparent
              opacity={0.9}
              roughness={0}
              metalness={1}
              emissive="#00E5FF"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      </Float>
    </>
  );
}

function ThreeScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) =>
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <Crystal mouse={mouse} />
    </Canvas>
  );
}

function CrystalFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="w-48 h-48 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #5B8CFF, #7C3AED, #00E5FF, #5B8CFF)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────

function CustomCursor() {
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 600, damping: 40 });
  const sy = useSpring(cy, { stiffness: 600, damping: 40 });
  const ox = useSpring(cx, { stiffness: 120, damping: 18 });
  const oy = useSpring(cy, { stiffness: 120, damping: 18 });

  useEffect(() => {
    const mv = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, [cx, cy]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", background: "#5B8CFF" }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          x: ox, y: oy,
          translateX: "-50%", translateY: "-50%",
          width: 32, height: 32,
          border: "1px solid rgba(91,140,255,0.35)",
        }}
      />
    </>
  );
}

// ─── SCROLL PROGRESS ─────────────────────────────────────────────────────────

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[9999] pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(to right, #5B8CFF, #7C3AED, #00E5FF)",
      }}
    />
  );
}

// ─── AURORA BACKGROUND ───────────────────────────────────────────────────────

function Aurora() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(91,140,255,0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* blobs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: "-200px", left: "-200px",
          background: "radial-gradient(circle, rgba(91,140,255,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          bottom: "-150px", right: "-100px",
          background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500,
          bottom: "20%", left: "30%",
          background: "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ─── SECTION TITLE ────────────────────────────────────────────────────────────

function SectionTitle({ label, title, sub }: { label: string; title: string; sub?: string }) {
  const words = title.split(" ");
  return (
    <div className="text-center mb-20">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-5 px-4 py-1.5 rounded-full"
        style={{ background: "rgba(91,140,255,0.12)", color: "#5B8CFF", border: "1px solid rgba(91,140,255,0.25)" }}
      >
        {label}
      </motion.span>

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </h2>

      {sub && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + words.length * 0.07, duration: 0.6 }}
          className="text-slate-400 max-w-lg mx-auto text-lg"
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const h = () => {
      const cur = window.scrollY;
      setVisible(cur < lastY.current || cur < 80);
      lastY.current = cur;
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        animate={{ y: visible ? 0 : -120 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4"
      >
        <div
          className="flex items-center gap-8 px-6 py-3 rounded-2xl"
          style={{
            background: "rgba(5, 8, 22, 0.75)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="text-lg font-bold tracking-wider text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span style={{ color: "#5B8CFF" }}>M</span>S
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
              >
                {link}
              </button>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-xl transition-all duration-200"
            style={{
              background: "rgba(91,140,255,0.15)",
              border: "1px solid rgba(91,140,255,0.35)",
              color: "#5B8CFF",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(91,140,255,0.28)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(91,140,255,0.15)")}
          >
            Hire Me
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl p-6 flex flex-col gap-4"
            style={{
              background: "rgba(5, 8, 22, 0.95)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="text-left text-white text-lg font-medium hover:text-blue-400 transition-colors"
              >
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const typed = useTypewriter(ROLES);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 80]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <Aurora />
      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, #050816 100%)",
        }}
      />

      <motion.div style={{ y: heroY }} className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-28 pb-20">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full"
            style={{
              background: "rgba(91,140,255,0.08)",
              border: "1px solid rgba(91,140,255,0.2)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                style={{ background: "#5B8CFF" }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: "#5B8CFF" }}
              />
            </span>
            <span className="text-xs tracking-[0.2em] uppercase text-blue-400 font-medium">
              Available for Work
            </span>
          </motion.div>

          <h1
            className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Hi, I&apos;m{" "}
            <span
              className="bg-clip-text text-transparent gradient-flow"
              style={{ backgroundImage: "linear-gradient(135deg, #5B8CFF 0%, #7C3AED 35%, #00E5FF 65%, #5B8CFF 100%)" }}
            >
              Monu Sharma
            </span>
          </h1>

          <div className="flex items-center gap-2 mb-8 h-8">
            <span className="text-xl md:text-2xl font-medium text-slate-300">{typed}</span>
            <span
              className="inline-block w-0.5 h-6 animate-pulse"
              style={{ background: "#5B8CFF" }}
            />
          </div>

          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
            I build modern, scalable and visually stunning web experiences with{" "}
            <span className="text-white font-medium">React</span>,{" "}
            <span className="text-white font-medium">Angular</span> and thoughtful UI Design.
          </p>

          <div className="flex flex-wrap gap-4">
            <MagneticButton
              className="px-7 py-3.5 rounded-xl font-semibold text-white flex items-center gap-2"
              style={{ background: "linear-gradient(135deg, #5B8CFF, #7C3AED)" }}
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Projects <ArrowRight size={15} />
            </MagneticButton>

            <MagneticButton
              className="px-7 py-3.5 rounded-xl font-semibold text-slate-300 flex items-center gap-2"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              href="./assets/monuResume.pdf"
            >
              <Download size={15} />
              Download Resume
            </MagneticButton>
          </div>

          {/* Floating badges */}
          <div className="flex flex-wrap gap-3 mt-10">
            {["React", "Angular", "TypeScript", "Figma", "Node.js"].map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1 rounded-full text-slate-400"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right: 3D scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block h-[520px] relative"
        >
          <Suspense fallback={<CrystalFallback />}>
            <ThreeScene />
          </Suspense>

          {/* Floating glass cards around the crystal */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 -left-4 px-4 py-3 rounded-2xl text-sm font-medium text-white"
            style={{
              background: "rgba(91,140,255,0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(91,140,255,0.25)",
            }}
          >
             Angular Developer
          </motion.div>

          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 -right-2 px-4 py-3 rounded-2xl text-sm font-medium text-white"
            style={{
              background: "rgba(124,58,237,0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            🎨 UI/UX Designer
          </motion.div>

          <motion.div
            animate={{ y: [-4, 8, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-36 left-4 px-4 py-3 rounded-2xl text-sm font-medium text-white"
            style={{
              background: "rgba(0,229,255,0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,229,255,0.2)",
            }}
          >
            ⚛ React Developer
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-600 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, rgba(91,140,255,0.6), transparent)" }}
        />
      </motion.div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCounter(value, active);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl font-extrabold bg-clip-text text-transparent mb-1"
        style={{ backgroundImage: "linear-gradient(135deg, #5B8CFF, #00E5FF)" }}
      >
        {count}{suffix}
      </div>
      <div className="text-slate-500 text-sm">{label}</div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle label="About Me" title="The Story Behind the Code" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: image placeholder with glass frame */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900">
              <img
                src={monu}
                alt="Monu Sharma"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(5,8,22,0.8))" }}
              />
            </div>

            {/* Floating glass frame accent */}
            <div
              className="absolute -top-4 -left-4 w-full h-full rounded-3xl pointer-events-none"
              style={{ border: "1px solid rgba(91,140,255,0.2)" }}
            />

            {/* Badge */}
            <motion.div
              animate={{ y: [-4, 6, -4] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 px-6 py-4 rounded-2xl"
              style={{
                background: "rgba(15,23,42,0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(91,140,255,0.2)",
              }}
            >
              <div className="text-2xl font-bold text-white">2+</div>
              <div className="text-slate-400 text-xs">Years building UIs</div>
            </motion.div>
          </motion.div>

          {/* Right: text + counters */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Frontend engineer with an eye for{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg,#5B8CFF,#7C3AED)" }}
              >
                exceptional design
              </span>
            </h3>

            <div className="space-y-4 text-slate-400 leading-relaxed mb-10">
              <p>
                I&apos;m Monu Sharma — a frontend developer passionate about crafting experiences
                that feel alive. My work lives at the intersection of{" "}
                <span className="text-white">engineering precision</span> and{" "}
                <span className="text-white">design sensibility</span>.
              </p>
              <p>
                Specializing in <span className="text-blue-400">React</span> and{" "}
                <span className="text-red-400">Angular</span>, I build scalable, responsive
                interfaces backed by thoughtful Figma prototypes. I&apos;m currently expanding
                into backend development with <span className="text-green-400">Node.js</span>{" "}
                and Express to complete the full-stack picture.
              </p>
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {["React", "Angular", "TypeScript", "Tailwind CSS", "Figma", "Responsive Design", "Node.js (learning)"].map((t) => (
                <span
                  key={t}
                  className="text-xs px-3 py-1.5 rounded-full text-slate-300"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Counter value={20} suffix="+" label="Projects" />
              <Counter value={15} suffix="+" label="Technologies" />
              <Counter value={2} suffix="+" label="Years Exp." />
              <Counter value={500} suffix="+" label="GH Commits" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sprX = useSpring(rotX, { stiffness: 280, damping: 22 });
  const sprY = useSpring(rotY, { stiffness: 280, damping: 22 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    rotX.set(-y * 22);
    rotY.set(x * 22);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.5 }}
      style={{ rotateX: sprX, rotateY: sprY, transformPerspective: 800 }}
      onMouseMove={handleMove}
      onMouseLeave={() => { rotX.set(0); rotY.set(0); }}
      whileHover={{ scale: 1.06 }}
      className="group relative p-5 rounded-2xl cursor-pointer"
      data-hover
    >
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
        style={{ boxShadow: `0 0 30px ${skill.color}30`, background: `${skill.color}08` }}
      />
      <div
        className="relative rounded-2xl p-5 flex flex-col items-center gap-3 text-center"
        style={{
          background: "rgba(15,23,42,0.6)",
          backdropFilter: "blur(12px)",
          border: `1px solid rgba(255,255,255,0.08)`,
          transition: "border-color 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${skill.color}50`)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold"
          style={{ background: `${skill.color}18`, color: skill.color, border: `1px solid ${skill.color}30` }}
        >
          {skill.tag}
        </div>
        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
}

const SKILL_CATEGORIES = [
  { label: "All",      filter: null },
  { label: "Frontend", filter: ["React","Angular","JavaScript","TypeScript","HTML5","CSS3","Tailwind CSS","Bootstrap","Responsive"] },
  { label: "Backend",  filter: ["Node.js","Express","MongoDB","REST APIs"] },
  { label: "Design & Tools", filter: ["Figma","Photoshop","Illustrator","Git","GitHub"] },
];

function Skills() {
  const [activeTab, setActiveTab] = useState(0);

  const visible = SKILL_CATEGORIES[activeTab].filter
    ? SKILLS.filter((s) => SKILL_CATEGORIES[activeTab].filter!.includes(s.name))
    : SKILLS;

  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          label="Skills"
          title="Tools of the Trade"
          sub="Technologies I use to build products people love."
        />

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {SKILL_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.label}
              onClick={() => setActiveTab(i)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={
                activeTab === i
                  ? {
                      background: "linear-gradient(135deg, #5B8CFF, #7C3AED)",
                      color: "#fff",
                      boxShadow: "0 4px 20px rgba(91,140,255,0.3)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#94a3b8",
                    }
              }
            >
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
        >
          {visible.map((s, i) => (
            <SkillCard key={s.name} skill={s} index={i} />
          ))}
        </motion.div>

        {/* Category count badge */}
        <motion.div
          key={`count-${activeTab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8 text-xs text-slate-600"
        >
          Showing {visible.length} of {SKILLS.length} technologies
        </motion.div>
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`relative rounded-3xl overflow-hidden group ${project.featured ? "col-span-1 md:col-span-2 row-span-2" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minHeight: project.featured ? 380 : 260,
        boxShadow: hovered
          ? "0 0 0 1.5px rgba(91,140,255,0.45), 0 24px 60px rgba(91,140,255,0.12)"
          : "0 0 0 1px rgba(255,255,255,0.07)",
        transition: "box-shadow 0.35s ease",
      }}
    >
      <img
        src={project.img}
        alt={project.title}
        className="w-full h-full object-cover absolute inset-0"
        style={{
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* overlay */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: hovered
            ? "linear-gradient(to top, rgba(5,8,22,0.97) 0%, rgba(5,8,22,0.65) 55%, rgba(5,8,22,0.15) 100%)"
            : "linear-gradient(to top, rgba(5,8,22,0.88) 0%, rgba(5,8,22,0.25) 55%, transparent 100%)",
        }}
      />

      {/* content */}
      <div className="absolute inset-0 p-7 flex flex-col justify-end">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-full text-slate-300"
              style={{ background: "rgba(91,140,255,0.15)", border: "1px solid rgba(91,140,255,0.25)" }}
            >
              {t}
            </span>
          ))}
        </div>

        <h3 className={`font-bold text-white mb-2 ${project.featured ? "text-2xl" : "text-lg"}`}>
          {project.title}
        </h3>

        <motion.p
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className="text-slate-400 text-sm leading-relaxed mb-4"
        >
          {project.desc}
        </motion.p>

        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex gap-3"
        >
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl text-white"
            style={{ background: "rgba(91,140,255,0.2)", border: "1px solid rgba(91,140,255,0.35)" }}
          >
            <ExternalLink size={13} /> Live Demo
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl text-slate-300"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <Github size={13} /> GitHub
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle label="Projects" title="Work That Speaks" sub="A selection of my most impactful builds." />
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[240px] gap-4">
          {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── EXPERIENCE TIMELINE ──────────────────────────────────────────────────────

function TimelineCard({ exp }: { exp: typeof EXPERIENCE[0] }) {
  return (
    <div
      className="p-6 rounded-2xl"
      style={{
        background: "rgba(15,23,42,0.7)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="text-xs text-blue-400 font-semibold tracking-[0.2em] uppercase mb-2">{exp.period}</div>
      <h4 className="text-lg font-bold text-white mb-0.5">{exp.role}</h4>
      <div className="text-slate-500 text-sm mb-3">{exp.company}</div>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{exp.desc}</p>
      <div className="flex flex-wrap gap-2">
        {exp.tags.map((t) => (
          <span key={t} className="text-xs px-2.5 py-1 rounded-full text-slate-400"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const DOT_STYLE = {
  background: "linear-gradient(135deg,#5B8CFF,#7C3AED)",
  boxShadow: "0 0 16px rgba(91,140,255,0.5)",
};

function Timeline() {
  return (
    <section id="experience" className="relative py-32">
      <div className="max-w-4xl mx-auto px-6">
        <SectionTitle label="Experience" title="Where I've Worked" />

        {/* ── Mobile: left-rail ── */}
        <div className="relative md:hidden pl-8">
          <div
            className="absolute left-3 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(91,140,255,0.45), rgba(124,58,237,0.35), transparent)" }}
          />
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-10"
            >
              <div className="absolute -left-8 top-6 w-4 h-4 rounded-full" style={DOT_STYLE} />
              <TimelineCard exp={exp} />
            </motion.div>
          ))}
        </div>

        {/* ── Desktop: alternating ── */}
        <div className="relative hidden md:block">
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(91,140,255,0.45), rgba(124,58,237,0.35), transparent)" }}
          />
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-start gap-8 mb-16 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="w-[calc(50%-32px)]">
                <TimelineCard exp={exp} />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-6">
                <div className="w-4 h-4 rounded-full" style={DOT_STYLE} />
              </div>
              <div className="w-[calc(50%-32px)]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LEARNING JOURNEY ─────────────────────────────────────────────────────────

function Journey() {
  return (
    <section className="relative py-32">
      <div className="max-w-2xl mx-auto px-6">
        <SectionTitle label="Learning" title="The Roadmap" sub="From frontend to full stack — in progress." />

        <div className="relative pl-8">
          <div
            className="absolute left-3 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, rgba(91,140,255,0.5), rgba(124,58,237,0.3), transparent)" }}
          />

          {JOURNEY.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative mb-8 flex items-start gap-4"
            >
              {/* Node */}
              <div className="absolute -left-8 top-0.5">
                {step.done ? (
                  <CheckCircle size={18} color="#5B8CFF" fill="rgba(91,140,255,0.15)" />
                ) : step.current ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-[18px] h-[18px] rounded-full border-2"
                    style={{ borderColor: "#00E5FF", background: "rgba(0,229,255,0.15)" }}
                  />
                ) : (
                  <Circle size={18} color="rgba(255,255,255,0.15)" />
                )}
              </div>

              {/* Content */}
              <div
                className={`p-4 rounded-xl w-full transition-all duration-300 ${step.current ? "ring-1" : ""}`}
                style={{
                  background: step.done
                    ? "rgba(91,140,255,0.08)"
                    : step.current
                    ? "rgba(0,229,255,0.06)"
                    : "rgba(255,255,255,0.03)",
                  border: step.done
                    ? "1px solid rgba(91,140,255,0.2)"
                    : step.current
                    ? "1px solid rgba(0,229,255,0.3)"
                    : "1px solid rgba(255,255,255,0.05)",
                  ringColor: step.current ? "rgba(0,229,255,0.3)" : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold ${step.done ? "text-white" : step.current ? "text-cyan-300" : "text-slate-500"}`}>
                    {step.label}
                  </span>
                  {step.current && (
                    <span className="text-xs px-2 py-0.5 rounded-full text-cyan-400"
                      style={{ background: "rgba(0,229,255,0.12)", border: "1px solid rgba(0,229,255,0.25)" }}>
                      In progress
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FIGMA SHOWCASE ───────────────────────────────────────────────────────────

function FigmaShowcase() {
  const [active, setActive] = useState(0);
  const current = FIGMA_SHOWCASES[active];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          label="Design"
          title="Figma Showcase"
          sub="UI designs crafted with purpose and precision."
        />

        {/* Featured preview */}
        <motion.div
          className="relative rounded-3xl overflow-hidden mb-5 cursor-pointer"
          style={{ height: 440 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={current.img}
              alt={current.title}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full object-cover absolute inset-0"
            />
          </AnimatePresence>

          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,8,22,0.92) 0%, rgba(5,8,22,0.3) 50%, transparent 100%)",
            }}
          />

          {/* Label top-right */}
          <div
            className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300"
            style={{
              background: "rgba(15,23,42,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Figma · UI/UX Design
          </div>

          {/* Info bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: "rgba(91,140,255,0.2)",
                      border: "1px solid rgba(91,140,255,0.35)",
                      color: "#5B8CFF",
                    }}
                  >
                    {active + 1} / {FIGMA_SHOWCASES.length}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{current.title}</h3>
                <p className="text-slate-400 text-sm max-w-lg">{current.sub}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Thumbnail strip */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {FIGMA_SHOWCASES.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex-none rounded-2xl overflow-hidden"
              style={{
                width: 140,
                height: 90,
                border:
                  active === i
                    ? "2px solid rgba(91,140,255,0.7)"
                    : "1px solid rgba(255,255,255,0.07)",
                boxShadow:
                  active === i ? "0 0 24px rgba(91,140,255,0.25)" : "none",
                transition: "border 0.2s, box-shadow 0.2s",
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 transition-opacity duration-200"
                style={{
                  background: active === i ? "rgba(91,140,255,0.12)" : "rgba(5,8,22,0.35)",
                }}
              />
              {/* Active underline */}
              {active === i && (
                <motion.div
                  layoutId="thumb-active"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{
                    background: "linear-gradient(to right, #5B8CFF, #7C3AED)",
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Prev / Next arrows */}
        <div className="flex gap-3 justify-end mt-5">
          {(["←", "→"] as const).map((arrow, dir) => (
            <motion.button
              key={arrow}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              onClick={() =>
                setActive((a) =>
                  dir === 0
                    ? (a - 1 + FIGMA_SHOWCASES.length) % FIGMA_SHOWCASES.length
                    : (a + 1) % FIGMA_SHOWCASES.length
                )
              }
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              {arrow}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY ME ───────────────────────────────────────────────────────────────────

function WhyMe() {
  return (
    <section className="relative py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle label="Value" title="Why Work With Me" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_ME.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="group p-7 rounded-2xl cursor-default"
              style={{
                background: "rgba(15,23,42,0.6)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}40`;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px ${item.color}18`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
              >
                <item.icon size={22} color={item.color} />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all duration-200";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <section id="contact" className="relative py-32">
      <div className="max-w-5xl mx-auto px-6">
        <SectionTitle label="Contact" title="Let's Build Together" sub="Open to freelance work, collaborations, and full-time roles." />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 space-y-6"
          >
            {[
              { icon: Mail, label: "Email", value: "sharmamonu42969@gmail.com", href: "sharmamoun42969@gmail.com" },
              { icon: Linkedin, label: "LinkedIn", value: "Monu Sharma", href: "https://www.linkedin.com/in/monusharma/" },
              { icon: Github, label: "GitHub", value: "m0nusharma", href: "https://github.com/m0nusharma" },
              { icon: MapPin, label: "Chandigarh", value: "India 🇮🇳", href: undefined },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(91,140,255,0.1)", border: "1px solid rgba(91,140,255,0.2)" }}>
                  <Icon size={16} color="#5B8CFF" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                  {href ? (
                    <a href={href} className="text-sm text-white hover:text-blue-400 transition-colors">{value}</a>
                  ) : (
                    <span className="text-sm text-white">{value}</span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 p-8 rounded-3xl"
            style={{
              background: "rgba(15,23,42,0.7)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle size={48} color="#5B8CFF" className="mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">Message sent!</h4>
                  <p className="text-slate-400">I&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <input
                    required
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(91,140,255,0.4)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(91,140,255,0.4)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <textarea
                    required
                    rows={5}
                    placeholder="Your Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={inputClass + " resize-none"}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(91,140,255,0.4)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #5B8CFF, #7C3AED)" }}
                  >
                    <Send size={16} />
                    Send Message
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  const socials = [
    { icon: Github, href: "https://github.com/m0nusharma", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/monusharma/", label: "LinkedIn" },
    { icon: Mail, href: "sharmamonu42969@gmail.com", label: "Email" },
  ];

  return (
    <footer className="relative overflow-hidden pt-20 pb-10">
      {/* Animated top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, #5B8CFF 30%, #7C3AED 60%, #00E5FF 80%, transparent 100%)",
        }}
      />

      {/* Large watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="text-[20vw] font-extrabold leading-none"
          style={{
            color: "rgba(255,255,255,0.015)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: "-0.05em",
          }}
        >
          MS
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Logo + tagline */}
          <div>
            <div
              className="text-3xl font-extrabold text-white mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em" }}
            >
              <span style={{ color: "#5B8CFF" }}>M</span>onu{" "}
              <span style={{ color: "#7C3AED" }}>S</span>harma
            </div>
            <p className="text-slate-500 text-sm">Frontend Developer · UI Designer · Angular &amp; React</p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() =>
                  document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-sm text-slate-500 hover:text-white transition-colors"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ y: -4, scale: 1.1 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(91,140,255,0.35)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-8" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © 2026 Monu Sharma. Built with React, Three.js &amp; passion.
          </p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-xs text-slate-600 hover:text-white transition-colors px-4 py-2 rounded-lg"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <ArrowUp size={13} />
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

// ─── MOUSE SPOTLIGHT ─────────────────────────────────────────────────────────

function MouseSpotlight() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    const h = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, [mouseX, mouseY]);

  const bg = useMotionTemplate`radial-gradient(650px at ${mouseX}px ${mouseY}px, rgba(91,140,255,0.045) 0%, transparent 75%)`;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{ background: bg }}
    />
  );
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────

function MagneticButton({
  children, className, style, onClick, href, target,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
  target?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const bx = useMotionValue(0);
  const by = useMotionValue(0);
  const sbx = useSpring(bx, { stiffness: 220, damping: 18 });
  const sby = useSpring(by, { stiffness: 220, damping: 18 });

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    bx.set((e.clientX - r.left - r.width / 2) * 0.28);
    by.set((e.clientY - r.top - r.height / 2) * 0.28);
  };
  const handleLeave = () => { bx.set(0); by.set(0); };

  const sharedProps = {
    style: { x: sbx, y: sby, ...style },
    className,
    onMouseMove: handleMove as never,
    onMouseLeave: handleLeave,
    whileTap: { scale: 0.96 as number },
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        {...sharedProps}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      {...sharedProps}
    >
      {children}
    </motion.button>
  );
}

// ─── MARQUEE TICKER ───────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "React", "Angular", "TypeScript", "Node.js", "Figma",
  "UI Design", "Responsive", "Tailwind CSS", "Three.js", "Clean Code",
  "REST APIs", "MongoDB", "Express", "Git", "Framer Motion",
];

function MarqueeTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      className="relative overflow-hidden py-4"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.015)",
      }}
    >
      <div className="flex gap-0 marquee-track whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-xs font-semibold tracking-[0.2em] uppercase text-slate-600"
          >
            {item}
            <span
              className="w-1 h-1 rounded-full inline-block flex-shrink-0"
              style={{ background: "#5B8CFF" }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── STATS STRIP ─────────────────────────────────────────────────────────────

const STATS_DATA = [
  { value: "20+", label: "Projects Shipped" },
  { value: "18+", label: "Technologies" },
  { value: "2+",  label: "Years of Experience" },
  { value: "40%", label: "Avg. Performance Gain" },
  { value: "100%", label: "Client Satisfaction" },
];

function StatsBanner() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(91,140,255,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-0">
          {STATS_DATA.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center md:border-r last:border-r-0"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent mb-2"
                style={{ backgroundImage: "linear-gradient(135deg, #ffffff 30%, rgba(255,255,255,0.5) 100%)" }}
              >
                {stat.value}
              </div>
              <div className="text-slate-500 text-xs tracking-widest uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COLLABORATION CTA ────────────────────────────────────────────────────────

function CollabCTA() {
  return (
    <section className="relative py-36 overflow-hidden">
      {/* large glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(91,140,255,0.1) 0%, rgba(124,58,237,0.07) 40%, transparent 70%)",
        }}
      />
      {/* grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(91,140,255,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles size={14} color="#5B8CFF" />
            <span className="text-xs tracking-[0.25em] uppercase text-blue-400 font-semibold">
              Open to Opportunities
            </span>
            <Sparkles size={14} color="#5B8CFF" />
          </div>

          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] mb-8"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="text-white">Let&apos;s build something</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #5B8CFF 0%, #7C3AED 50%, #00E5FF 100%)",
              }}
            >
              remarkable.
            </span>
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            A new product, a bold redesign, or a challenging engineering problem — I&apos;m ready to make it happen.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white text-base"
              style={{ background: "linear-gradient(135deg, #5B8CFF, #7C3AED)" }}
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Start a Conversation <ArrowRight size={18} />
            </MagneticButton>

            <MagneticButton
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-slate-300 text-base"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              href="./assets/monuResume.pdf"
              target="_blank"
            >
              <Download size={16} /> Download CV
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PRELOADER ───────────────────────────────────────────────────────────────

function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2400);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <motion.div
      key="preloader"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: "#050816" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(91,140,255,0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* MS logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-10"
      >
        <div
          className="text-8xl font-extrabold bg-clip-text text-transparent gradient-flow select-none"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            backgroundImage:
              "linear-gradient(135deg, #5B8CFF 0%, #7C3AED 40%, #00E5FF 70%, #5B8CFF 100%)",
            letterSpacing: "-0.04em",
          }}
        >
          MS
        </div>
        {/* Glow behind logo */}
        <div
          className="absolute inset-0 -z-10 blur-3xl opacity-40 rounded-full"
          style={{ background: "radial-gradient(circle, #5B8CFF, #7C3AED)" }}
        />
      </motion.div>

      {/* Name */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-slate-400 text-sm tracking-[0.25em] uppercase mb-10"
      >
        Monu Sharma · Portfolio 2026
      </motion.p>

      {/* Progress bar */}
      <div
        className="w-40 h-[2px] rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          className="h-full rounded-full bar-fill"
          style={{ background: "linear-gradient(to right, #5B8CFF, #7C3AED, #00E5FF)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ─── FLOATING BACK-TO-TOP ────────────────────────────────────────────────────

function FloatingBackTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const h = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="fab"
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center text-white"
          style={{
            background: "linear-gradient(135deg, #5B8CFF, #7C3AED)",
            boxShadow: "0 8px 32px rgba(91,140,255,0.35)",
          }}
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── DIVIDER ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(91,140,255,0.2), rgba(124,58,237,0.2), transparent)" }} />
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    const id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, [ready]);

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      {/* Preloader */}
      <AnimatePresence>{!ready && <Preloader onDone={() => setReady(true)} />}</AnimatePresence>

      {/* Main content fades in after preloader */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <MouseSpotlight />
        <ScrollProgress />
        <CustomCursor />
        <FloatingBackTop />
        <Navbar />
        <Hero />
        <MarqueeTicker />
        <Divider />
        <About />
        <Divider />
        <StatsBanner />
        <Divider />
        <Skills />
        <Divider />
        <Projects />
        <Divider />
        <Timeline />
        <Divider />
        <Journey />
        <Divider />
        <FigmaShowcase />
        <Divider />
        <WhyMe />
        <Divider />
        <CollabCTA />
        <Divider />
        <Contact />
        <Footer />
      </motion.div>
    </div>
  );
}
