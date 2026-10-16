/*
  PEEL. : landing page immersive d'une bananerie à Abidjan (promo -30% de la semaine).
  Job unique : faire commander une box pendant la promo.
  Type : Anton (titres monumentaux) + Space Grotesk 700 (texte).
  Couleurs : leaf #1E4D2B · ink #0F2A17 · yellow #FFD60A · deep yellow #F2C200 · acid #B5E550 · cream #FFFBEF
  Fil narratif : le cycle de maturité (vert -> jaune -> crème). La banane voyage de scène en scène.
  Signature : la scène d'épluchage pinnée (sticky natif + scrub via useScroll).
  Motion : framer-motion (useScroll/useTransform/useSpring), scroll natif, prefers-reduced-motion respecté.
*/
import { createContext, useContext, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  useReducedMotion,
  useMotionTemplate,
} from "framer-motion";
import bananaWhole from "./assets/Capture-removebg-preview.png";
import bananaPeeled from "./assets/uu1-removebg-preview.webp";
import womanBananas from "./assets/uuu2-removebg-preview.webp";

const C = {
  leaf: "#1E4D2B",
  ink: "#0F2A17",
  yellow: "#FFD60A",
  deep: "#F2C200",
  acid: "#B5E550",
  cream: "#FFFBEF",
};
const EASE = [0.22, 1, 0.36, 1];

const Reduced = createContext(false);
// l'hôte fait défiler #root (pas window) : on y branche tous les déclencheurs de scroll
const ROOT = { current: typeof document !== "undefined" ? document.getElementById("root") : null };

// useTransform qui se fige sur une valeur "repos" si l'utilisateur réduit les animations
function useRange(mv, input, output, rest) {
  const reduced = useContext(Reduced);
  const t = useTransform(mv, input, reduced ? output.map(() => rest) : output);
  // relais JS : évite l'accélération ScrollTimeline native, mal calée sur un conteneur de scroll custom
  return useTransform(t, (v) => v);
}

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/* ---------------------------------- NAV ---------------------------------- */
function Nav({ cart }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className="flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-3 shadow-[0_10px_30px_rgba(15,42,23,0.18)]"
        style={{ background: C.cream, color: C.leaf }}
        aria-label="Navigation principale"
      >
        <a href="#top" className="font-[Anton] text-2xl leading-none tracking-wide">
          PEEL<span style={{ color: C.deep }}>.</span>
        </a>
        <ul className="hidden items-center gap-8 text-[15px] font-bold md:flex">
          <li><a className="navlink" href="#manifeste">Manifeste</a></li>
          <li><a className="navlink" href="#origine">Origine</a></li>
          <li><a className="navlink" href="#promo">Promo -30%</a></li>
          <li><a className="navlink" href="#commander">Commander</a></li>
        </ul>
        <a
          href="#promo"
          className="flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-bold"
          style={{ background: C.leaf, color: C.yellow }}
        >
          Panier
          <motion.span
            key={cart}
            initial={{ scale: 1.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 14 }}
            className="grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[13px]"
            style={{ background: C.yellow, color: C.leaf }}
          >
            {cart}
          </motion.span>
        </a>
      </nav>
    </header>
  );
}

