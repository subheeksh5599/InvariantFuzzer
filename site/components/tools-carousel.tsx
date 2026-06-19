"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, type PanInfo } from "motion/react";

interface ProtocolType {
  title: string;
  description: string;
  invariants: string;
}

const protocols: ProtocolType[] = [
  { title: "Vault", description: "Deposit & withdrawal programs", invariants: "Supply conservation, auth, rounding" },
  { title: "AMM", description: "Constant product pools", invariants: "k invariant, swap bounds, fee tracking" },
  { title: "Lending", description: "Collateralized borrowing", invariants: "LTV, liquidation math, interest accrual" },
  { title: "Staking", description: "Token staking & yield", invariants: "Reward proportion, cooldown, supply" },
  { title: "Governance", description: "DAO voting & execution", invariants: "Quorum, double-vote, lifecycle" },
  { title: "NFT", description: "Minting & metadata", invariants: "Exclusive ownership, royalties, supply" },
  { title: "Escrow", description: "Conditional asset holding", invariants: "Release conditions, cancel, expiry" },
  { title: "Bridge", description: "Cross-chain transfers", invariants: "Supply conservation, nonce, guardian threshold" },
  { title: "CLMM", description: "Concentrated liquidity", invariants: "Tick range, fee growth, sqrt price" },
  { title: "Multisig", description: "Multi-signature approval", invariants: "Threshold, no double-execute, signer set" },
  { title: "Perps", description: "Perpetual futures", invariants: "Margin, funding rate, open interest" },
  { title: "Oracle", description: "Price feeds", invariants: "Staleness, confidence, median aggregate" },
  { title: "Auction", description: "On-chain auctions", invariants: "Highest bid wins, outbid refund" },
  { title: "Treasury", description: "Fund management", invariants: "Spending limits, governance approval" },
  { title: "Token", description: "Token-2022 programs", invariants: "Supply, transfer fee, freeze authority" },
  { title: "Name Service", description: "On-chain naming", invariants: "Exclusive ownership, transfer auth" },
];

export function ToolsCarousel(): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && wrapperRef.current) {
        const containerWidth = containerRef.current.scrollWidth;
        const wrapperWidth = wrapperRef.current.offsetWidth;
        const maxDrag = Math.min(0, -(containerWidth - wrapperWidth));
        setConstraints({ left: maxDrag, right: 0 });
      }
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      cursorX.set(e.clientX - rect.left + 16);
      cursorY.set(e.clientY - rect.top - 16);
    }
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const velocity = info.velocity.x;
    const currentX = x.get();
    const momentumDistance = velocity * 0.3;
    let targetX = currentX + momentumDistance;
    if (targetX > 0) targetX = 0;
    else if (targetX < constraints.left) targetX = constraints.left;
    x.set(targetX);
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-2 text-2xl font-medium tracking-tight text-foreground md:text-3xl lg:text-4xl">
            16 protocol types covered
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            130+ pre-built invariants. Drag to explore.
          </p>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          ref={containerRef}
          className="flex cursor-grab gap-2.5 pr-48 active:cursor-grabbing pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-85rem)/2+2rem))]"
          style={{ x }}
          drag="x" dragConstraints={constraints} dragElastic={0.15}
          dragTransition={{ power: 0.3, timeConstant: 200, modifyTarget: (target) => Math.max(constraints.left, Math.min(0, target)) }}
          onDragEnd={handleDragEnd} onDragStart={() => setIsDragging(true)} whileDrag={{ cursor: "grabbing" }}
        >
          {protocols.map((proto, index) => (
            <motion.div
              key={proto.title}
              className="group flex w-64 shrink-0 flex-col rounded-xl bg-muted/50 px-6 py-6 transition-colors duration-300 hover:bg-accent sm:w-72"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl tracking-tight text-foreground mb-2 transition-colors duration-300 group-hover:text-white font-medium">
                {proto.title}
              </h3>
              <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-white/70">
                {proto.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {proto.invariants.split(", ").map((inv) => (
                  <span key={inv} className="rounded-full bg-background/50 px-2 py-0.5 text-xs text-muted-foreground transition-colors duration-300 group-hover:bg-white/10 group-hover:text-white/80 font-mono">
                    {inv}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-l from-background to-transparent md:w-48" aria-hidden="true" />

        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-50 flex items-center justify-center rounded-full border border-foreground/10 bg-background/20 px-4 py-2 text-xs font-medium tracking-tight text-white dark:text-foreground backdrop-blur-md"
          style={{ x: springX, y: springY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovering && !isDragging ? 1 : 0, scale: isHovering && !isDragging ? 1 : 0.8 }}
          transition={{ duration: 0.15 }}
        >
          Drag
        </motion.div>
      </div>
    </section>
  );
}
