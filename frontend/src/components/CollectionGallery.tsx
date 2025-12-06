import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Check, Star, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { movieCollectionsApi, collectionsApi } from '../lib/api';

const posterFallback = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80';

interface PerkCollectionItem {
  perk_id: number;
  week_no: number;
  name: string;
  type: string;
  image?: string | null;
  collected: boolean;
}

interface MovieCollection {
  movie_id: number;
  movie_title: string;
  movie_image?: string | null;
  collected_count: number;
  total_count: number;
  completion_rate: number;
  perks: PerkCollectionItem[];
}

export function CollectionGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'collected' | 'missing'>('all');
  const [editingMovie, setEditingMovie] = useState<number | null>(null);
  const [perksByMovie, setPerksByMovie] = useState<MovieCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<{ total_perks: number; collected_perks: number; collection_rate: number } | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(true);

  // 통계 가져오기 함수
  const fetchStatistics = async () => {
    try {
      setStatisticsLoading(true);
      const statsData = await movieCollectionsApi.getPerkCollectionStatistics();
      setStatistics(statsData);
    } catch (err) {
      // 통계 로딩 실패는 무시 (목록 로딩과 별개)
    } finally {
      setStatisticsLoading(false);
    }
  };

  // 통계는 초기 로드 시에만 가져오기 (검색과 무관)
  useEffect(() => {
    fetchStatistics();
  }, []);

  // 목록은 검색/필터 조건에 따라 가져오기
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const trimmedQuery = searchQuery.trim();
        // 검색어가 있을 때만 movie_title 파라미터에 추가 (이벤트 페이지 방식)
        const params: { movie_title?: string; filter?: string } = {};
        if (trimmedQuery) {
          params.movie_title = trimmedQuery;
        }
        // filter는 항상 전달 (기본값 "전체")
        const filterValue = filterType === 'all' ? '전체' : filterType === 'collected' ? '수집 완료' : '미수집';
        if (filterValue !== '전체') {
          params.filter = filterValue;
        }
        
        const listData = await movieCollectionsApi.getPerkCollectionList(params);
        setPerksByMovie(listData);
      } catch (err) {
        setError((err as Error)?.message ?? '컬렉션을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [searchQuery, filterType]);

  // 통계는 항상 전체 기준 (검색 결과와 무관)
  const getTotalPerks = () => statistics?.total_perks || 0;
  const getCollectedPerks = () => statistics?.collected_perks || 0;
  const collectionRate = statistics?.collection_rate 
    ? Math.round(statistics.collection_rate) 
    : 0;

  const togglePerkCollection = async (movieId: number, perkId: number) => {
    try {
      const movie = perksByMovie.find(m => m.movie_id === movieId);
      const perk = movie?.perks.find(p => p.perk_id === perkId);
      
      if (!perk) return;

      if (perk.collected) {
        // 컬렉션에서 삭제
        await collectionsApi.delete(perkId);
      } else {
        // 컬렉션에 추가
        await collectionsApi.create({ perk_id: perkId });
      }

      // 상태 업데이트
      setPerksByMovie(prev => prev.map(movie => {
        if (movie.movie_id === movieId) {
          return {
            ...movie,
            perks: movie.perks.map(p => 
              p.perk_id === perkId ? { ...p, collected: !p.collected } : p
            ),
            collected_count: perk.collected 
              ? movie.collected_count - 1 
              : movie.collected_count + 1,
            completion_rate: ((perk.collected ? movie.collected_count - 1 : movie.collected_count + 1) / movie.total_count) * 100,
          };
        }
        return movie;
      }));

      // 통계 다시 가져오기
      await fetchStatistics();
    } catch (err) {
      alert((err as Error)?.message || '컬렉션 업데이트에 실패했습니다.');
    }
  };

  const deleteMovie = async (movieId: number) => {
    if (!confirm('이 영화의 모든 컬렉션을 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      const movie = perksByMovie.find(m => m.movie_id === movieId);
      if (movie) {
        // 모든 수집된 특전 삭제
        const collectedPerks = movie.perks.filter(p => p.collected);
        await Promise.all(collectedPerks.map(perk => collectionsApi.delete(perk.perk_id)));
        
        // 목록에서 제거
        setPerksByMovie(prev => prev.filter(m => m.movie_id !== movieId));
        setEditingMovie(null);

        // 통계 다시 가져오기
        await fetchStatistics();
      }
    } catch (err) {
      alert((err as Error)?.message || '삭제에 실패했습니다.');
    }
  };

  const saveEdit = (movieId: number) => {
    setEditingMovie(null);
  };

  const filteredMovies = perksByMovie;

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
          {error ? (
            <Card className="bg-black border-2 border-red-900/50 p-6 col-span-3">
              <div className="text-red-500">{error}</div>
            </Card>
          ) : (
            <>
              <Card className="bg-black border-2 border-red-900/50 p-6 shadow-lg">
                <div className="text-sm text-gray-400 mb-2">총 특전</div>
                <div className="text-3xl text-white">
                  {statisticsLoading ? '...' : getTotalPerks()}
                </div>
              </Card>
              
              <Card className="bg-black border-2 border-red-900/50 p-6 shadow-lg">
                <div className="text-sm text-gray-400 mb-2">수집 완료</div>
                <div className="text-3xl text-white">
                  {statisticsLoading ? '...' : getCollectedPerks()}
                </div>
              </Card>
              
              <Card className="bg-black border-2 border-red-900/50 p-6 shadow-lg">
                <div className="text-sm text-gray-400 mb-2">수집률</div>
                <div className="text-3xl text-white">
                  {statisticsLoading ? '...' : `${collectionRate}%`}
                </div>
              </Card>
            </>
          )}
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
        {loading ? (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-gray-400">컬렉션을 불러오는 중...</p>
          </Card>
        ) : error ? (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-red-500">{error}</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {filteredMovies.map((movie, index) => {
              const collectedCount = movie.collected_count;
              const totalCount = movie.total_count;
              const movieProgress = Math.round(movie.completion_rate || 0);
              const isEditing = editingMovie === movie.movie_id;

              return (
                <motion.div
                  key={movie.movie_id}
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
                              src={movie.movie_image || posterFallback}
                              alt={movie.movie_title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl text-white mb-2">{movie.movie_title}</h3>
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
                                onClick={() => saveEdit(movie.movie_id)}
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
                                onClick={() => setEditingMovie(movie.movie_id)}
                                className="border-red-600/50 text-red-600 hover:bg-red-600/10"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                수정
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteMovie(movie.movie_id)}
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
                            key={perk.perk_id}
                            whileHover={{ scale: isEditing ? 1.02 : 1 }}
                            onClick={() => isEditing && togglePerkCollection(movie.movie_id, perk.perk_id)}
                            className={`relative aspect-[3/4] rounded-xl border-2 transition-all overflow-hidden ${
                              perk.collected
                                ? 'border-red-600/50 shadow-lg shadow-red-900/30'
                                : 'border-gray-800'
                            } ${isEditing ? 'cursor-pointer hover:border-red-600/30' : ''}`}
                          >
                            {/* Background Image */}
                            <ImageWithFallback
                              src={perk.image || posterFallback}
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
                                  {perk.week_no}주차
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
        )}

        {!loading && !error && filteredMovies.length === 0 && (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
