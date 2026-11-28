/** Formas organicas decorativas do hero, inspiradas nas nuvens e estrelas da logo. */
export default function HeroDecor() {
  return (
    <svg className="hero-decor" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <path className="blob blob-blue" d="M330 40c70-30 150 0 190 50s30 110-10 150-60 70-110 80-110-10-140-60-40-100-10-150S260 60 330 40z" />
      <path className="blob blob-pink" d="M40 280c40-40 100-30 130 0s20 70-20 90-90 30-120-5-30-45 10-85z" />
      <path className="blob blob-light" d="M430 300c30-20 70-10 85 20s-5 60-35 65-65-10-70-40 0-35 20-45z" />
    </svg>
  );
}
