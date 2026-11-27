export default function HeroIllustration() {
  return (
    <div className="hero-art" aria-hidden="true">
      <svg className="hero-cloud" viewBox="0 0 320 180" focusable="false">
        <path d="M46 150C20 150 14 116 38 108C30 78 62 60 84 74C94 38 146 30 160 62C178 44 226 50 226 88C256 82 280 104 268 132C292 140 286 160 262 160Z" />
      </svg>
      <svg className="hero-cloud hero-cloud-small" viewBox="0 0 160 90" focusable="false">
        <path d="M18 80C4 80 2 60 16 56C12 40 34 30 46 40C52 22 80 22 84 40C98 36 112 46 106 60C124 62 124 80 108 80Z" />
      </svg>
      <div className="hero-logo-frame">
        <img
          src="/logo-chapa-connecta.webp"
          width="600"
          height="573"
          alt="Logo da Chapa Connecta"
          className="hero-logo"
          fetchPriority="high"
        />
      </div>
      <svg className="hero-star hero-star-a" viewBox="0 0 40 40" focusable="false">
        <path d="M20 2L25 15L39 16L28 25L32 39L20 31L8 39L12 25L1 16L15 15Z" />
      </svg>
      <svg className="hero-star hero-star-b" viewBox="0 0 40 40" focusable="false">
        <path d="M20 2L25 15L39 16L28 25L32 39L20 31L8 39L12 25L1 16L15 15Z" />
      </svg>
      <span className="hero-dot hero-dot-pink" />
      <span className="hero-dot hero-dot-yellow" />
    </div>
  );
}
