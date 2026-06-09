// Squared mono tech tag (not a generic rounded-full pill).
export default function Badge({ children }) {
  return (
    <span className="inline-block rounded-md border border-accent-line bg-accent-tint px-2 py-1 font-mono text-[0.68rem] text-accent-strong dark:text-accent">
      {children}
    </span>
  );
}
