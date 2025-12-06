import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, MapPin, Package, ChevronRight, Filter } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { eventsApi } from '../lib/api';

type EventStatus = 'ongoing' | 'upcoming' | 'ended';

interface Perk {
  perk_id: number;
  name: string;
  type: string;
  limit_per_user: number;
  description?: string;
}

interface Theater {
  theater_id: number;
  name: string;
  location: string;
  stock: number;
  status: string;
  status_message?: string;
}

interface Event {
  event_id: number;
  movie: {
    movie_id: number;
    title: string;
    image?: string | null;
  };
  title: string;
  start_date: string;
  end_date: string;
  status: string;
  image?: string | null;
  perks: Perk[];
  theater_count?: number;
  theaters?: Theater[];
}

const posterFallback = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80';

export function EventsPerks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('전체');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showTheaters, setShowTheaters] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventDetail, setEventDetail] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const status = filterStatus === '전체' ? undefined : filterStatus;
        const trimmedQuery = searchQuery.trim();
        // 검색어가 있으면 영화 제목과 이벤트 제목 모두에 대해 검색
        const params: { status?: string; movie_title?: string; event_title?: string } = {};
        if (status) {
          params.status = status;
        }
        if (trimmedQuery) {
          params.movie_title = trimmedQuery;
          params.event_title = trimmedQuery;
        }
        const data = await eventsApi.getList(params);
        setEvents(data);
      } catch (err) {
        setError((err as Error)?.message ?? '이벤트를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filterStatus, searchQuery]);

  const handleEventClick = async (event: Event) => {
    try {
      const detail = await eventsApi.getDetail(event.event_id);
      setEventDetail(detail);
      setSelectedEvent(detail);
    } catch (err) {
      setError((err as Error)?.message ?? '이벤트 상세 정보를 불러오지 못했습니다.');
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case '진행 중':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white">진행 중</Badge>;
      case '예정':
        return <Badge className="bg-blue-600 hover:bg-blue-700 text-white">예정</Badge>;
      case '종료':
        return <Badge className="bg-gray-600 hover:bg-gray-700 text-white">종료</Badge>;
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700 text-white">{status}</Badge>;
    }
  };

  const filteredEvents = events;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl mb-2">이벤트·특전</h1>
          <p className="text-gray-400">진행 중인 영화 특전 이벤트와 증정 지점을 확인하세요</p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="영화 제목 또는 이벤트 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-red-900/30 text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === '전체' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('전체')}
              className={filterStatus === '전체' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/30 text-gray-400 hover:text-white'}
            >
              전체
            </Button>
            <Button
              variant={filterStatus === '진행 중' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('진행 중')}
              className={filterStatus === '진행 중' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/30 text-gray-400 hover:text-white'}
            >
              진행 중
            </Button>
            <Button
              variant={filterStatus === '예정' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('예정')}
              className={filterStatus === '예정' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/30 text-gray-400 hover:text-white'}
            >
              예정
            </Button>
            <Button
              variant={filterStatus === '종료' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('종료')}
              className={filterStatus === '종료' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/30 text-gray-400 hover:text-white'}
            >
              종료
            </Button>
          </div>
        </div>

        {/* Events List */}
        {loading && (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-gray-400">이벤트를 불러오는 중...</p>
          </Card>
        )}
        {error && !loading && (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-red-500">{error}</p>
          </Card>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.event_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black border-2 border-red-900/50 overflow-hidden shadow-lg shadow-red-950/50 hover:border-red-600/50 transition-all cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  {/* Event Header */}
                  <div className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-36 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-red-900/30">
                        <ImageWithFallback
                          src={event.movie?.image || posterFallback}
                          alt={event.movie?.title || '영화 포스터'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl text-white mb-1">{event.movie?.title || '영화 제목'}</h3>
                            <p className="text-gray-400 text-sm mb-3">{event.title}</p>
                          </div>
                          {getStatusBadge(event.status)}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{event.start_date} ~ {event.end_date}</span>
                          </div>
                          {event.perks && event.perks.length > 0 && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Package className="w-4 h-4" />
                              <span>{event.perks[0].name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>{event.theater_count || 0}개 지점</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Perks Preview */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between pt-4 border-t border-red-900/30">
                      {event.perks && event.perks.length > 0 && (
                        <Badge variant="outline" className="border-red-600/50 text-red-600 text-xs">
                          {event.perks[0].type}
                        </Badge>
                      )}
                      <ChevronRight className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </Card>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && eventDetail && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setSelectedEvent(null);
              setEventDetail(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-black border-2 border-red-600/50 shadow-2xl">
                {/* Modal Header */}
                <div className="p-6 border-b border-red-900/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-48 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-red-900/30">
                        <ImageWithFallback
                          src={eventDetail.movie?.image || eventDetail.movie?.poster_image || posterFallback}
                          alt={eventDetail.movie?.title || '영화 포스터'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl text-white mb-2">{eventDetail.movie?.title || '영화 제목'}</h2>
                        <p className="text-gray-400 mb-4">{eventDetail.title}</p>
                        {getStatusBadge(eventDetail.status)}
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{eventDetail.start_date} ~ {eventDetail.end_date}</span>
                          </div>
                          {eventDetail.week_no && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Package className="w-4 h-4" />
                              <span>{eventDetail.week_no}주차 특전</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(null);
                        setEventDetail(null);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                {/* Perk Info */}
                {eventDetail.perks && eventDetail.perks.length > 0 && (
                  <div className="p-6 border-b border-red-900/30">
                    <h3 className="text-lg mb-4 text-white">특전</h3>
                    {eventDetail.perks.map((perk) => (
                      <Card key={perk.perk_id} className="bg-gray-900 border border-red-900/30 p-4 mb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-white">{perk.name}</span>
                              <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                {perk.type}
                              </Badge>
                            </div>
                            {perk.description && (
                              <p className="text-sm text-gray-400 mb-2">{perk.description}</p>
                            )}
                            <p className="text-xs text-red-600">1인당 최대 {perk.limit_per_user}개 수령</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Theater Locations - Summary */}
                {eventDetail.perks && eventDetail.perks.length > 0 && eventDetail.perks[0].theaters && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg text-white">증정 지점</h3>
                      <Dialog open={showTheaters} onOpenChange={setShowTheaters}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            증정지점 보기 ({eventDetail.perks[0].theaters?.length || 0})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-black border-2 border-red-600/50 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl text-white">
                              {eventDetail.movie?.title} - 증정 지점
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                              특전을 받을 수 있는 극장을 선택하세요
                            </DialogDescription>
                          </DialogHeader>
                          <Accordion type="multiple" defaultValue={['CGV', '메가박스', '롯데시네마']} className="mt-4">
                            {(() => {
                              // 극장을 체인별로 그룹화
                              const groupedTheaters: Record<string, Theater[]> = {};
                              eventDetail.perks[0].theaters?.forEach(theater => {
                                let chain = '기타';
                                if (theater.name.startsWith('CGV')) {
                                  chain = 'CGV';
                                } else if (theater.name.startsWith('메가박스')) {
                                  chain = '메가박스';
                                } else if (theater.name.startsWith('롯데시네마')) {
                                  chain = '롯데시네마';
                                }
                                if (!groupedTheaters[chain]) {
                                  groupedTheaters[chain] = [];
                                }
                                groupedTheaters[chain].push(theater);
                              });

                              // CGV, 메가박스, 롯데시네마, 기타 순서로 정렬
                              const chainOrder = ['CGV', '메가박스', '롯데시네마', '기타'];
                              const sortedChains = chainOrder.filter(chain => groupedTheaters[chain]);

                              return sortedChains.map(chain => (
                                <AccordionItem key={chain} value={chain} className="border-b border-red-900/30 last:border-b-0">
                                  <AccordionTrigger className="hover:no-underline py-3">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-lg font-semibold text-white">{chain}</h4>
                                      <Badge variant="outline" className="text-xs text-gray-400 border-gray-700">
                                        {groupedTheaters[chain].length}개 지점
                                      </Badge>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-2 pt-2">
                                      {groupedTheaters[chain].map(theater => (
                                        <Card key={theater.theater_id} className="bg-gray-900 border border-red-900/30 p-4 hover:border-red-600/50 transition-colors">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                              <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
                                              <div className="flex-1 min-w-0">
                                                <div className="text-white mb-1 font-medium">{theater.name}</div>
                                                <div className="text-sm text-gray-400 truncate">{theater.location}</div>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                              <div className="text-right">
                                                {theater.status === '재고 있음' ? (
                                                  <>
                                                    <div className="text-green-600 text-sm font-medium">{theater.status}</div>
                                                    {theater.status_message && (
                                                      <div className="text-xs text-gray-400">{theater.status_message}</div>
                                                    )}
                                                  </>
                                                ) : (
                                                  <div className="text-red-600 text-sm font-medium">{theater.status}</div>
                                                )}
                                              </div>
                                              <Button 
                                                size="sm"
                                                className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap"
                                                disabled={theater.status === '소진 완료' || eventDetail.status === '종료'}
                                                onClick={async () => {
                                                  try {
                                                    const { perkApplicationsApi } = await import('../lib/api');
                                                    await perkApplicationsApi.apply({
                                                      perk_id: eventDetail.perks[0].perk_id,
                                                      theater_id: theater.theater_id,
                                                      quantity: 1,
                                                    });
                                                    alert('신청이 완료되었습니다.');
                                                    setShowTheaters(false);
                                                  } catch (err) {
                                                    alert((err as Error)?.message || '신청에 실패했습니다.');
                                                  }
                                                }}
                                              >
                                                신청
                                              </Button>
                                            </div>
                                          </div>
                                        </Card>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ));
                            })()}
                          </Accordion>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="text-sm text-gray-400">
                      총 {eventDetail.perks[0].theaters?.length || 0}개 지점에서 특전을 받을 수 있습니다
                    </div>
                  </div>
                )}

                {/* Event Image */}
                {eventDetail.image && (
                  <div className="p-6 border-t border-red-900/30">
                    <div className="max-w-md mx-auto">
                      <ImageWithFallback
                        src={eventDetail.image}
                        alt={eventDetail.title || '이벤트 이미지'}
                        className="w-full h-auto rounded-lg border border-red-900/30"
                      />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
