import { SearchWidget } from './SearchWidget';

interface HeroProps {
  onSearch: (filters: { destination: string; date: string; duration: string }) => void;
  suggestions?: string[];
}

export function Hero({ onSearch, suggestions = [] }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 text-center px-6 w-full flex flex-col items-center">
        <h1 className="text-white text-6xl md:text-7xl font-serif font-light mb-4 drop-shadow-lg">
          Chalo India
        </h1>
        <p className="text-white/90 text-lg md:text-xl tracking-wide font-light mb-12 drop-shadow-md">
          Dil Se Desh Tak (From Heart to Country)
        </p>

        <SearchWidget onSearch={onSearch} suggestions={suggestions} />
      </div>
    </section>
  );
}
