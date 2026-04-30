function BackgroundSVG() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      <svg
        className="absolute w-full h-full"
        viewBox="0 0 800 600"
      >

        <text x="10%" y="20%" fill="none" stroke="#9CA3AF" strokeWidth="0.5" opacity="0.08" fontSize="40">
          CALORIES
        </text>

        <text x="60%" y="40%" fill="none" stroke="#9CA3AF" strokeWidth="0.5" opacity="0.08" fontSize="50">
          PROTEIN
        </text>

        <text x="20%" y="70%" fill="none" stroke="#9CA3AF" strokeWidth="0.5" opacity="0.08" fontSize="45">
          WORKOUT
        </text>

        <text x="70%" y="80%" fill="none" stroke="#9CA3AF" strokeWidth="0.5" opacity="0.08" fontSize="35">
          PROGRESS
        </text>

      </svg>
    </div>
  );
}

export default BackgroundSVG;