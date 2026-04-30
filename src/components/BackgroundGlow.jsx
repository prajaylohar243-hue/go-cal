function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      <div className="absolute w-[400px] h-[400px] bg-black/10 dark:bg-white/10 rounded-full blur-3xl animate-blob top-[-100px] left-[-100px]" />

      <div className="absolute w-[400px] h-[400px] bg-black/10 dark:bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000 bottom-[-100px] right-[-100px]" />

      <div className="absolute w-[300px] h-[300px] bg-black/10 dark:bg-white/10 rounded-full blur-3xl animate-blob animation-delay-4000 top-[40%] left-[30%]" />

    </div>
  );
}

export default BackgroundGlow;