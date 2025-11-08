import { useState, useCallback, useEffect } from 'react';
import WordCard from '@/components/WordCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { WordDetailModal } from '@/components/WordDetailModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const Wordlist = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 9;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Mock word data with expanded details
  const allWords = [
    {
      id: 1,
      word: '桜',
      reading: 'さくら',
      readings: ['さくら'],
      meaning: 'Cherry Blossom',
      definitions: ['cherry blossom', 'cherry tree', 'prunus serrulata'],
      part_of_speech: ['noun'],
      example: '春には桜が咲きます。',
      exampleTranslation: 'Cherry blossoms bloom in spring.',
      examples: [{ jp: '春には桜が咲きます。', en: 'Cherry blossoms bloom in spring.' }],
      level: 'N5',
      jlpt: 'N5',
      type: 'word',
      stroke_count: 10,
      radicals: ['木'],
      source_meta: { jisho_url: 'https://jisho.org/word/桜' },
    },
    {
      id: 2,
      word: '勉強',
      reading: 'べんきょう',
      readings: ['べんきょう'],
      meaning: 'Study',
      definitions: ['study', 'learning', 'cramming'],
      part_of_speech: ['noun', 'suru verb'],
      example: '毎日日本語を勉強します。',
      exampleTranslation: 'I study Japanese every day.',
      examples: [{ jp: '毎日日本語を勉強します。', en: 'I study Japanese every day.' }],
      level: 'N5',
      jlpt: 'N5',
      type: 'word',
      stroke_count: 16,
      source_meta: { jisho_url: 'https://jisho.org/word/勉強' },
    },
    {
      id: 3,
      word: '図書館',
      reading: 'としょかん',
      readings: ['としょかん'],
      meaning: 'Library',
      definitions: ['library', 'book collection'],
      part_of_speech: ['noun'],
      example: '図書館で本を読みます。',
      exampleTranslation: 'I read books at the library.',
      examples: [{ jp: '図書館で本を読みます。', en: 'I read books at the library.' }],
      level: 'N4',
      jlpt: 'N4',
      type: 'word',
      stroke_count: 25,
      source_meta: { jisho_url: 'https://jisho.org/word/図書館' },
    },
    {
      id: 4,
      word: '美味しい',
      reading: 'おいしい',
      readings: ['おいしい'],
      meaning: 'Delicious',
      definitions: ['delicious', 'tasty', 'good'],
      part_of_speech: ['い-adjective'],
      example: 'この寿司はとても美味しいです。',
      exampleTranslation: 'This sushi is very delicious.',
      examples: [{ jp: 'この寿司はとても美味しいです。', en: 'This sushi is very delicious.' }],
      level: 'N5',
      jlpt: 'N5',
      type: 'word',
      stroke_count: 17,
      source_meta: { jisho_url: 'https://jisho.org/word/美味しい' },
    },
    {
      id: 5,
      word: '頑張る',
      reading: 'がんばる',
      readings: ['がんばる'],
      meaning: 'To do one\'s best',
      definitions: ['to do one\'s best', 'to persevere', 'to work hard'],
      part_of_speech: ['godan verb'],
      example: '試験のために頑張ります。',
      exampleTranslation: 'I will do my best for the exam.',
      examples: [{ jp: '試験のために頑張ります。', en: 'I will do my best for the exam.' }],
      level: 'N4',
      jlpt: 'N4',
      type: 'word',
      stroke_count: 14,
      source_meta: { jisho_url: 'https://jisho.org/word/頑張る' },
    },
    {
      id: 6,
      word: '友達',
      reading: 'ともだち',
      readings: ['ともだち'],
      meaning: 'Friend',
      definitions: ['friend', 'companion', 'pal'],
      part_of_speech: ['noun'],
      example: '友達と映画を見ました。',
      exampleTranslation: 'I watched a movie with my friend.',
      examples: [{ jp: '友達と映画を見ました。', en: 'I watched a movie with my friend.' }],
      level: 'N5',
      jlpt: 'N5',
      type: 'word',
      stroke_count: 17,
      source_meta: { jisho_url: 'https://jisho.org/word/友達' },
    },
    {
      id: 7,
      word: '出',
      reading: 'でる',
      readings: ['でる', 'だす'],
      meaning: 'To go out',
      definitions: ['to go out', 'to leave', 'to appear', 'to put out'],
      part_of_speech: ['ichidan verb', 'godan verb'],
      example: '彼は家から出た。',
      exampleTranslation: 'He left the house.',
      examples: [{ jp: '彼は家から出た。', en: 'He left the house.' }],
      level: 'N5',
      jlpt: 'N5',
      type: 'kanji',
      stroke_count: 5,
      radicals: ['出'],
      source_meta: { jisho_url: 'https://jisho.org/word/出' },
    },
  ];

  const filteredWords = allWords.filter((word) => {
    const matchesSearch =
      word.word.includes(debouncedQuery) ||
      word.reading.includes(debouncedQuery) ||
      word.meaning.toLowerCase().includes(debouncedQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || word.level === levelFilter;
    const matchesType = typeFilter === 'all' || word.type === typeFilter;
    return matchesSearch && matchesLevel && matchesType;
  });

  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWords = filteredWords.slice(startIndex, startIndex + itemsPerPage);

  const handleWordClick = useCallback((word: any) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Wordlist</h1>
        <p className="text-muted-foreground text-lg">
          Explore and learn Japanese vocabulary
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search words or kanji (e.g. 出)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search words"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by JLPT level">
              <SelectValue placeholder="JLPT Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="N5">N5</SelectItem>
              <SelectItem value="N4">N4</SelectItem>
              <SelectItem value="N3">N3</SelectItem>
              <SelectItem value="N2">N2</SelectItem>
              <SelectItem value="N1">N1</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by type">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="word">Words</SelectItem>
              <SelectItem value="kanji">Kanji</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Found {filteredWords.length} {filteredWords.length === 1 ? 'result' : 'results'}
        </div>
      </div>

      {/* Word Grid */}
      {paginatedWords.length > 0 ? (
        <>
          <div className="grid gap-4" role="list">
            {paginatedWords.map((word) => (
              <div
                key={word.id}
                onClick={() => handleWordClick(word)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleWordClick(word);
                  }
                }}
                role="listitem"
                tabIndex={0}
                className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-primary rounded-lg transition-all hover:scale-[1.02]"
                aria-label={`View details for ${word.word}`}
              >
                <WordCard {...word} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No words found. Try adjusting your filters.
          </p>
        </div>
      )}

      {/* Word Detail Modal */}
      <WordDetailModal word={selectedWord} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Wordlist;
