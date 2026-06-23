export default function Hero() {
  return (
    <div className="relative z-10 px-4 pt-10 pb-12 text-center sm:px-6 md:pt-16 md:pb-16">
      {/* Eyebrow — commented out */}
      {/* <div className="mb-8 ..."> ... </div> */}

      <h1 className="font-sans text-[32px] font-bold leading-[1.15] text-fm-white sm:text-[48px] md:text-[60px] lg:text-[72px]">
        Manage Money
        <br />
        <span className="font-display italic font-normal">Smarter, </span>
        <span className="font-display italic font-normal">Faster, </span>
        <span className="font-display italic font-normal">Better</span>
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-base text-fm-silver sm:mt-6 sm:text-lg md:text-xl">
        Experience next-generation finance with powerful insights,
        automation, and real-time control.
      </p>
    </div>
  );
}