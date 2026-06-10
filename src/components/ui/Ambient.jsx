// Fixed ambient light field + faint star grid behind all content.
// Pure CSS (see globals.css) — no client JS.
export default function Ambient() {
  return (
    <>
      <div className="aurora" aria-hidden />
      <div className="starfield" aria-hidden />
    </>
  );
}