/* ---------------------------------- S1 HERO ---------------------------------- */
function Hero() {
  const ref = useRef(null);
  const reduced = useContext(Reduced);
  const { scrollYProgress: p } = useScroll({ container: ROOT, target: ref, offset: ["start start", "end end"] });

  const titleY = useRange(p, [0, 0.7], ["0vh", "-38vh"], "0vh");
  const titleScale = useRange(p, [0, 0.7], [1, 0.82], 1);
  const metaOpacity = useRange(p, [0, 0.15], [1, 0], 1);
  const bananaScale = useRange(p, [0.1, 0.85], [1, 1.9], 1);
  const bananaRotate = useRange(p, [0.1, 0.85], [0, -22], 0);
  const bananaY = useRange(p, [0.1, 0.85], ["0vh", "-8vh"], "0vh");
  const radius = useRange(p, [0.35, 0.92], [0, 150], 0);
  const clip = useMotionTemplate`circle(${radius}% at 50% 62%)`;

  const letters = "MÛRE.".split("");

  return (
    <section id="top" ref={ref} className={reduced ? "relative" : "relative h-[230vh]"}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: C.leaf }}>
        {/* grain de lumière ambiant */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(60% 50% at 50% 65%, #2B6B3C 0%, transparent 70%)` }}
        />

        <motion.h1
          aria-label="Mûre."
          style={{ y: titleY, scale: titleScale, color: C.yellow }}
          className="absolute inset-x-0 top-[18vh] flex justify-center font-[Anton] text-[40vw] leading-[0.82] tracking-[-0.01em] md:top-[19vh] md:text-[25vw]"
        >
          {letters.map((l, i) => (
            <span key={i} className="-mt-[0.16em] inline-block overflow-hidden pb-[0.04em] pt-[0.16em]" aria-hidden="true">
              <motion.span
                className="inline-block"
                initial={reduced ? false : { y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.15 + i * 0.07, ease: EASE }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* la banane, devant le titre */}
        <motion.div
          style={{ scale: bananaScale, rotate: bananaRotate, y: bananaY }}
          className="absolute inset-x-0 top-[50%] mx-auto w-[78vw] max-w-[560px] md:top-[46%] md:w-[40vw]"
        >
          <motion.div
            initial={reduced ? false : { y: "-120vh", rotate: -50 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 13, delay: 0.55 }}
          >
            <motion.img
              src={bananaWhole}
              alt="Une banane Cavendish mûre et une tranche coupée"
              className="w-full select-none"
              style={{ filter: "drop-shadow(0 34px 38px rgba(8,30,15,0.55))" }}
              animate={reduced ? undefined : { y: [0, -12, 0], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              draggable={false}
            />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: metaOpacity, color: C.cream }}
          className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-6 pb-7 md:px-10"
        >
          <p className="max-w-[260px] text-[16px] font-bold leading-snug">
            Bananes cueillies à point, livrées à Abidjan en moins de 2h.
          </p>
          <a
            href="#promo"
            className="shrink-0 rounded-full px-4 py-2 text-[14px] font-bold"
            style={{ background: C.acid, color: C.ink }}
          >
            -30% cette semaine ↓
          </a>
        </motion.div>

        {/* la banane "colore" la page : cercle jaune qui naît d'elle */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: C.yellow, clipPath: clip, WebkitClipPath: clip }}
        />
      </div>
    </section>
  );
}

/* ---------------------------------- S2 MANIFESTE ---------------------------------- */
const MANIFESTO =
  "On ne vend pas des bananes. On vend le moment exact où elles sont parfaites.".split(" ");
const ACCENT = new Set(["moment", "exact", "parfaites."]);

function Word({ word, p, range }) {
  const o = useRange(p, range, [0.14, 1], 1);
  const y = useRange(p, range, ["0.18em", "0em"], "0em");
  return (
    <motion.span style={{ opacity: o, y }} className="mr-[0.22em] inline-block">
      {ACCENT.has(word) ? (
        <span className="inline-block rounded-[0.1em] px-[0.12em] leading-[1]" style={{ background: C.leaf, color: C.yellow }}>{word}</span>
      ) : (
        word
      )}
    </motion.span>
  );
}

function Manifesto() {
  const ref = useRef(null);
  const reduced = useContext(Reduced);
  const { scrollYProgress: p } = useScroll({ container: ROOT, target: ref, offset: ["start start", "end end"] });
  const n = MANIFESTO.length;
  return (
    <section id="manifeste" ref={ref} className={reduced ? "relative" : "relative h-[240vh]"}>
      <div
        className="sticky top-0 flex h-screen flex-col justify-center px-6 md:px-14"
        style={{ background: C.yellow, color: C.leaf }}
      >
        <p className="mb-8 text-[15px] font-bold uppercase tracking-[0.2em]">Le manifeste PEEL.</p>
        <h2 className="max-w-[1200px] font-[Anton] text-[13vw] uppercase leading-[1.08] md:text-[6.6vw]">
          {MANIFESTO.map((w, i) => (
            <Word key={i} word={w} p={p} range={[0.05 + (i / n) * 0.7, 0.05 + ((i + 1) / n) * 0.7]} />
          ))}
        </h2>
      </div>
    </section>
  );
}

/* ---------------------------------- S3 ÉPLUCHAGE (scène signature) ---------------------------------- */
const CLAIMS = [
  { t: "Cueillie à maturité", s: "72h de l'arbre à ta main", pos: "left-[5%] top-[18%] md:left-[8%] md:top-[20%]", side: "l" },
  { t: "Origine Aboisso", s: "Plantations du sud-est ivoirien", pos: "right-[5%] top-[30%] md:right-[8%] md:top-[24%]", side: "r" },
  { t: "Zéro gaspillage", s: "Les tachetées finissent en banana bread", pos: "left-[5%] bottom-[16%] md:left-[10%] md:bottom-[22%]", side: "l" },
  { t: "Livrée à vélo", s: "Cocody, Plateau, Marcory", pos: "right-[5%] bottom-[8%] md:right-[10%] md:bottom-[16%]", side: "r" },
];

function Claim({ c, p, i }) {
  const start = 0.5 + i * 0.07;
  const y = useRange(p, [start, start + 0.08], ["110%", "0%"], "0%");
  const line = useRange(p, [start, start + 0.08], [0, 1], 1);
  const out = useRange(p, [0.84, 0.9], [1, 0], 1);
  return (
    <motion.div style={{ opacity: out }} className={`absolute z-[5] w-[42vw] max-w-[340px] ${c.pos} ${c.side === "r" ? "text-right" : ""}`}>
      <motion.div
        style={{ scaleX: line, background: C.leaf, originX: c.side === "r" ? 1 : 0 }}
        className="mb-3 h-[3px] w-full"
      />
      <div className="overflow-hidden">
        <motion.p style={{ y }} className="pb-1 font-[Anton] text-[24px] uppercase leading-[1.05] md:text-[34px]">
          {c.t}
        </motion.p>
      </div>
      <div className="overflow-hidden">
        <motion.p style={{ y }} className="text-[15px] font-bold leading-snug md:text-[16px]">
          {c.s}
        </motion.p>
      </div>
    </motion.div>
  );
}

function PeelScene() {
  const ref = useRef(null);
  const reduced = useContext(Reduced);
  const { scrollYProgress: p } = useScroll({ container: ROOT, target: ref, offset: ["start start", "end end"] });

  const bgX = useRange(p, [0, 1], ["8%", "-38%"], "0%");
  // arrivée de la banane entière
  const wholeX = useRange(p, [0, 0.18], ["70vw", "0vw"], "0vw");
  const wholeRot = useRange(p, [0, 0.18, 0.4], [25, 0, -62], -62);
  const peel = useRange(p, [0.28, 0.5], [0, 100], 100);
  const wholeClip = useMotionTemplate`inset(${peel}% 0% 0% 0%)`;
  const peeledInv = useTransform(peel, (v) => 100 - v);
  const peeledClip = useMotionTemplate`inset(0% 0% ${peeledInv}% 0%)`;
  const peeledScale = useRange(p, [0.28, 0.55, 0.84, 1], [0.85, 1.1, 1.1, 0.55], 1.1);
  const peeledRot = useRange(p, [0.28, 0.55], [-12, 0], 0);
  // sortie : la banane épluchée glisse vers la 1re carte produit
  const stageX = useRange(p, [0.84, 1], ["0vw", "-24vw"], "0vw");
  const stageY = useRange(p, [0.84, 1], ["0vh", "30vh"], "0vh");
  const cream = useRange(p, [0.84, 0.98], [100, -1], 100);
  const creamClip = useMotionTemplate`inset(${cream}% 0% 0% 0%)`;
  const hint = useRange(p, [0.2, 0.3], [1, 0], 0);

  return (
    <section id="origine" ref={ref} className={reduced ? "relative" : "relative h-[420vh]"} style={{ background: C.cream }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: C.yellow, color: C.leaf }}>
        <motion.p
          aria-hidden="true"
          style={{ x: bgX, color: C.deep }}
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-[Anton] text-[46vw] leading-none md:text-[30vw]"
        >
          PELER · PELER
        </motion.p>

        <motion.div
          aria-hidden="true"
          style={{ opacity: hint }}
          className="absolute inset-x-0 top-[13%] text-center text-[15px] font-bold uppercase tracking-[0.2em]"
        >
          Continue de scroller pour éplucher
        </motion.div>

        <div className={reduced ? "relative z-0 grid h-full place-items-center" : "absolute inset-0 grid place-items-center"}>
          <motion.div style={{ x: stageX, y: stageY }} className="relative z-30 grid place-items-center">
            {!reduced && (
              <motion.img
                src={bananaWhole}
                alt=""
                aria-hidden="true"
                draggable={false}
                style={{ x: wholeX, rotate: wholeRot, clipPath: wholeClip, WebkitClipPath: wholeClip }}
                className="absolute w-[72vw] max-w-[460px] md:w-[40vw]"
              />
            )}
            <motion.div style={{ scale: peeledScale, rotate: peeledRot, filter: "drop-shadow(0 30px 30px rgba(15,42,23,0.35))" }}>
              <motion.img
                src={bananaPeeled}
                alt="Une banane à moitié épluchée"
                draggable={false}
                style={{ clipPath: reduced ? "none" : peeledClip, WebkitClipPath: reduced ? "none" : peeledClip }}
                className="w-[48vw] max-w-[300px] md:w-[22vw]"
              />
            </motion.div>
          </motion.div>
        </div>

        {CLAIMS.map((c, i) => (
          <Claim key={c.t} c={c} p={p} i={i} />
        ))}

        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-10"
          style={{ background: C.cream, clipPath: creamClip, WebkitClipPath: creamClip }}
        />
      </div>
    </section>
  );
}

/* ---------------------------------- S4 PROMO ---------------------------------- */
function TitleLine({ text, p, i }) {
  const y = useRange(p, [i * 0.15, 0.7 + i * 0.15], ["105%", "0%"], "0%");
  const x = useRange(p, [i * 0.15, 0.7 + i * 0.15], [i ? "-6vw" : "6vw", "0vw"], "0vw");
  return (
    <span className="-mt-[0.14em] block overflow-hidden pt-[0.14em]">
      <motion.span style={{ y, x }} className="block">{text}</motion.span>
    </span>
  );
}

function PromoTitle() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ container: ROOT, target: ref, offset: ["start end", "start 0.45"] });
  return (
    <h2 ref={ref} className="font-[Anton] text-[16vw] uppercase leading-[0.9] md:text-[8vw]">
      <TitleLine text="La semaine" p={p} i={0} />
      <TitleLine text="des mûres." p={p} i={1} />
    </h2>
  );
}

