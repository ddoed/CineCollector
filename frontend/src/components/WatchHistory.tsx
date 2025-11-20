import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Film, Search, Star, Plus, MapPin, Trophy, MoreHorizontal, Edit, Trash, Lock, Globe } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { Switch } from './ui/switch';
import { viewingRecordsApi, moviesApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const posterFallback = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80';

export function WatchHistory() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allMovies, setAllMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const movieTitle = searchQuery || undefined;
        const records = await viewingRecordsApi.getMyViewingRecords({ movie_title: movieTitle });
        setMovies(records);
      } catch (err) {
        setError((err as Error)?.message ?? '관람 기록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchRecords();
    }
  }, [user, searchQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await moviesApi.getAll();
        setAllMovies(data);
      } catch (err) {
        console.error('영화 목록을 불러오지 못했습니다:', err);
      }
    };
    fetchMovies();
  }, []);

  const mockMovies: any[] = [
    { 
      id: 1, 
      title: '듄: 파트2',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
      watchDate: '2024-11-02',
      theater: 'CGV 용산아이파크몰',
      rating: 5,
      genre: 'SF',
      review: '압도적인 스케일과 영상미에 완전히 빠져들었습니다. IMAX로 다시 보고 싶어요! 특히 아라키스 사막 장면들은 정말 숨이 막힐 정도로 아름다웠어요.',
      images: [
        'https://images.unsplash.com/photo-1659652603378-22f82bedde0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      ],
      perks: [
        { name: '포토카드 세트', week: 1 },
        { name: '아크라키스 포스터', week: 2 },
      ],
      postedAt: '2시간 전'
    },
    { 
      id: 2, 
      title: '파묘',
      poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500',
      watchDate: '2024-10-28',
      theater: '메가박스 코엑스',
      rating: 5,
      genre: '공포',
      review: '한국 오컬트 영화의 새로운 기준! 김고은, 최민식, 유해진 배우님들의 연기가 정말 압권이었어요. 특히 후반부 반전은 소름 돋았습니다.',
      images: [],
      perks: [
        { name: '부적 카드', week: 1 },
        { name: '한정 필름', week: 4 },
      ],
      postedAt: '5시간 전'
    },
    { 
      id: 3, 
      title: '웡카',
      poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500',
      watchDate: '2024-10-15',
      theater: 'CGV 강남',
      rating: 4,
      genre: '판타지',
      review: '동심으로 돌아가는 느낌! 음악도 너무 좋았어요. 티모시 샬라메의 보컬이 이렇게 좋을 줄 몰랐습니다.',
      images: [
        'https://images.unsplash.com/photo-1608170825938-a8ea0305d46c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      ],
      perks: [
        { name: '초콜릿 티켓', week: 1 },
        { name: '캐릭터 스티커', week: 2 },
      ],
      postedAt: '1일 전'
    },
    { 
      id: 4, 
      title: '오펜하이머',
      poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500',
      watchDate: '2024-10-10',
      theater: 'CGV 용산 IMAX',
      rating: 5,
      genre: '드라마',
      review: '크리스토퍼 놀란 감독의 역작! 3시간이 전혀 지루하지 않았어요. 킬리언 머피의 연기가 정말 대단했습니다.',
      images: [],
      perks: [
        { name: '한정 포스터', week: 1 },
      ],
      postedAt: '2일 전'
    },
  ];

  const filteredMovies = movies.filter(movie => {
    if (selectedYear !== 'all') {
      const date = movie.viewing_date || movie.view_date || '';
      if (!date.startsWith(selectedYear)) {
        return false;
      }
    }
    return true;
  });

  const stats = {
    total: movies.length,
    thisMonth: movies.filter(m => {
      const date = m.viewing_date || m.view_date || '';
      return date.startsWith(new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0'));
    }).length,
    avgRating: movies.length > 0 
      ? (movies.reduce((acc, m) => acc + (m.rating || 0), 0) / movies.length).toFixed(1)
      : '0.0',
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl">관람 기록</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  기록 작성
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-2 border-red-600/50 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">관람 기록 작성</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    영화 관람 정보와 후기를 작성하여 나만의 컬렉션을 만들어보세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="movie-title" className="text-gray-300">영화 제목</Label>
                    <Input 
                      id="movie-title" 
                      placeholder="영화 제목을 입력하세요"
                      className="bg-gray-900 border-red-900/50 text-white mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="watch-date" className="text-gray-300">관람일</Label>
                      <Input 
                        id="watch-date" 
                        type="date"
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="theater" className="text-gray-300">극장</Label>
                      <Input 
                        id="theater" 
                        placeholder="극장 이름"
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="genre" className="text-gray-300">장르</Label>
                      <Input 
                        id="genre" 
                        placeholder="예: SF, 드라마"
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">별점</Label>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star 
                            key={rating}
                            className="w-8 h-8 cursor-pointer text-gray-600 hover:text-red-600 transition-colors"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="review" className="text-gray-300">관람 후기</Label>
                    <Textarea 
                      id="review" 
                      placeholder="영화에 대한 감상을 작성해주세요..."
                      className="bg-gray-900 border-red-900/50 text-white mt-2 min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">수집한 특전</Label>
                    <Input 
                      placeholder="특전 이름을 입력하세요 (선택사항)"
                      className="bg-gray-900 border-red-900/50 text-white mt-2"
                    />
                  </div>
                  
                  <Separator className="bg-red-900/30" />
                  
                  {/* Public/Private Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-red-900/30">
                    <div className="flex items-center gap-3">
                      {isPublic ? (
                        <Globe className="w-5 h-5 text-red-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <Label className="text-white cursor-pointer">
                          {isPublic ? '공개 게시물' : '비공개 게시물'}
                        </Label>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {isPublic 
                            ? '다른 사용자들이 이 관람 기록을 볼 수 있습니다' 
                            : '나만 볼 수 있는 개인 기록입니다'}
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      작성 완료
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-red-900/50 text-gray-400 hover:text-white"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-black border border-red-900/50 p-4">
              <div className="text-sm text-gray-400 mb-1">총 관람</div>
              <div className="text-2xl text-white">{stats.total}편</div>
            </Card>
            <Card className="bg-black border border-red-900/50 p-4">
              <div className="text-sm text-gray-400 mb-1">이번 달</div>
              <div className="text-2xl text-white">{stats.thisMonth}편</div>
            </Card>
            <Card className="bg-black border border-red-900/50 p-4">
              <div className="text-sm text-gray-400 mb-1">평균 평점</div>
              <div className="text-2xl text-white flex items-center gap-1">
                {stats.avgRating}
                <Star className="w-5 h-5 text-red-600 fill-red-600" />
              </div>
            </Card>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="영화 제목 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-red-900/50 text-white h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedYear === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedYear('all')}
                className={selectedYear === 'all' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/50 text-gray-400 hover:text-white'}
              >
                전체
              </Button>
              <Button
                variant={selectedYear === '2024' ? 'default' : 'outline'}
                onClick={() => setSelectedYear('2024')}
                className={selectedYear === '2024' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/50 text-gray-400 hover:text-white'}
              >
                2024
              </Button>
              <Button
                variant={selectedYear === '2023' ? 'default' : 'outline'}
                onClick={() => setSelectedYear('2023')}
                className={selectedYear === '2023' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/50 text-gray-400 hover:text-white'}
              >
                2023
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Watch Records Feed */}
        {loading && (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-gray-400">관람 기록을 불러오는 중...</p>
          </Card>
        )}
        {error && !loading && (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-red-500">{error}</p>
          </Card>
        )}
        {!loading && !error && (
          <div className="space-y-8">
            {filteredMovies.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black border-2 border-red-900/50 overflow-hidden hover:border-red-600/70 transition-all shadow-lg shadow-red-950/50">
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 bg-red-600/20 border border-red-600/30">
                        {user?.name?.[0] || 'U'}
                      </Avatar>
                      <div>
                        <div className="text-white">{user?.name || '사용자'}</div>
                        <div className="text-sm text-gray-500">
                          {record.viewing_date || record.view_date || '-'}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Movie Info */}
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-28 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-red-900/30">
                      <ImageWithFallback
                        src={record.movie?.movie_image || record.movie_image || posterFallback}
                        alt={record.movie?.title || record.movie_title || '영화 포스터'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl mb-2 text-white">{record.movie?.title || record.movie_title || '영화 제목'}</h3>
                      {record.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(record.rating)
                                  ? 'text-red-600 fill-current'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <div className="space-y-1 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {record.viewing_date || record.view_date || '-'}
                        </div>
                        {record.theater_name && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {record.theater_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review */}
                  {record.review && (
                    <p className="text-gray-300 mb-4">{record.review}</p>
                  )}

                  <Separator className="bg-red-900/30 mb-4" />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div></div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-400 hover:text-white"
                        onClick={async () => {
                          // TODO: 수정 기능 구현
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-400 hover:text-red-600"
                        onClick={async () => {
                          if (confirm('정말 삭제하시겠습니까?')) {
                            try {
                              await viewingRecordsApi.delete(record.record_id);
                              setMovies(movies.filter(m => m.record_id !== record.record_id));
                            } catch (err) {
                              alert('삭제에 실패했습니다.');
                            }
                          }
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            ))}
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
