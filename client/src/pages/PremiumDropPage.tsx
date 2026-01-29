import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSubmitTelegram } from '@/hooks/use-telegram';
import { useToast } from '@/hooks/use-toast';
import { Volume2, VolumeX, X, Check } from 'lucide-react';

const PAYMENT_EMAIL = 'support@brigit.work';

type Color = 'black' | 'blue' | 'purple' | 'white';
type View = 'front' | 'back';

type Product = {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  images: Record<Color, Record<View, string>>;
};

const PRODUCTS: Product[] = [
  {
    id: 'tee',
    title: 'Concert Tee',
    tag: 'Lightweight • Florida heat ready',
    blurb: 'Breathable weave, matte finish, minimal branding. Built for humid arenas.',
    images: {
      black: {
        front: '/images/products/tee-black-front.jpg',
        back: '/images/products/tee-black-back.jpg'
      },
      blue: {
        front: '/images/products/tee-blue-front.jpg',
        back: '/images/products/tee-blue-back.jpg'
      },
      purple: {
        front: '/images/products/tee-purple-front.jpg',
        back: '/images/products/tee-purple-back.jpg'
      },
      white: {
        front: '/images/products/tee-white-front.jpg',
        back: '/images/products/tee-white-back.jpg'
      }
    }
  },
  {
    id: 'hoodie',
    title: 'Night Hoodie',
    tag: 'Heavyweight • Premium feel',
    blurb: 'Oversized drape, brushed fleece, hidden pocket stitch. After-show uniform.',
    images: {
      black: {
        front: '/images/products/hoodie-black-front.jpg',
        back: '/images/products/hoodie-black-back.jpg'
      },
      blue: {
        front: '/images/products/hoodie-blue-front.jpg',
        back: '/images/products/hoodie-blue-back.jpg'
      },
      purple: {
        front: '/images/products/hoodie-purple-front.jpg',
        back: '/images/products/hoodie-purple-back.jpg'
      },
      white: {
        front: '/images/products/hoodie-white-front.jpg',
        back: '/images/products/hoodie-white-back.jpg'
      }
    }
  },
];