function Marquee() {
  const reduced = useContext(Reduced);
  const base = useMotionValue(0);
  const { scrollY } = useScroll({ container: ROOT });
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  useAnimationFrame((_, dt) => {
    if (reduced) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    let m = dir.current * -3 * (dt / 1000);
    m += m * Math.abs(f);
    base.set(base.get() + m);
  });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const chunk = "-30% CETTE SEMAINE ✦ BANANES MÛRES À POINT ✦ ";
  return (
    <div className="relative z-10 -rotate-2 overflow-hidden py-4" style={{ background: C.acid, color: C.ink }}>
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap font-[Anton] text-[11vw] leading-none md:text-[6vw]">
        <span aria-hidden="true">{chunk.repeat(3)}</span>
        <span aria-hidden="true">{chunk.repeat(3)}</span>
      </motion.div>
      <span className="sr-only">Moins 30% cette semaine sur toutes les bananes mûres à point.</span>
    </div>
  );
}

const PRODUCTS = [
  { name: "Cavendish du matin", detail: "Régime de 6, sucré à point", old: "2 500", now: "1 750", img: bananaPeeled, bg: C.yellow, fg: C.leaf, imgW: "w-[46%]" },
  { name: "Plantain doré", detail: "1 kg, parfait pour l'alloco", old: "1 800", now: "1 260", img: bananaWhole, bg: C.leaf, fg: C.cream, imgW: "w-[78%]" },
  { name: "Box smoothie", detail: "12 bananes et 3 recettes", old: "6 000", now: "4 200", img: bananaWhole, bg: C.acid, fg: C.ink, imgW: "w-[70%]", flip: true },
];

