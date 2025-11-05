import { useState } from 'react';
import WordCard from '@/components/WordCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const Wordlist = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  // Mock word data
  const words = [
    {
      word: '桜',
      reading: 'さくら',
      meaning: 'Cherry Blossom',
      example: '春には桜が咲きます。',
      exampleTranslation: 'Cherry blossoms bloom in spring.',
      level: 'N5',
    },
    {
      word: '勉強',
      reading: 'べんきょう',
      meaning: 'Study',
      example: '毎日日本語を勉強します。',
      exampleTranslation: 'I study Japanese every day.',
      level: 'N5',
    },
    {
      word: '図書館',
      reading: 'としょかん',
      meaning: 'Library',
      example: '図書館で本を読みます。',
      exampleTranslation: 'I read books at the library.',
      level: 'N4',
    },
    {
      word: '美味しい',
      reading: 'おいしい',
      meaning: 'Delicious',
      example: 'この寿司はとても美味しいです。',
      exampleTranslation: 'This sushi is very delicious.',
      level: 'N5',
    },
    {
      word: '頑張る',
      reading: 'がんばる',
      meaning: 'To do one\'s best',
      example: '試験のために頑張ります。',
      exampleTranslation: 'I will do my best for the exam.',
      level: 'N4',
    },
    {
      word: '友達',
      reading: 'ともだち',
      meaning: 'Friend',
      example: '友達と映画を見ました。',
      exampleTranslation: 'I watched a movie with my friend.',
      level: 'N5',
    },
  ];

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.word.includes(searchQuery) ||
      word.reading.includes(searchQuery) ||
      word.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || word.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Wordlist</h1>
        <p className="text-muted-foreground text-lg">
          Explore and learn Japanese vocabulary
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by level" />
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
      </div>

      {/* Word Grid */}
      <div className="grid gap-4">
        {filteredWords.map((word, index) => (
          <WordCard key={index} {...word} />
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No words found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Wordlist;
