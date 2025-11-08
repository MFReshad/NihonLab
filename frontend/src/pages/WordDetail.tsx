import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface WordDetailData {
  id: number;
  kanji: string;
  reading_on: string[];
  reading_kun: string[];
  meaning: string[];
  jlpt?: string;
  stroke_count?: number;
  stroke_gif_url?: string;
  audio_url?: string;
  compounds: {
    starts_with: { word: string; reading: string; meaning: string }[];
    ends_with: { word: string; reading: string; meaning: string }[];
    contains: { word: string; reading: string; meaning: string }[];
  };
  external_links: {
    jisho?: string;
    wiktionary?: string;
    kanjialive?: string;
  };
}

const WordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [wordData, setWordData] = useState<WordDetailData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API call: fetch(`/api/words/${id}/details/`)
    const mockData: WordDetailData = {
      id: Number(id),
      kanji: '出',
      reading_on: ['シュツ', 'スイ'],
      reading_kun: ['でる', 'だす'],
      meaning: ['to go out', 'to appear', 'to leave', 'to put out'],
      jlpt: 'N5',
      stroke_count: 5,
      stroke_gif_url: 'https://example.com/strokes/deru.gif',
      audio_url: 'https://example.com/audio/deru.mp3',
      compounds: {
        starts_with: [
          { word: '出口', reading: 'でぐち', meaning: 'exit' },
          { word: '出発', reading: 'しゅっぱつ', meaning: 'departure' },
          { word: '出身', reading: 'しゅっしん', meaning: 'hometown' },
        ],
        ends_with: [
          { word: '外出', reading: 'がいしゅつ', meaning: 'going out' },
          { word: '提出', reading: 'ていしゅつ', meaning: 'submission' },
        ],
        contains: [
          { word: '思い出', reading: 'おもいで', meaning: 'memory' },
          { word: '出来る', reading: 'できる', meaning: 'to be able to' },
        ],
      },
      external_links: {
        jisho: 'https://jisho.org/search/出%20%23kanji',
        wiktionary: 'https://en.wiktionary.org/wiki/出',
        kanjialive: 'https://app.kanjialive.com/search/出',
      },
    };
    setWordData(mockData);
  }, [id]);

  useEffect(() => {
    if (!wordData) return;

    // Header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }
      );
    }

    // Section animations with ScrollTrigger
    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('.detail-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [wordData]);

  const handleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!wordData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Header Section */}
      <div ref={headerRef} className="container mx-auto px-4 py-8 text-center space-y-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b">
        <div className="text-8xl font-extrabold tracking-tight text-foreground font-japanese">
          {wordData.kanji}
        </div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="text-2xl text-muted-foreground">
            {[...wordData.reading_kun, ...wordData.reading_on].join(' · ')}
          </span>
          {wordData.jlpt && (
            <Badge variant="secondary" className="bg-green-success text-white text-base px-3 py-1">
              {wordData.jlpt}
            </Badge>
          )}
          {wordData.stroke_count && (
            <Badge variant="outline" className="text-base px-3 py-1">
              {wordData.stroke_count} strokes
            </Badge>
          )}
          {wordData.audio_url && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleAudioPlay}
              className="rounded-full hover:bg-accent"
              aria-label="Play pronunciation"
            >
              <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-orange-primary' : ''}`} />
            </Button>
          )}
        </div>
        {wordData.audio_url && (
          <audio ref={audioRef} src={wordData.audio_url} onEnded={() => setIsPlaying(false)} />
        )}
      </div>

      <div ref={sectionsRef} className="container mx-auto px-4 space-y-12 mt-8">
        {/* Meanings Section */}
        <section className="detail-section">
          <h2 className="text-3xl font-heading font-semibold mb-4">Meanings</h2>
          <ol className="list-decimal list-inside space-y-2 text-lg text-foreground">
            {wordData.meaning.map((def, idx) => (
              <li key={idx}>{def}</li>
            ))}
          </ol>
        </section>

        {/* Readings Section */}
        <section className="detail-section">
          <h2 className="text-3xl font-heading font-semibold mb-4">Readings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {wordData.reading_on.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">On'yomi (音読み)</h3>
                <div className="flex flex-wrap gap-2">
                  {wordData.reading_on.map((reading, idx) => (
                    <Badge key={idx} variant="secondary" className="text-lg px-4 py-2 font-japanese">
                      {reading}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {wordData.reading_kun.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-3">Kun'yomi (訓読み)</h3>
                <div className="flex flex-wrap gap-2">
                  {wordData.reading_kun.map((reading, idx) => (
                    <Badge key={idx} variant="secondary" className="text-lg px-4 py-2 font-japanese">
                      {reading}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stroke Order */}
        {wordData.stroke_gif_url && (
          <section className="detail-section">
            <h2 className="text-3xl font-heading font-semibold mb-4">Stroke Order</h2>
            <Card className="p-6 bg-card">
              <img
                src={wordData.stroke_gif_url}
                alt={`Stroke order for ${wordData.kanji}`}
                className="max-w-full h-auto mx-auto"
              />
            </Card>
          </section>
        )}

        {/* Compounds Section */}
        <section className="detail-section">
          <h2 className="text-3xl font-heading font-semibold mb-6">Compounds</h2>
          <div className="space-y-8">
            {wordData.compounds.starts_with.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  Words starting with {wordData.kanji}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wordData.compounds.starts_with.map((compound, idx) => (
                    <Card
                      key={idx}
                      className="p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      <div className="text-2xl font-japanese font-bold mb-1">{compound.word}</div>
                      <div className="text-sm text-muted-foreground mb-2">{compound.reading}</div>
                      <div className="text-sm">{compound.meaning}</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {wordData.compounds.ends_with.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  Words ending with {wordData.kanji}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wordData.compounds.ends_with.map((compound, idx) => (
                    <Card
                      key={idx}
                      className="p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      <div className="text-2xl font-japanese font-bold mb-1">{compound.word}</div>
                      <div className="text-sm text-muted-foreground mb-2">{compound.reading}</div>
                      <div className="text-sm">{compound.meaning}</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {wordData.compounds.contains.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                  Words containing {wordData.kanji}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wordData.compounds.contains.map((compound, idx) => (
                    <Card
                      key={idx}
                      className="p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                      <div className="text-2xl font-japanese font-bold mb-1">{compound.word}</div>
                      <div className="text-sm text-muted-foreground mb-2">{compound.reading}</div>
                      <div className="text-sm">{compound.meaning}</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* External Links */}
        <section className="detail-section">
          <h2 className="text-3xl font-heading font-semibold mb-4">External Resources</h2>
          <div className="flex flex-wrap gap-4">
            {wordData.external_links.jisho && (
              <a
                href={wordData.external_links.jisho}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button variant="outline" className="gap-2 group-hover:scale-105 transition-transform">
                  Jisho.org
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
            {wordData.external_links.wiktionary && (
              <a
                href={wordData.external_links.wiktionary}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button variant="outline" className="gap-2 group-hover:scale-105 transition-transform">
                  Wiktionary
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
            {wordData.external_links.kanjialive && (
              <a
                href={wordData.external_links.kanjialive}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Button variant="outline" className="gap-2 group-hover:scale-105 transition-transform">
                  KanjiAlive
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WordDetail;