function ProductCard({ prod, i, onAdd }) {
  const ref = useRef(null);
  const reduced = useContext(Reduced);
  const { scrollYProgress: p } = useScroll({ container: ROOT, target: ref, offset: ["start end", "start 0.35"] });
  const y = useRange(p, [0, 1], [160 + i * 90, 0], 0);
  const scale = useRange(p, [0, 1], [0.88, 1], 1);
  const rot = useRange(p, [0, 1], [4 + i * 2, 0], 0);
  const strike = useRange(p, [0.55, 0.8], [0, 1], 1);
  const priceY = useRange(p, [0.75, 1], ["110%", "0%"], "0%");

  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);

  const move = (e) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
    setHover(false);
  };

  return (
    <motion.div ref={ref} style={{ y, scale, rotate: rot }} className="[perspective:1000px]">
      <motion.article
        onPointerMove={move}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={leave}
        style={{ rotateX: rx, rotateY: ry, background: prod.bg, color: prod.fg, transformStyle: "preserve-3d" }}
        className="relative flex h-[520px] flex-col overflow-hidden rounded-[28px] p-6 md:h-[560px]"
      >
        <div className="flex items-start justify-between">
          <span className="rounded-full px-3 py-1 text-[14px] font-bold" style={{ background: prod.fg, color: prod.bg }}>
            -30%
          </span>
          <span className="text-[14px] font-bold opacity-80">FCFA</span>
        </div>

        <div className="grid flex-1 place-items-center" style={{ transform: "translateZ(60px)" }}>
          <motion.img
            src={prod.img}
            alt={prod.name}
            draggable={false}
            animate={reduced ? undefined : { y: hover ? -16 : 0, rotate: hover ? (prod.flip ? 8 : -6) : 0, scale: hover ? 1.06 : 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className={`${prod.imgW} select-none`}
            style={{ filter: "drop-shadow(0 22px 22px rgba(15,42,23,0.35))", scaleX: prod.flip ? -1 : 1 }}
          />
        </div>

        <div style={{ transform: "translateZ(30px)" }}>
          <h3 className="font-[Anton] text-[34px] uppercase leading-none">{prod.name}</h3>
          <p className="mt-2 text-[16px] font-bold opacity-80">{prod.detail}</p>
          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="flex items-end gap-3">
              <span className="relative text-[18px] font-bold opacity-60">
                {prod.old}
                <motion.span
                  aria-hidden="true"
                  style={{ scaleX: strike, background: prod.fg }}
                  className="absolute left-[-4%] top-1/2 h-[2px] w-[108%] origin-left"
                />
                <span className="sr-only"> au lieu de</span>
              </span>
              <span className="overflow-hidden">
                <motion.span style={{ y: priceY }} className="inline-block font-[Anton] text-[44px] leading-[0.95]">
                  {prod.now}
                </motion.span>
              </span>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                onAdd();
                setAdded(true);
                setTimeout(() => setAdded(false), 1400);
              }}
              className="addbtn relative overflow-hidden rounded-full px-4 py-3 text-[14px] font-bold"
              style={{ background: prod.fg, color: prod.bg }}
              aria-label={`Ajouter ${prod.name} au panier`}
            >
              <span className="relative z-10">{added ? "Ajoutée ✓" : "Ajouter +"}</span>
            </motion.button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

function Promo({ onAdd }) {
  const reduced = useContext(Reduced);
  return (
    <section id="promo" className="relative overflow-hidden pb-28" style={{ background: C.cream, color: C.leaf }}>
      <div className="pt-10">
        <Marquee />
      </div>
      <div className="mx-auto max-w-6xl px-6 pt-24 md:px-10">
        <PromoTitle />
        <p className="mt-6 max-w-md text-[17px] font-bold leading-snug">
          Prix barrés jusqu'à dimanche. Après, elles redeviennent juste délicieuses.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {PRODUCTS.map((prod, i) => (
            <ProductCard key={prod.name} prod={prod} i={i} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- S5 LIFESTYLE ---------------------------------- */
function Lifestyle() {
  const ref = useRef(null);
  const reduced = useContext(Reduced);
  const { scrollYProgress: p } = useScroll({ container: ROOT, target: ref, offset: ["start end", "end end"] });
  const curtain = useRange(p, [0.02, 0.35], [101, 0], 0);
  const curtainClip = useMotionTemplate`inset(${curtain}% 0% 0% 0%)`;
  const imgScale = useRange(p, [0.15, 0.75], [1.3, 1], 1);
  const l1 = useRange(p, [0.1, 1], ["12vw", "-10vw"], "0vw");
  const l2 = useRange(p, [0.1, 1], ["-12vw", "10vw"], "0vw");
  const f1 = useRange(p, [0, 1], ["40vh", "-50vh"], "0vh");
  const f2 = useRange(p, [0, 1], ["70vh", "-20vh"], "0vh");
  const f3 = useRange(p, [0, 1], ["90vh", "-80vh"], "0vh");
  const r1 = useRange(p, [0, 1], [-40, 30], 0);
  const r2 = useRange(p, [0, 1], [30, -20], 0);

  return (
    <section ref={ref} className={reduced ? "relative" : "relative h-[240vh]"} style={{ background: C.cream }}>
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: C.yellow, color: C.leaf, clipPath: curtainClip, WebkitClipPath: curtainClip }}
      >
        <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-center font-[Anton] text-[18vw] uppercase leading-[0.86] md:text-[12.5vw]">
          <motion.span style={{ x: l1 }} className="block whitespace-nowrap pl-[4vw]">L'énergie qui</motion.span>
          <motion.span style={{ x: l2 }} className="block whitespace-nowrap pl-[18vw]">se pèle.</motion.span>
        </div>
        <h2 className="sr-only">L'énergie qui se pèle.</h2>

        {/* banane lointaine, derrière */}
        <motion.img
          src={bananaWhole} alt="" aria-hidden="true" draggable={false}
          style={{ y: f2, rotate: r2 }}
          className="absolute left-[6%] top-[55%] w-[22vw] max-w-[200px] opacity-90"
        />

        <motion.img
          src={womanBananas}
          alt="Une femme souriante entourée de bananes en l'air"
          draggable={false}
          style={{
            scale: imgScale,
            originY: 1,
            WebkitMaskImage: "linear-gradient(to bottom, black 62%, transparent 96%)",
            maskImage: "linear-gradient(to bottom, black 62%, transparent 96%)",
          }}
          className="absolute inset-x-0 bottom-0 mx-auto w-[120vw] max-w-[860px] md:w-[62vw]"
        />

        {/* bananes au premier plan, plus rapides : profondeur */}
        <motion.img
          src={bananaWhole} alt="" aria-hidden="true" draggable={false}
          style={{ y: f1, rotate: r1, filter: "blur(1.5px) drop-shadow(0 30px 30px rgba(15,42,23,0.35))" }}
          className="absolute right-[4%] top-[48%] w-[36vw] max-w-[340px]"
        />
        <motion.img
          src={bananaWhole} alt="" aria-hidden="true" draggable={false}
          style={{ y: f3, rotate: r2, filter: "blur(3px)" }}
          className="absolute left-[28%] top-[85%] w-[30vw] max-w-[280px] opacity-95"
        />

        <p className="absolute bottom-7 right-6 z-10 max-w-[220px] text-right text-[16px] font-bold md:right-10">
          Potassium, sourire, on recommence.
        </p>
      </motion.div>
    </section>
  );
}

/* ---------------------------------- S6 CTA ---------------------------------- */
function BigLetter({ l, i, p }) {
  const s = i * 0.08;
  const y = useRange(p, [s, s + 0.55], ["70%", "0%"], "0%");
  const rot = useRange(p, [s, s + 0.55], [10, 0], 0);
  return (
    <span className="inline-block overflow-hidden" aria-hidden="true">
      <motion.span style={{ y, rotate: rot }} className="inline-block">
        {l}
      </motion.span>
    </span>
  );
}

function Magnetic({ children }) {
  const reduced = useContext(Reduced);
  const x = useSpring(0, { stiffness: 220, damping: 15 });
  const y = useSpring(0, { stiffness: 220, damping: 15 });
  return (
    <div
      className="inline-block p-6"
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.35);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  );
}