function ProductCard({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState<Color>('black');
  const [selectedView, setSelectedView] = useState<View>('front');

  const colors: { name: Color; class: string }[] = [
    { name: 'black', class: 'bg-[#1a1a1a]' },
    { name: 'white', class: 'bg-[#f5f5f5]' },
    { name: 'blue', class: 'bg-[#7ba4cc]' },
    { name: 'purple', class: 'bg-[#5e3a8c]' },
  ];

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10">
      <div className="relative overflow-hidden rounded-2xl bg-black/40 aspect-[4/5] md:aspect-square">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60" />
        <img
          src={product.images[selectedColor][selectedView]}
          alt={`${product.title} - ${selectedColor} ${selectedView}`}
          className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
        />
        
        {/* View Toggle */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button 
            onClick={() => setSelectedView('front')}
            className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider transition ${selectedView === 'front' ? 'bg-white text-black' : 'bg-black/40 text-white/60 hover:bg-black/60'}`}
          >
            Front
          </button>
          <button 
            onClick={() => setSelectedView('back')}
            className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider transition ${selectedView === 'back' ? 'bg-white text-black' : 'bg-black/40 text-white/60 hover:bg-black/60'}`}
          >
            Back
          </button>
        </div>

        <div className="absolute inset-x-6 bottom-6 z-20 flex items-end justify-between">
          <div className="text-xs uppercase tracking-[0.4em] text-white/90 font-bold font-display">{product.title}</div>
          
          {/* Color Selector */}
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${c.class} ${selectedColor === c.name ? 'border-pink-500 scale-110' : 'border-white/20'}`}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <p className="text-sm text-pink-200/80 font-medium tracking-wide">{product.tag}</p>
        <p className="text-sm text-white/60 leading-relaxed font-light">{product.blurb}</p>
      </div>
    </article>
  );
}

export default function PremiumDropPage() {
  const [claimed, setClaimed] = useState(241);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState<HTMLAudioElement | null>(null);
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [commitment, setCommitment] = useState('Yes, I’m ready to reserve');
  const [countdown, setCountdown] = useState(getCountdown());
  const [storyOpen, setStoryOpen] = useState(false);
  
  const { toast } = useToast();
  const submitMutation = useSubmitTelegram();

  const recordEvent = useCallback(async (event: string, payload: Record<string, unknown>) => {
    try {
      await submitMutation.mutateAsync({ 
        event, 
        payload: {
          email: payload.email as string,
          location: payload.location as string,
          commitment: payload.commitment as string
        }
      });
    } catch (error) {
      console.error('Failed to notify Telegram', error);
    }
  }, [submitMutation]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const jitter = setInterval(() => setClaimed((prev) => prev + (Math.random() > 0.85 ? 1 : 0)), 7000);
    return () => clearInterval(jitter);
  }, []);

  useEffect(() => {
    if (!ambientAudio) {
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8b846505a.mp3?filename=ambient-piano-12502.mp3'); 
      audio.loop = true;
      audio.volume = 0.25;
      setAmbientAudio(audio);
      return;
    }
    if (isAudioOn) {
      ambientAudio.play().catch(() => setIsAudioOn(false));
    } else {
      ambientAudio.pause();
    }
  }, [isAudioOn, ambientAudio]);

  const countdownLabel = useMemo(() => {
    const { days, hours, minutes, seconds } = countdown;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, [countdown]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    
    try {
      await recordEvent('founders-signup', { email, location, commitment });
      
      toast({
        title: "You're on the list",
        description: "Watch your inbox for pricing + proof instructions.",
        duration: 5000,
      });
      
      setEmail('');
      setLocation('');
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Could not join the list. Please try again.",
        variant: "destructive"
      });
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#040404] text-white selection:bg-pink-500/30 font-sans">
      <GradientHero countdownLabel={countdownLabel} claimed={claimed} onStory={() => setStoryOpen(true)} />

      <section className="mx-auto mt-16 grid max-w-5xl gap-8 px-6 md:grid-cols-2">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-3xl px-6 text-white/80">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50 mb-6 font-semibold font-display">Why this drop exists</p>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-lg md:text-xl text-white/90 backdrop-blur-2xl leading-relaxed font-light">
          <p>
            Tampa ARMY deserved something made for the city—not generic tour merch shipped from anywhere else. We built this first micro-run for the fans who showed up early, rehearsed in parking lots,
            and kept the lightsticks up when it poured. That’s the entire story.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-6">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 backdrop-blur-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-white/50 mb-6 font-semibold font-display">Founders benefits</p>
          <ul className="grid gap-4 text-sm text-white/80 md:grid-cols-2">
            {[
              "Priority access to the batch window",
              "Limited colors exclusive to Tampa drop",
              "Early production run before public release",
              "Locked sizing and slot before the wider announcement"
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10">
                <Check className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="founders-form" className="mx-auto mt-24 max-w-3xl px-6 scroll-mt-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 text-white backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <div className="w-64 h-64 bg-pink-500 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.4em] text-white/50 font-semibold font-display">Join founders list</p>
            <h3 className="mt-4 text-3xl font-bold tracking-tight font-display text-white">First 50 get early access before public release.</h3>
            
            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold ml-1">Email for instructions</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="army@founders.club"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 text-base outline-none transition focus:border-pink-500/50 focus:bg-black/60 placeholder:text-white/20 focus:ring-1 focus:ring-pink-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold ml-1">Where you rep Tampa from</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ybor • International • Seoul"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-4 text-base outline-none transition focus:border-pink-500/50 focus:bg-black/60 placeholder:text-white/20 focus:ring-1 focus:ring-pink-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.3em] text-white/50 font-bold ml-1">Commitment</label>
                <div className="relative">
                  <select
                    value={commitment}
                    onChange={(e) => setCommitment(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-black/40 px-6 py-4 text-base outline-none transition focus:border-pink-500/50 focus:bg-black/60 text-white cursor-pointer focus:ring-1 focus:ring-pink-500/20"
                  >
                    <option value="Yes, I’m ready to reserve" className="bg-black text-white">Yes, I’m ready to reserve</option>
                    <option value="Need details before committing" className="bg-black text-white">Need details before committing</option>
                    <option value="Just watching for now" className="bg-black text-white">Just watching for now</option>
                  </select>
                  <div className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-white/40">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="mt-4 w-full rounded-2xl bg-white px-6 py-4 text-sm font-bold tracking-wide text-black transition hover:scale-[1.01] hover:bg-gray-100 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-white/5"
              >
                {submitMutation.isPending ? 'Joining...' : 'Join List'}
              </button>
              
              <p className="text-xs text-white/40 text-center leading-relaxed px-4 pt-2">
                Pricing is revealed privately after signup. Proof-of-payment goes to {PAYMENT_EMAIL}. First 50 get notified ahead of public release.
              </p>
            </form>
          </div>
        </div>
      </section>

      <FooterSection isAudioOn={isAudioOn} toggleAudio={() => setIsAudioOn((prev) => !prev)} />

      {storyOpen && <StoryModal onClose={() => setStoryOpen(false)} />}
    </main>
  );
}

function getCountdown() {
  const diff = Math.max(0, COUNTDOWN_TARGET.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function GradientHero({ countdownLabel, claimed, onStory }: { countdownLabel: string; claimed: number; onStory: () => void }) {
  return (
    <section className="relative isolate overflow-hidden px-6 pt-32 pb-24 text-center">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-900/30 via-indigo-800/20 to-pink-900/30 blur-[100px] opacity-60"
          style={{ animation: 'pulseGradient 8s ease-in-out infinite alternate' }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl animate-fade-in">
        <p className="text-xs md:text-sm uppercase tracking-[0.5em] text-white/50 mb-8 font-bold font-display">TAMPA ARMY — FOUNDERS DROP</p>
        <h1 className="text-5xl font-bold leading-tight md:text-7xl lg:text-8xl tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent font-display">
          Limited first batch for<br className="hidden md:block"/>Tampa ARMY fans.
        </h1>
        <p className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
          Not mass produced. Not restocked. Built for the city that shows up early.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#founders-form"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold tracking-wide text-black transition hover:scale-105 hover:bg-gray-200 hover:shadow-lg hover:shadow-white/20"
          >
            Get Early Access
          </a>
          <button
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium tracking-wide text-white transition hover:bg-white/10 hover:border-white/20 backdrop-blur-sm"
            onClick={onStory}
          >
            Read the Story
          </button>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/50 uppercase tracking-widest">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]"/>
            Preorder window closes in {countdownLabel}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
             <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"/>
             {claimed}+ ARMY on list · 80% claimed
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulseGradient {
          0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.9); }
          100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </section>
  );
}

function FooterSection({ isAudioOn, toggleAudio }: { isAudioOn: boolean; toggleAudio: () => void }) {
  return (
    <footer className="mx-auto mt-24 flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-12 text-xs text-white/40 border-t border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="space-y-1">
        <p className="text-white/90 font-medium tracking-wide uppercase">Tampa Army</p>
        <p>Indie fan lab · Est. 2025</p>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <a href="mailto:hello@tampaarmy.com" className="hover:text-white transition decoration-transparent underline-offset-4 hover:underline">Contact</a>
        <a href="#" className="hover:text-white transition decoration-transparent underline-offset-4 hover:underline">Terms</a>
        <a href="#" className="hover:text-white transition decoration-transparent underline-offset-4 hover:underline">Privacy</a>
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white transition group"
        >
          {isAudioOn ? (
             <>
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               <Volume2 className="w-3 h-3 text-white/50 group-hover:text-white transition" />
               <span className="hidden sm:inline">Mute ambience</span>
             </>
          ) : (
            <>
              <VolumeX className="w-3 h-3 text-white/50 group-hover:text-white transition" />
              <span>Play ambience</span>
            </>
          )}
        </button>
      </div>
    </footer>
  );
}

function StoryModal({ onClose }: { onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="max-w-lg w-full rounded-3xl border border-white/10 bg-[#0b0b0b] p-8 md:p-10 text-white shadow-2xl scale-100 animate-in zoom-in-95 duration-300 relative overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
           <h4 className="text-lg font-bold tracking-wide font-display uppercase text-white/90">Drop Narrative</h4>
           <button 
             onClick={onClose} 
             className="text-white/30 hover:text-white transition hover:bg-white/10 p-2 rounded-full"
             aria-label="Close"
           >
             <X className="w-5 h-5" />
           </button>
        </div>
        <div className="text-sm md:text-base text-white/70 leading-relaxed space-y-4 font-light relative z-10">
          <p>
            This first run was stitched with our small atelier partners after weeks of fit testing in Tampa heat and late-night rehearsals. 
          </p>
          <p>
            We wanted gear that breathed when it was 95°F outside Raymond James Stadium but still felt substantial enough for the flight home.
          </p>
          <p className="text-white/90 font-medium">
            Every piece ships with a founders credential so we know who was here on day zero.
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
          <button 
            onClick={onClose}
            className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-full transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
