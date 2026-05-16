export default function Home() {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-[#F7F4EE] font-serif">
      <main className="flex flex-col items-center">
        <div className="mb-6 h-2 w-2 rounded-full bg-[#B8985A]" />
        <h1 className="text-8xl tracking-wide text-[#1A3A5C]">Tabilis</h1>
        <p className="mt-2 text-sm tracking-widest text-[#B8985A]">タビリス</p>
        <div className="my-6 h-px w-[60px] bg-[#B8985A]" />
        <p className="text-base italic text-[#4A4A4A]">
          不動産仲介の、新しい旅へ
        </p>
      </main>
      <footer className="absolute bottom-8 text-xs text-[#888888]">
        Operated by ThreeJam, Inc.
      </footer>
    </div>
  );
}
