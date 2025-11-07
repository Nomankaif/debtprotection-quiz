// debtprotection-quiz/src/components/PartnerLogos.jsx
import React from "react";

function Logo({ file, alt, priority = false, width, height }) {
  const src = `${import.meta.env.BASE_URL}images/${file}`;
  return (
    <div className="flex items-center justify-center h-[60px] sm:h-[72px] md:h-[84px] lg:h-[96px] xl:h-[112px]">
      <img
        src={src}
        alt={alt}
        // If you know exact intrinsic size, pass width/height via props.
        {...(width && height ? { width, height } : {})}
        className="
          block max-h-full w-auto object-contain
          max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] xl:max-w-[300px]
        "
        // Priority hints
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        // decoding: leave default for priority; async for lazy
        {...(!priority ? { decoding: "async" } : {})}
        // Remove sizes since there's no srcSet; it's ignored otherwise.
        // If you add responsive assets later, add srcSet + sizes together.
      />
    </div>
  );
}

export default function PartnerLogos() {
  const logos = [
    { file: "11111.png", alt: "Consumer Affairs Buyer’s Choice 2024" },
    // { file: "22222.png", alt: "Forbes Advisor Best of 2024" },
    { file: "33333.png", alt: "ConsumersAdvocate.org" },
    { file: "44444.png", alt: "BBB A+ Accredited" },
    { file: "55555.png", alt: "Top Consumer Reviews 5 Star" },
  ];

  return (
    <section className="py-8 bg-white text-center">
      <div className="container-narrow max-w-6xl">
        {/* Mobile (< md): two rows. All priority to avoid late pop-in. */}
        <div className="md:hidden">
          <div className="flex justify-center gap-4 sm:gap-5">
            {logos.slice(0, 3).map(({ file, alt }) => (
              <Logo key={file} file={file} alt={alt} priority />
            ))}
          </div>

          <div className="mt-4 sm:mt-5 flex justify-center gap-4 sm:gap-5">
            {logos.slice(3).map(({ file, alt }) => (
              <Logo key={file} file={file} alt={alt} priority />
            ))}
          </div>
        </div>

        {/* Desktop (>= md): one row. You can set all to priority for instant paint,
           or only the first 3 as high and the last 2 as normal if you want to be frugal. */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 xl:gap-10">
          {logos.map(({ file, alt }, i) => (
            <Logo
              key={file}
              file={file}
              alt={alt}
              priority
              // If you know intrinsic size of these PNGs, add width/height here:
              // width={300} height={96}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
