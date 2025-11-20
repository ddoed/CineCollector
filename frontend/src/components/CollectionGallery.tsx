import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Check, Star, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CollectionGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'collected' | 'missing'>('all');
  const [editingMovie, setEditingMovie] = useState<number | null>(null);

  // 전체 특전 목록 (영화별로 구성)
  const [perksByMovie, setPerksByMovie] = useState([
    {
      movieId: 1,
      movieTitle: '듄: 파트2',
      moviePoster: 'https://images.unsplash.com/photo-1679699316094-a74534381e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMG1pbmltYWx8ZW58MXx8fHwxNzYyMjQ2MDY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      perks: [
        { id: 1, name: '포토카드 세트', week: 1, collected: true, type: 'photocard', image: 'https://images.unsplash.com/photo-1618774945391-a8d74e6fa635?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2NhcmQlMjBjb2xsZWN0aWJsZSUyMGNhcmRzfGVufDF8fHx8MTc2MjI1MTIxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 2, name: '아크라키스 포스터', week: 2, collected: true, type: 'poster', image: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFydHxlbnwxfHx8fDE3NjIxNTMwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 3, name: '캐릭터 엽서', week: 3, collected: false, type: 'postcard', image: 'https://images.unsplash.com/photo-1579762593217-46655e4e7efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcG9zdGNhcmQlMjBhcnR8ZW58MXx8fHwxNzYyMjUxMjE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 4, name: '특별 필름마크', week: 4, collected: true, type: 'filmmark', image: 'https://images.unsplash.com/photo-1560109947-543149eceb16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwc3RyaXAlMjBjaW5lbWF8ZW58MXx8fHwxNzYyMjUxMjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
      ]
    },
    {
      movieId: 2,
      movieTitle: '웡카',
      moviePoster: 'https://images.unsplash.com/photo-1607310073276-9f48dec47340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWN0aWJsZSUyMGNhcmRzfGVufDF8fHx8MTc2MjIzODAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      perks: [
        { id: 5, name: '초콜릿 티켓', week: 1, collected: true, type: 'ticket', image: 'https://images.unsplash.com/photo-1536303100418-985cb308bb38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB0aWNrZXR8ZW58MXx8fHwxNzYyMjUxMjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 6, name: '캐릭터 스티커', week: 2, collected: true, type: 'sticker', image: 'https://images.unsplash.com/photo-1669720974831-47816c252ff1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xvZ3JhcGhpYyUyMHN0aWNrZXJ8ZW58MXx8fHwxNzYyMjQxNTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 7, name: '한정 포토카드', week: 3, collected: true, type: 'photocard', image: 'https://images.unsplash.com/photo-1618774945391-a8d74e6fa635?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2NhcmQlMjBjb2xsZWN0aWJsZSUyMGNhcmRzfGVufDF8fHx8MTc2MjI1MTIxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 8, name: '골든 티켓', week: 4, collected: false, type: 'ticket', image: 'https://images.unsplash.com/photo-1536303100418-985cb308bb38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB0aWNrZXR8ZW58MXx8fHwxNzYyMjUxMjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
      ]
    },
    {
      movieId: 3,
      movieTitle: '파묘',
      moviePoster: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwY2FyZHN8ZW58MXx8fHwxNzYyMjQ2MDY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      perks: [
        { id: 9, name: '부적 카드', week: 1, collected: true, type: 'card', image: 'https://images.unsplash.com/photo-1573168549150-689140c8033e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0aWNhbCUyMGNhcmQlMjBkZXNpZ258ZW58MXx8fHwxNzYyMjUxMjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 10, name: '영화 포스터', week: 2, collected: false, type: 'poster', image: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFydHxlbnwxfHx8fDE3NjIxNTMwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 11, name: '캐릭터 엽서 세트', week: 3, collected: false, type: 'postcard', image: 'https://images.unsplash.com/photo-1579762593217-46655e4e7efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcG9zdGNhcmQlMjBhcnR8ZW58MXx8fHwxNzYyMjUxMjE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 12, name: '한정 필름', week: 4, collected: true, type: 'film', image: 'https://images.unsplash.com/photo-1560109947-543149eceb16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwc3RyaXAlMjBjaW5lbWF8ZW58MXx8fHwxNzYyMjUxMjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
      ]
    },
    {
      movieId: 4,
      movieTitle: '오펜하이머',
      moviePoster: 'https://images.unsplash.com/photo-1679699316094-a74534381e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMG1pbmltYWx8ZW58MXx8fHwxNzYyMjQ2MDY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      perks: [
        { id: 13, name: '한정 포스터', week: 1, collected: true, type: 'poster', image: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFydHxlbnwxfHx8fDE3NjIxNTMwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 14, name: '필름 카드', week: 2, collected: false, type: 'filmmark', image: 'https://images.unsplash.com/photo-1560109947-543149eceb16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwc3RyaXAlMjBjaW5lbWF8ZW58MXx8fHwxNzYyMjUxMjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
      ]
    },
    {
      movieId: 5,
      movieTitle: '서울의 봄',
      moviePoster: 'https://images.unsplash.com/photo-1607310073276-9f48dec47340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWN0aWJsZSUyMGNhcmRzfGVufDF8fHx8MTc2MjIzODAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      perks: [
        { id: 15, name: '인물 카드', week: 1, collected: true, type: 'card', image: 'https://images.unsplash.com/photo-1573168549150-689140c8033e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0aWNhbCUyMGNhcmQlMjBkZXNpZ258ZW58MXx8fHwxNzYyMjUxMjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 16, name: '엽서 세트', week: 2, collected: true, type: 'postcard', image: 'https://images.unsplash.com/photo-1579762593217-46655e4e7efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcG9zdGNhcmQlMjBhcnR8ZW58MXx8fHwxNzYyMjUxMjE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
        { id: 17, name: '스페셜 포스터', week: 3, collected: false, type: 'poster', image: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGFydHxlbnwxfHx8fDE3NjIxNTMwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
      ]
    },
  ]);

  const getTotalPerks = () => perksByMovie.reduce((sum, movie) => sum + movie.perks.length, 0);
  const getCollectedPerks = () => perksByMovie.reduce((sum, movie) => 
    sum + movie.perks.filter(p => p.collected).length, 0);
  const collectionRate = Math.round((getCollectedPerks() / getTotalPerks()) * 100);

  const togglePerkCollection = (movieId: number, perkId: number) => {
    setPerksByMovie(prev => prev.map(movie => {
      if (movie.movieId === movieId) {
        return {
          ...movie,
          perks: movie.perks.map(perk => 
            perk.id === perkId ? { ...perk, collected: !perk.collected } : perk
          )
        };
      }
      return movie;
    }));
  };

  const deleteMovie = (movieId: number) => {
    setPerksByMovie(prev => prev.filter(movie => movie.movieId !== movieId));
    setEditingMovie(null);
  };

  const saveEdit = (movieId: number) => {
    setEditingMovie(null);
    // 실제로는 여기서 API 호출 등으로 저장
  };

  const filteredMovies = perksByMovie.filter(movie => {
    // 검색 필터
    if (searchQuery && !movie.movieTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // 수집 상태 필터
    if (filterType === 'collected') {
      return movie.perks.some(p => p.collected);
    } else if (filterType === 'missing') {
      return movie.perks.some(p => !p.collected);
    }
    
    return true;
  });

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl mb-2">특전 도감</h1>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-black border-2 border-red-900/50 p-6 shadow-lg">
            <div className="text-sm text-gray-400 mb-2">총 특전</div>
            <div className="text-3xl text-white">{getTotalPerks()}</div>
          </Card>
          
          <Card className="bg-black border-2 border-red-900/50 p-6 shadow-lg">
            <div className="text-sm text-gray-400 mb-2">수집 완료</div>
            <div className="text-3xl text-white">{getCollectedPerks()}</div>
          </Card>
          
          <Card className="bg-black border-2 border-red-900/50 p-6 shadow-lg">
            <div className="text-sm text-gray-400 mb-2">수집률</div>
            <div className="text-3xl text-white">{collectionRate}%</div>
          </Card>
        </div>

        {/* Overall Collection Progress */}
        <Card className="bg-black border-2 border-red-900/50 p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white">전체 수집 진행도</span>
            <span className="text-red-600">{collectionRate}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-red-600 h-full transition-all duration-500"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </Card>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="영화 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-red-900/30 text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/30 text-gray-400 hover:text-white'}
            >
              전체
            </Button>
            <Button
              variant={filterType === 'collected' ? 'default' : 'outline'}
              onClick={() => setFilterType('collected')}
              className={filterType === 'collected' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/30 text-gray-400 hover:text-white'}
            >
              수집 완료
            </Button>
            <Button
              variant={filterType === 'missing' ? 'default' : 'outline'}
              onClick={() => setFilterType('missing')}
              className={filterType === 'missing' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/30 text-gray-400 hover:text-white'}
            >
              미수집
            </Button>
          </div>
        </div>

        {/* Perks Grid by Movie */}
        <div className="space-y-8">
          {filteredMovies.map((movie, index) => {
            const collectedCount = movie.perks.filter(p => p.collected).length;
            const totalCount = movie.perks.length;
            const movieProgress = Math.round((collectedCount / totalCount) * 100);
            const isEditing = editingMovie === movie.movieId;

            return (
              <motion.div
                key={movie.movieId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black border-2 border-red-900/50 overflow-hidden shadow-lg shadow-red-950/50">
                  {/* Movie Header */}
                  <div className="p-6 border-b border-red-900/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-red-900/30">
                          <ImageWithFallback
                            src={movie.moviePoster}
                            alt={movie.movieTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl text-white mb-2">{movie.movieTitle}</h3>
                          <Badge variant="outline" className="border-red-600/50 text-red-600">
                            {collectedCount}/{totalCount} 수집
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                          <div className="text-2xl text-white mb-1">{movieProgress}%</div>
                          <div className="text-xs text-gray-400">완료율</div>
                        </div>
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(movie.movieId)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              저장
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingMovie(null)}
                              className="border-gray-600 text-gray-400 hover:text-white"
                            >
                              취소
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingMovie(movie.movieId)}
                              className="border-red-600/50 text-red-600 hover:bg-red-600/10"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              수정
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteMovie(movie.movieId)}
                              className="border-gray-600 text-gray-400 hover:text-red-600 hover:border-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-red-600 h-full transition-all duration-500"
                        style={{ width: `${movieProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Perks Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {movie.perks.map((perk) => (
                        <motion.div
                          key={perk.id}
                          whileHover={{ scale: isEditing ? 1.02 : 1 }}
                          onClick={() => isEditing && togglePerkCollection(movie.movieId, perk.id)}
                          className={`relative aspect-[3/4] rounded-xl border-2 transition-all overflow-hidden ${
                            perk.collected
                              ? 'border-red-600/50 shadow-lg shadow-red-900/30'
                              : 'border-gray-800'
                          } ${isEditing ? 'cursor-pointer hover:border-red-600/30' : ''}`}
                        >
                          {/* Background Image */}
                          <ImageWithFallback
                            src={perk.image}
                            alt={perk.name}
                            className={`w-full h-full object-cover transition-all ${
                              perk.collected ? 'opacity-100' : 'opacity-30 grayscale'
                            }`}
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                          {/* Card Content */}
                          <div className="absolute inset-0 p-4 flex flex-col">
                            {/* Week Badge */}
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary" className="text-xs bg-black/70 text-gray-300 backdrop-blur-sm">
                                {perk.week}주차
                              </Badge>
                            </div>

                            {/* Collected Check */}
                            {perk.collected && (
                              <div className="absolute top-2 right-2">
                                <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}

                            {/* Perk Info */}
                            <div className="mt-auto relative z-10">
                              <div className={`text-sm mb-2 ${perk.collected ? 'text-white' : 'text-gray-500'}`}>
                                {perk.name}
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs backdrop-blur-sm ${
                                  perk.collected ? 'text-gray-300 border-gray-500 bg-black/30' : 'text-gray-600 border-gray-700 bg-black/50'
                                }`}
                              >
                                {perk.type}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredMovies.length === 0 && (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </Card>
        )}

        {/* Add Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            특전 도감 추가하기
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
