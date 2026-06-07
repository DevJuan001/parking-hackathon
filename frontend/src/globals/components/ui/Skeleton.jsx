export default function Skeleton({
  count = 1,
  height = 14,
  width = "100%",
  backgroundColor = "#e2e5e7",
  darkModeBackgroundColor = "#000000",
  shineColor = "rgba(255,255,255,0.9)",
  darkModeShineColor = "rgba(255,255,255,0.1)",
  borderRadius = 6,
  marginBottom = 8,
}) {
  const dark = document.documentElement.classList.contains("dark");

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`relative overflow-hidden`}
          style={{
            height: height,
            width: width,
            borderRadius: borderRadius,
            backgroundColor: dark ? darkModeBackgroundColor : backgroundColor,
            marginBottom: count > 1 ? marginBottom : 0,
          }}
        >
          <div
            className="absolute inset-0 animate-shimmer bg-size-[400%_100%]"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent, ${dark ? darkModeShineColor : shineColor}, transparent)`,
            }}
          />
        </div>
      ))}
    </>
  );
}
