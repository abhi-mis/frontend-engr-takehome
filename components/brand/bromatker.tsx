// Propsoch's pun: "Broker" with "mat" wedged in also reads as "bro mat kar".
// The raised chip is structural, which is why this is markup and not a string.
export function Bromatker({ className }: { readonly className?: string }) {
  return (
    <span
      className={`relative inline-block font-extrabold tracking-[-0.03em] whitespace-nowrap ${className ?? ""}`}
    >
      Bro

      <sup className="mx-[0.04em] inline-block -translate-y-[0.18em] -rotate-[7deg] rounded-[0.14em] bg-accent-yellow px-[0.2em] py-[0.04em] align-baseline text-[0.42em] leading-none font-black tracking-tight text-on-brand shadow-[0_1px_0_rgba(0,0,0,0.18)]">
        mat
      </sup>
      ker
    </span>
  );
}