function Finale() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ container: ROOT, target: ref, offset: ["start end", "center center"] });
  return (
    <section id="commander" ref={ref} className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-8 pt-28 md:px-10" style={{ background: C.leaf, color: C.cream }}>
      <div className="flex flex-col items-center text-center">
        <p className="text-[16px] font-bold uppercase tracking-[0.2em]" style={{ color: C.acid }}>
          Ta box arrive en moins de 2h
        </p>
        <h2 aria-label="Peel." className="mt-4 font-[Anton] text-[42vw] leading-[0.8] md:text-[30vw]" style={{ color: C.yellow }}>
          {"PEEL.".split("").map((l, i) => (
            <BigLetter key={i} l={l} i={i} p={p} />
          ))}
        </h2>
        <Magnetic>
          <a
            href="#promo"
            className="ctabtn relative block overflow-hidden rounded-full px-9 py-5 font-[Anton] text-[22px] uppercase tracking-wide md:text-[26px]"
            style={{ background: C.yellow, color: C.leaf }}
          >
            <span className="relative z-10">Commander ma box</span>
          </a>
        </Magnetic>
      </div>
      <footer className="mt-16 flex flex-col gap-3 text-[15px] font-bold opacity-85 md:flex-row md:justify-between">
        <span>12 rue des Jardins, Cocody, Abidjan</span>
        <span>Lundi au samedi, 7h à 20h</span>
        <span>Promo valable jusqu'au dimanche 18 octobre</span>
      </footer>
    </section>
  );
}

