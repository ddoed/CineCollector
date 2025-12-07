import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Star, MapPin, Calendar, Trophy, MoreHorizontal } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiRequest } from '../lib/api';

// 이미지가 실제로 로드되었을 때만 렌더링하는 컨테이너
function ImageContainer({ imageUrl, children, className }: { imageUrl: string; children: React.ReactNode; className?: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // 초기화
    setImageLoaded(false);
    setImageError(false);

    if (!imageUrl || (typeof imageUrl === 'string' && imageUrl.trim() === '')) {
      setImageError(true);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // 이미지가 없거나 에러가 발생하면 렌더링하지 않음 (부모 div도 포함)
  if (!imageUrl || (typeof imageUrl === 'string' && imageUrl.trim() === '') || imageError) {
    return null;
  }

  // 이미지가 로드되기 전에는 렌더링하지 않음 (테두리가 보이지 않도록)
  if (!imageLoaded) {
    return null;
  }

  return <div className={className}>{children}</div>;
}

interface HomeViewingRecord {
  record_id: number;
  user: {
    user_id: number;
    name: string;
    profile_image?: string | null;
  };
  time_ago: string;
  movie: {
    movie_id: number;
    title: string;
    movie_image?: string | null;
  };
  rating?: number | null;
  view_date: string;
  theater_name: string;
  review: string;
  images: string[];
  perks: { perk_id: number; name: string }[];
}

const posterFallback =
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80';

export function Feed() {
  const [posts, setPosts] = useState<HomeViewingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(3);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await apiRequest<HomeViewingRecord[]>('/viewing-records/home');
        setPosts(data);
      } catch (err) {
        setError((err as Error)?.message ?? '피드를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  const displayedPosts = posts.slice(0, displayCount);
  const hasMore = posts.length > displayCount;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl mb-2">홈</h1>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-8">
          {loading && (
            <Card className="bg-black border-2 border-red-900/50 p-8 text-center text-gray-400">
              최신 관람 기록을 불러오는 중입니다...
            </Card>
          )}
          {error && !loading && (
            <Card className="bg-black border-2 border-red-900/50 p-8 text-center text-red-500 text-sm">
              {error}
            </Card>
          )}
          {!loading && !error && posts.length === 0 && (
            <Card className="bg-black border-2 border-red-900/50 p-8 text-center text-gray-400">
              아직 공개된 관람 기록이 없습니다.
            </Card>
          )}
          {displayedPosts.map((post, index) => (
            <motion.div
              key={post.record_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black border-2 border-red-900/50 overflow-hidden hover:border-red-600/70 transition-all shadow-lg shadow-red-950/50">
                {/* Post Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border border-red-600/30">
                        {post.user.profile_image && (
                          <AvatarImage 
                            src={post.user.profile_image} 
                            alt={post.user.name}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="bg-red-600/20 text-red-600">
                          {post.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white">{post.user.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {post.time_ago}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Movie Info */}
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-28 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={post.movie.movie_image ?? posterFallback}
                        alt={post.movie.title}
                        className="w-full h-full object-cover border border-red-900/30"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl mb-2 text-white">{post.movie.title}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(post.rating ?? 0)
                                ? 'text-red-600 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-200" />
                          {post.view_date}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {post.theater_name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review */}
                  <p className="text-gray-300 mb-4 whitespace-pre-line">{post.review}</p>

                  {/* Images */}
                  {(() => {
                    // 유효한 이미지만 필터링 (null, undefined, 빈 문자열 제거)
                    const validImages = (post.images || [])
                      .filter(img => img && typeof img === 'string' && img.trim() !== '')
                      .filter((img, index, self) => self.indexOf(img) === index); // 중복 제거
                    
                    // 유효한 이미지가 없으면 렌더링하지 않음
                    if (validImages.length === 0) return null;
                    
                    // 단일 이미지인 경우
                    if (validImages.length === 1) {
                      const img = validImages[0];
                      if (!img || (typeof img === 'string' && img.trim() === '')) {
                        return null;
                      }
                      return (
                        <ImageContainer imageUrl={img} className="mb-4">
                          <ImageWithFallback
                            src={img}
                            alt=""
                            className="w-full h-auto rounded-lg border border-red-900/30"
                          />
                        </ImageContainer>
                      );
                    }
                    
                    // 여러 이미지인 경우 - 실제로 렌더링될 이미지만 필터링
                    const renderableImages = validImages.filter(
                      img => img && typeof img === 'string' && img.trim() !== ''
                    );
                    
                    if (renderableImages.length === 0) return null;
                    
                    // 실제로 로드 가능한 이미지만 필터링
                    const loadedImages = renderableImages.filter(img => {
                      // 이미지가 유효한 URL인지 간단히 확인
                      try {
                        new URL(img);
                        return true;
                      } catch {
                        return false;
                      }
                    });

                    if (loadedImages.length === 0) return null;

                    // 실제로 렌더링될 이미지만 필터링 (ImageContainer가 null을 반환하지 않는 것만)
                    const renderedImages = loadedImages.filter(img => {
                      // 간단한 유효성 검사
                      return img && typeof img === 'string' && img.trim() !== '';
                    });

                    if (renderedImages.length === 0) return null;

                    return (
                      <div className="mb-4">
                        <div className="grid grid-cols-2 gap-2">
                          {renderedImages.map((img, idx) => (
                            <ImageContainer key={idx} imageUrl={img}>
                              <ImageWithFallback
                                src={img}
                                alt=""
                                className="w-full aspect-square object-cover rounded-lg border border-red-900/30"
                              />
                            </ImageContainer>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Perks */}
                  {post.perks && post.perks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                        <Trophy className="w-4 h-4" />
                        수집한 특전
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.perks.map((perk) => (
                          <Badge
                            key={perk.perk_id}
                            variant="outline"
                            className="border-red-600/50 text-red-600 bg-red-950/20"
                          >
                            {perk.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-600/10"
              onClick={handleLoadMore}
            >
              더 보기
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