/* ---------------------------------- APP ---------------------------------- */
export default function App() {
  const reduced = useReducedMotion();
  const [cart, setCart] = useState(0);
  return (
    <Reduced.Provider value={!!reduced}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@500;700&display=swap"
      />
      <style>{`
        html { background: ${C.leaf}; }
        @media (prefers-reduced-motion: no-preference) { #root { scroll-behavior: smooth; } }
        #root { overflow-x: hidden; position: relative; }
        body { font-family: 'Space Grotesk', system-ui, sans-serif; }
        ::selection { background: ${C.acid}; color: ${C.ink}; }
        a:focus-visible, button:focus-visible { outline: 3px solid ${C.acid}; outline-offset: 3px; }
        .navlink { position: relative; }
        .navlink::after { content:''; position:absolute; left:0; right:0; bottom:-4px; height:2px; background:${C.leaf};
          transform: scaleX(0); transform-origin: right; transition: transform .45s cubic-bezier(.22,1,.36,1); }
        .navlink:hover::after { transform: scaleX(1); transform-origin: left; }
        .addbtn::before, .ctabtn::before { content:''; position:absolute; inset:0; border-radius:inherit; background:${C.acid};
          transform: translateY(101%); transition: transform .45s cubic-bezier(.22,1,.36,1); }
        .addbtn:hover::before, .ctabtn:hover::before { transform: translateY(0); }
        .addbtn:hover, .ctabtn:hover { color: ${C.ink} !important; }
      `}</style>
      <Nav cart={cart} />
      <main className="overflow-x-clip">
        <Hero />
        <Manifesto />
        <PeelScene />
        <Promo onAdd={() => setCart((c) => c + 1)} />
        <Lifestyle />
        <Finale />
      </main>
    </Reduced.Provider>
  );
}
