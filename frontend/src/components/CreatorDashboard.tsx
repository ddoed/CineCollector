import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Film, Gift, Plus, Edit, Trash2, MapPin, Search, Eye, EyeOff } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { eventsApi, theatersApi, moviesApi, inventoryApi } from '../lib/api';
import { StockDistributionDialog } from './StockDistributionDialog';
import { uploadImageToS3 } from '../lib/imageUpload';
import { useAuth } from '../hooks/useAuth';

const posterFallback = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80';

export function CreatorDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheaters, setSelectedTheaters] = useState<number[]>([]);
  const [theaterSearchQuery, setTheaterSearchQuery] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventForDistribution, setSelectedEventForDistribution] = useState<any>(null);
  const [distributionStocks, setDistributionStocks] = useState<Record<number, number>>({});
  const [eventImageUrl, setEventImageUrl] = useState<string>('');
  const [perkImageUrl, setPerkImageUrl] = useState<string>('');
  const [uploadingEventImage, setUploadingEventImage] = useState(false);
  const [uploadingPerkImage, setUploadingPerkImage] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    weekNo: '',
    eventImage: '',
    perkName: '',
    perkType: '',
    totalQuantity: '',
    limitPerUser: '',
    perkDescription: '',
    perkImage: '',
    isPublic: true,
  });
  const [editSelectedTheaters, setEditSelectedTheaters] = useState<number[]>([]);
  const [editEventImageUrl, setEditEventImageUrl] = useState<string>('');
  const [editPerkImageUrl, setEditPerkImageUrl] = useState<string>('');
  const [uploadingEditEventImage, setUploadingEditEventImage] = useState(false);
  const [uploadingEditPerkImage, setUploadingEditPerkImage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, theatersData, moviesData, statsData] = await Promise.all([
          eventsApi.getManagementList({ status: '전체' }),
          theatersApi.getAll(),
          moviesApi.getAll(),
          eventsApi.getManagementStatistics(),
        ]);
        setEvents(eventsData);
        setTheaters(theatersData);
        setMovies(moviesData);
        setAnalytics(statsData);
      } catch (err) {
        setError((err as Error)?.message ?? '데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mockTheaters = [
    { id: 1, name: 'CGV 용산아이파크몰', region: '서울' },
    { id: 2, name: 'CGV 강남', region: '서울' },
    { id: 3, name: '메가박스 코엑스', region: '서울' },
    { id: 4, name: 'CGV 대구', region: '대구' },
    { id: 5, name: '롯데시네마 부산', region: '부산' },
    { id: 6, name: 'CGV 광주', region: '광주' },
    { id: 7, name: '메가박스 대전', region: '대전' },
    { id: 8, name: '롯데시네마 인천', region: '인천' },
  ];

  const handleTheaterToggle = (theaterId: number) => {
    setSelectedTheaters(prev => 
      prev.includes(theaterId) 
        ? prev.filter(id => id !== theaterId)
        : [...prev, theaterId]
    );
  };

  const filteredTheaters = theaters.filter(theater => {
    // Creator의 이름(예: 'CGV', '메가박스', '롯데시네마')으로 시작하는 극장만 필터링
    const matchesCreator = user?.name && theater.name?.startsWith(user.name);
    // 검색어 필터링
    const matchesSearch = theater.name?.toLowerCase().includes(theaterSearchQuery.toLowerCase()) ||
      theater.location?.toLowerCase().includes(theaterSearchQuery.toLowerCase());
    return matchesCreator && matchesSearch;
  });

  const mockEvents = [
    {
      id: 1,
      movie: '듄: 파트2',
      title: '1주차 포토카드 이벤트',
      image: 'https://images.unsplash.com/photo-1667757635625-ed2aed238b42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdW5lJTIwbW92aWUlMjBwb3N0ZXJ8ZW58MXx8fHwxNzYyMjI5OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      startDate: '2024-03-01',
      endDate: '2024-03-07',
      status: 'ACTIVE',
      isPublic: true,
      theaters: 12,
      perk: {
        name: '포토카드 세트',
        quantity: 500,
        type: '굿즈',
        limitPerPerson: 1
      }
    },
    {
      id: 2,
      movie: '듄: 파트2',
      title: '2주차 포스터 이벤트',
      image: 'https://images.unsplash.com/photo-1667757635625-ed2aed238b42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdW5lJTIwbW92aWUlMjBwb3N0ZXJ8ZW58MXx8fHwxNzYyMjI5OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      startDate: '2024-03-08',
      endDate: '2024-03-14',
      status: 'ACTIVE',
      isPublic: true,
      theaters: 12,
      perk: {
        name: '아크라키스 포스터',
        quantity: 300,
        type: '포스터',
        limitPerPerson: 1
      }
    },
    {
      id: 3,
      movie: '파묘',
      title: '1주차 부적 카드 이벤트',
      image: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjIxODA1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      startDate: '2024-03-01',
      endDate: '2024-03-07',
      status: 'ACTIVE',
      isPublic: false,
      theaters: 15,
      perk: {
        name: '부적 카드',
        quantity: 400,
        type: '굿즈',
        limitPerPerson: 1
      }
    },
    {
      id: 4,
      movie: '파묘',
      title: '4주차 한정 필름 이벤트',
      image: 'https://images.unsplash.com/photo-1712456298333-5747a9506a5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjIxODA1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      startDate: '2024-03-22',
      endDate: '2024-03-28',
      status: 'ACTIVE',
      isPublic: true,
      theaters: 15,
      perk: {
        name: '한정 필름',
        quantity: 200,
        type: '필름',
        limitPerPerson: 1
      }
    },
    {
      id: 5,
      movie: '웡카',
      title: '3주차 포토카드 이벤트',
      image: 'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NjIyMjk5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      startDate: '2023-12-15',
      endDate: '2023-12-21',
      status: 'COMPLETED',
      isPublic: true,
      theaters: 10,
      perk: {
        name: '한정 포토카드',
        quantity: 200,
        type: '포토카드',
        limitPerPerson: 1
      }
    },
  ];

  const filteredEvents = events.filter(event => {
    const movieTitle = event.movie?.title || '';
    const eventTitle = event.title || '';
    return movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
           eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreateEvent = async (formData: any) => {
    try {
      const movie = movies.find(m => m.title === formData.movieTitle);
      if (!movie) {
        alert('영화를 찾을 수 없습니다.');
        return;
      }

      await eventsApi.createWithPerk({
        movie_id: movie.movie_id,
        title: formData.eventTitle,
        start_date: formData.startDate,
        end_date: formData.endDate,
        week_no: formData.weekNo,
        event_image: formData.eventImage,
        is_public: formData.isPublic,
        theater_ids: selectedTheaters,
        perk: {
          name: formData.perkName,
          type: formData.perkType,
          total_quantity: formData.totalQuantity,
          limit_per_user: formData.limitPerUser,
          description: formData.perkDescription,
          perk_image: formData.perkImage,
        },
      });

      // 목록 새로고침
      const [eventsData, statsData] = await Promise.all([
        eventsApi.getManagementList({ status: '전체' }),
        eventsApi.getManagementStatistics(),
      ]);
      setEvents(eventsData);
      setAnalytics(statsData);
      setIsDialogOpen(false);
      setSelectedTheaters([]);
      alert('이벤트가 등록되었습니다.');
    } catch (err) {
      alert((err as Error)?.message || '이벤트 등록에 실패했습니다.');
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;
    if (!editFormData.title || !editFormData.startDate || !editFormData.endDate || !editFormData.weekNo) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    try {
      await eventsApi.update(editingEvent.event_id, {
        title: editFormData.title,
        start_date: editFormData.startDate,
        end_date: editFormData.endDate,
        week_no: Number(editFormData.weekNo),
      });
      setIsEditDialogOpen(false);
      setEditingEvent(null);
      // 목록 새로고침
      const [eventsData, statsData] = await Promise.all([
        eventsApi.getManagementList({ status: '전체' }),
        eventsApi.getManagementStatistics(),
      ]);
      setEvents(eventsData);
      setAnalytics(statsData);
      alert('이벤트가 수정되었습니다.');
    } catch (err) {
      alert((err as Error)?.message || '이벤트 수정에 실패했습니다.');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('정말 이벤트를 삭제하시겠습니까?')) {
      return;
    }
    try {
      await eventsApi.delete(eventId);
      const [eventsData, statsData] = await Promise.all([
        eventsApi.getManagementList({ status: '전체' }),
        eventsApi.getManagementStatistics(),
      ]);
      setEvents(eventsData);
      setAnalytics(statsData);
      alert('이벤트가 삭제되었습니다.');
    } catch (err) {
      alert((err as Error)?.message || '이벤트 삭제에 실패했습니다.');
    }
  };

  const handleDistributeStock = async (perkId: number) => {
    try {
      const theaterStocks = Object.entries(distributionStocks)
        .filter(([_, stock]) => stock > 0)
        .map(([theaterId, stock]) => ({
          theater_id: Number(theaterId),
          stock: Number(stock),
        }));

      if (theaterStocks.length === 0) {
        alert('배포할 재고를 입력해주세요.');
        return;
      }

      await inventoryApi.distributeStock(perkId, { theater_stocks: theaterStocks });
      setSelectedEventForDistribution(null);
      setDistributionStocks({});
      alert('재고 배포가 완료되었습니다.');
    } catch (err) {
      alert((err as Error)?.message || '재고 배포에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl md:text-4xl text-white">이벤트 관리</h1>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                // 다이얼로그 닫을 때 이미지 URL 초기화
                setEventImageUrl('');
                setPerkImageUrl('');
              }
            }}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="w-5 h-5 mr-2" />
                  신규 이벤트 등록
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="bg-black border-2 border-red-600/50 text-white"
                style={{ maxWidth: '60vw', width: '60vw', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle className="text-xl text-white">신규 이벤트 등록</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    새로운 특전 이벤트를 등록합니다. 이벤트 하나당 특전 하나가 등록됩니다.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const isPublicValue = formData.get('isPublic');
                  handleCreateEvent({
                    movieTitle: formData.get('movieTitle') as string,
                    eventTitle: formData.get('eventTitle') as string,
                    startDate: formData.get('startDate') as string,
                    endDate: formData.get('endDate') as string,
                    weekNo: Number(formData.get('weekNo')),
                    eventImage: eventImageUrl || undefined,
                    isPublic: isPublicValue === 'true' || isPublicValue === 'on',
                    perkName: formData.get('perkName') as string,
                    perkType: formData.get('perkType') as string,
                    totalQuantity: Number(formData.get('totalQuantity')),
                    limitPerUser: Number(formData.get('limitPerUser')),
                    perkDescription: formData.get('perkDescription') as string || undefined,
                    perkImage: perkImageUrl || undefined,
                  });
                  // 폼 제출 후 이미지 URL 초기화
                  setEventImageUrl('');
                  setPerkImageUrl('');
                }} className="flex-1 flex flex-col overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                  <div className="grid grid-cols-2 gap-6 mt-4">
                  {/* Left Column - Event Info */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">영화 선택</Label>
                      <Select name="movieTitle" required>
                        <SelectTrigger className="bg-gray-900 border-red-900/50 text-white mt-2">
                          <SelectValue placeholder="영화를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-red-900/50">
                          {movies.map(movie => (
                            <SelectItem key={movie.movie_id} value={movie.title} className="text-white">
                              {movie.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">이벤트 제목</Label>
                      <Input 
                        name="eventTitle"
                        placeholder="예: 1주차 포토카드 이벤트"
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">시작일</Label>
                        <Input 
                          name="startDate"
                          type="date"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">종료일</Label>
                        <Input 
                          name="endDate"
                          type="date"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">주차</Label>
                      <Input 
                        name="weekNo"
                        type="number"
                        placeholder="1"
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">이벤트 이미지</Label>
                      <Input 
                        type="file"
                        accept="image/*"
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setUploadingEventImage(true);
                              const url = await uploadImageToS3(file, 'events');
                              setEventImageUrl(url);
                            } catch (err) {
                              alert((err as Error)?.message || '이미지 업로드에 실패했습니다.');
                            } finally {
                              setUploadingEventImage(false);
                            }
                          }
                        }}
                        disabled={uploadingEventImage}
                      />
                      <input type="hidden" name="eventImage" value={eventImageUrl} />
                      {uploadingEventImage && (
                        <p className="text-sm text-gray-400 mt-1">업로드 중...</p>
                      )}
                      {eventImageUrl && !uploadingEventImage && (
                        <p className="text-sm text-green-400 mt-1">✓ 업로드 완료</p>
                      )}
                    </div>
                    
                    {/* Perk Info */}
                    <div className="border-t border-red-900/30 pt-4 mt-4">
                      <h3 className="text-white mb-4">특전 정보</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-300">특전 이름</Label>
                          <Input 
                            name="perkName"
                            placeholder="예: 포토카드 세트"
                            className="bg-gray-900 border-red-900/50 text-white mt-2"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300">특전 종류</Label>
                            <Select name="perkType" required>
                              <SelectTrigger className="bg-gray-900 border-red-900/50 text-white mt-2">
                                <SelectValue placeholder="선택" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-red-900/50">
                                <SelectItem value="굿즈" className="text-white">굿즈</SelectItem>
                                <SelectItem value="포스터" className="text-white">포스터</SelectItem>
                                <SelectItem value="포토카드" className="text-white">포토카드</SelectItem>
                                <SelectItem value="필름" className="text-white">필름</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-gray-300">총 제작 수량</Label>
                            <Input 
                              name="totalQuantity"
                              type="number"
                              placeholder="500"
                              className="bg-gray-900 border-red-900/50 text-white mt-2"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-300">1인당 수령 제한</Label>
                          <Input 
                            name="limitPerUser"
                            type="number"
                            placeholder="1"
                            className="bg-gray-900 border-red-900/50 text-white mt-2"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">특전 설명</Label>
                          <Input 
                            name="perkDescription"
                            placeholder="특전 설명 (선택사항)"
                            className="bg-gray-900 border-red-900/50 text-white mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">특전 이미지</Label>
                          <Input 
                            type="file"
                            accept="image/*"
                            className="bg-gray-900 border-red-900/50 text-white mt-2"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  setUploadingPerkImage(true);
                                  const url = await uploadImageToS3(file, 'perks');
                                  setPerkImageUrl(url);
                                } catch (err) {
                                  alert((err as Error)?.message || '이미지 업로드에 실패했습니다.');
                                } finally {
                                  setUploadingPerkImage(false);
                                }
                              }
                            }}
                            disabled={uploadingPerkImage}
                          />
                          <input type="hidden" name="perkImage" value={perkImageUrl} />
                          {uploadingPerkImage && (
                            <p className="text-sm text-gray-400 mt-1">업로드 중...</p>
                          )}
                          {perkImageUrl && !uploadingPerkImage && (
                            <p className="text-sm text-green-400 mt-1">✓ 업로드 완료</p>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <Label className="text-gray-300">이벤트 공개</Label>
                            <input type="hidden" name="isPublic" value="false" />
                            <Switch 
                              name="isPublic"
                              defaultChecked 
                              className="data-[state=checked]:bg-red-600"
                              onCheckedChange={(checked) => {
                                const hiddenInput = document.querySelector('input[name="isPublic"]') as HTMLInputElement;
                                if (hiddenInput) {
                                  hiddenInput.value = checked ? 'true' : 'false';
                                }
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            비공개 시 일반 사용자에게 표시되지 않습니다
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Theater Selection */}
                  <div className="border-l border-red-900/30 pl-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white">참여 극장 선택</h3>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="select-all"
                          checked={filteredTheaters.length > 0 && filteredTheaters.every(t => selectedTheaters.includes(t.theater_id))}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTheaters(prev => {
                                const newIds = filteredTheaters.map(t => t.theater_id);
                                return [...new Set([...prev, ...newIds])];
                              });
                            } else {
                              setSelectedTheaters(prev => 
                                prev.filter(id => !filteredTheaters.some(t => t.theater_id === id))
                              );
                            }
                          }}
                          className="border-red-600 data-[state=checked]:bg-red-600"
                        />
                        <Label htmlFor="select-all" className="text-white cursor-pointer text-sm">
                          전체 선택 ({selectedTheaters.filter(id => filteredTheaters.some(t => t.theater_id === id)).length}/{filteredTheaters.length})
                        </Label>
                      </div>
                    </div>
                    
                    {/* Search */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="극장명 또는 지역 검색..."
                        value={theaterSearchQuery}
                        onChange={(e) => setTheaterSearchQuery(e.target.value)}
                        className="bg-gray-900 border-red-900/50 text-white pl-10"
                      />
                    </div>

                    {/* Theater List */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {filteredTheaters.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          검색 결과가 없습니다
                        </div>
                      ) : (
                        filteredTheaters.map((theater) => (
                          <div key={theater.theater_id} className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg border border-red-900/30 hover:border-red-600/50 transition-colors">
                            <Checkbox 
                              id={`theater-${theater.theater_id}`}
                              checked={selectedTheaters.includes(theater.theater_id)}
                              onCheckedChange={() => handleTheaterToggle(theater.theater_id)}
                              className="border-red-600 data-[state=checked]:bg-red-600"
                            />
                            <Label 
                              htmlFor={`theater-${theater.theater_id}`} 
                              className="text-gray-300 cursor-pointer flex items-center gap-2 flex-1"
                            >
                              <span className="flex-1">{theater.name}</span>
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 mt-6 border-t border-red-900/30 flex-shrink-0">
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                    이벤트 등록
                  </Button>
                </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-400">영화별 특전 이벤트를 등록하고 극장별 배포를 관리하세요</p>
        </motion.div>

        {/* Analytics */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gray-900 border-red-900/50 p-6">
              <div className="text-gray-400">로딩 중...</div>
            </Card>
          </div>
        ) : error ? (
          <Card className="bg-gray-900 border-red-900/50 p-6 mb-8">
            <div className="text-red-500">{error}</div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gray-900 border-red-900/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">총 이벤트</div>
                  <div className="text-2xl text-white">{analytics?.total_events || 0}</div>
                </div>
                <Calendar className="w-8 h-8 text-red-600" />
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-red-900/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">진행중</div>
                  <div className="text-2xl text-white">{analytics?.ongoing_events || 0}</div>
                </div>
                <Film className="w-8 h-8 text-red-600" />
              </div>
            </Card>
            
            <Card className="bg-gray-900 border-red-900/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">총 특전 수량</div>
                  <div className="text-2xl text-white">{(analytics?.total_perk_quantity || 0).toLocaleString()}</div>
                </div>
                <Gift className="w-8 h-8 text-red-600" />
              </div>
            </Card>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="영화 제목, 이벤트명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900 border-red-900/50 text-white pl-12 py-6"
            />
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <Card className="bg-gray-900 border-red-900/30 p-12 text-center">
            <p className="text-gray-400">이벤트를 불러오는 중...</p>
          </Card>
        ) : error ? (
          <Card className="bg-gray-900 border-red-900/30 p-12 text-center">
            <p className="text-red-500">{error}</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredEvents.length === 0 ? (
              <Card className="bg-gray-900 border-red-900/30 p-12">
                <div className="text-center">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">검색 결과가 없습니다.</p>
                </div>
              </Card>
            ) : (
              filteredEvents.map((event, index) => {
                const firstPerk = event.perks && event.perks.length > 0 ? event.perks[0] : null;
                const status = event.status === '진행 중' ? 'ACTIVE' : 'COMPLETED';
                return (
                  <motion.div
                    key={event.event_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900 border-red-900/30 overflow-hidden h-[380px]">
                      <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        {/* Image */}
                        <div className="lg:col-span-3 h-full">
                          <div className="relative h-full">
                            <ImageWithFallback
                              src={event.movie?.image || event.image || posterFallback}
                              alt={event.movie?.title || '이벤트 이미지'}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <Badge 
                              className={`absolute top-4 right-4 ${
                                status === 'ACTIVE' 
                                  ? 'bg-red-600' 
                                  : 'bg-gray-600'
                              } text-white border-0`}
                            >
                              {status === 'ACTIVE' ? '진행중' : '종료'}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="lg:col-span-9 p-6 flex flex-col h-full">
                          {/* Header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 min-h-[80px]">
                            <div>
                              <h3 className="mb-1 text-white">{event.movie?.title || '영화 제목'}</h3>
                              <p className="text-sm text-gray-400 mb-2">{event.title}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Calendar className="w-3 h-3 text-gray-200" />
                                {event.start_date} ~ {event.end_date}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 md:self-start">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-600 text-red-600 hover:bg-red-600/10"
                                onClick={async () => {
                                  try {
                                    // 이벤트 상세 정보 가져오기
                                    const eventDetail = await eventsApi.getDetail(event.event_id);
                                    const firstPerk = eventDetail.perks && eventDetail.perks.length > 0 ? eventDetail.perks[0] : null;
                                    
                                    setEditingEvent(eventDetail);
                                    setEditFormData({
                                      title: eventDetail.title || '',
                                      startDate: eventDetail.start_date || '',
                                      endDate: eventDetail.end_date || '',
                                      weekNo: eventDetail.week_no ? String(eventDetail.week_no) : '',
                                      eventImage: eventDetail.image || '',
                                      perkName: firstPerk?.name || '',
                                      perkType: firstPerk?.type || '',
                                      totalQuantity: firstPerk?.quantity ? String(firstPerk.quantity) : '',
                                      limitPerUser: firstPerk?.limit_per_user ? String(firstPerk.limit_per_user) : '',
                                      perkDescription: firstPerk?.description || '',
                                      perkImage: firstPerk?.image || '',
                                      isPublic: true, // EventDetailDto에 is_public이 없으므로 기본값 사용
                                    });
                                    setEditEventImageUrl(eventDetail.image || '');
                                    setEditPerkImageUrl(firstPerk?.image || '');
                                    
                                    // 현재 선택된 극장 정보 가져오기 (등록된 모든 극장 체크)
                                    if (firstPerk?.theaters) {
                                      // 이벤트 생성 시 선택한 극장들 (재고가 0이어도 등록된 극장)
                                      const selectedTheaterIds = firstPerk.theaters
                                        .map((t) => t.theater_id);
                                      setEditSelectedTheaters(selectedTheaterIds);
                                    } else {
                                      setEditSelectedTheaters([]);
                                    }
                                    
                                    setIsEditDialogOpen(true);
                                  } catch (err) {
                                    alert((err as Error)?.message || '이벤트 상세 정보를 불러오지 못했습니다.');
                                  }
                                }}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                수정
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-600 text-red-600 hover:bg-red-600/10"
                                onClick={() => handleDeleteEvent(event.event_id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                삭제
                              </Button>
                            </div>
                          </div>

                          {/* Perk Info Card */}
                          {firstPerk && (
                            <div className="bg-black border border-red-900/30 rounded-lg p-5 flex flex-col h-[240px]">
                              <div className="flex items-center gap-2 mb-3">
                                <h4 className="text-white text-lg">{firstPerk.name}</h4>
                                <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                  {firstPerk.type}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                <div>
                                  <span className="text-gray-400">참여 극장: </span>
                                  <span className="text-white">{event.theater_count || 0}개</span>
                                </div>
                              </div>
                              
                              <StockDistributionDialog
                                perkName={firstPerk.name}
                                movieTitle={event.movie?.title || '영화 제목'}
                                perkType={firstPerk.type}
                                perkId={firstPerk.perk_id}
                                distributionStocks={distributionStocks}
                                onStockChange={(theaterId, stock) => {
                                  setDistributionStocks({
                                    ...distributionStocks,
                                    [theaterId]: stock,
                                  });
                                }}
                                onDistribute={() => {
                                  handleDistributeStock(firstPerk.perk_id);
                                }}
                                trigger={
                                  <Button 
                                    className="w-full bg-red-600 hover:bg-red-700 text-white mt-auto"
                                    onClick={() => setSelectedEventForDistribution(event)}
                                  >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    극장별 재고 배포 관리
                                  </Button>
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* 수정 다이얼로그 */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingEvent(null);
            setEditFormData({
              title: '',
              startDate: '',
              endDate: '',
              weekNo: '',
              eventImage: '',
              perkName: '',
              perkType: '',
              totalQuantity: '',
              limitPerUser: '',
              perkDescription: '',
              perkImage: '',
              isPublic: true,
            });
            setEditEventImageUrl('');
            setEditPerkImageUrl('');
            setEditSelectedTheaters([]);
          }
        }}>
          <DialogContent 
            className="bg-black border-2 border-red-600/50 text-white"
            style={{ maxWidth: '60vw', width: '60vw', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl text-white">이벤트 수정</DialogTitle>
              <DialogDescription className="text-gray-400">
                이벤트 정보를 수정하세요.
              </DialogDescription>
            </DialogHeader>
            {editingEvent && (
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-6 mt-4">
                {/* Left Column - Event Info */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">영화</Label>
                    <div className="mt-2 p-3 bg-gray-900 border border-red-900/50 rounded-md text-white">
                      {editingEvent.movie?.title || '알 수 없음'}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-event-title" className="text-gray-300">이벤트 제목</Label>
                    <Input 
                      id="edit-event-title"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      placeholder="예: 1주차 포토카드 이벤트"
                      className="bg-gray-900 border-red-900/50 text-white mt-2"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-start-date" className="text-gray-300">시작일</Label>
                      <Input 
                        id="edit-start-date"
                        type="date"
                        value={editFormData.startDate}
                        onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-end-date" className="text-gray-300">종료일</Label>
                      <Input 
                        id="edit-end-date"
                        type="date"
                        value={editFormData.endDate}
                        onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-week-no" className="text-gray-300">주차</Label>
                    <Input 
                      id="edit-week-no"
                      type="number"
                      value={editFormData.weekNo}
                      onChange={(e) => setEditFormData({ ...editFormData, weekNo: e.target.value })}
                      placeholder="1"
                      className="bg-gray-900 border-red-900/50 text-white mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">이벤트 이미지</Label>
                    <Input 
                      type="file"
                      accept="image/*"
                      className="bg-gray-900 border-red-900/50 text-white mt-2"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setUploadingEditEventImage(true);
                            const url = await uploadImageToS3(file, 'events');
                            setEditEventImageUrl(url);
                            setEditFormData({ ...editFormData, eventImage: url });
                          } catch (err) {
                            alert((err as Error)?.message || '이미지 업로드에 실패했습니다.');
                          } finally {
                            setUploadingEditEventImage(false);
                          }
                        }
                      }}
                      disabled={uploadingEditEventImage}
                    />
                    {uploadingEditEventImage && (
                      <p className="text-sm text-gray-400 mt-1">업로드 중...</p>
                    )}
                    {editEventImageUrl && !uploadingEditEventImage && (
                      <p className="text-sm text-green-400 mt-1">✓ 업로드 완료</p>
                    )}
                    {editEventImageUrl && (
                      <img src={editEventImageUrl} alt="이벤트 이미지" className="mt-2 w-full h-32 object-cover rounded" />
                    )}
                  </div>
                  
                  {/* Perk Info */}
                  <div className="border-t border-red-900/30 pt-4 mt-4">
                    <h3 className="text-white mb-4">특전 정보</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">특전 이름</Label>
                        <Input 
                          value={editFormData.perkName}
                          onChange={(e) => setEditFormData({ ...editFormData, perkName: e.target.value })}
                          placeholder="예: 포토카드 세트"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">특전 종류</Label>
                          <Select value={editFormData.perkType} onValueChange={(value) => setEditFormData({ ...editFormData, perkType: value })}>
                            <SelectTrigger className="bg-gray-900 border-red-900/50 text-white mt-2">
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-red-900/50">
                              <SelectItem value="굿즈" className="text-white">굿즈</SelectItem>
                              <SelectItem value="포스터" className="text-white">포스터</SelectItem>
                              <SelectItem value="포토카드" className="text-white">포토카드</SelectItem>
                              <SelectItem value="필름" className="text-white">필름</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-gray-300">총 제작 수량</Label>
                          <Input 
                            type="number"
                            value={editFormData.totalQuantity}
                            onChange={(e) => setEditFormData({ ...editFormData, totalQuantity: e.target.value })}
                            placeholder="500"
                            className="bg-gray-900 border-red-900/50 text-white mt-2"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">1인당 수령 제한</Label>
                        <Input 
                          type="number"
                          value={editFormData.limitPerUser}
                          onChange={(e) => setEditFormData({ ...editFormData, limitPerUser: e.target.value })}
                          placeholder="1"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">특전 설명</Label>
                        <Input 
                          value={editFormData.perkDescription}
                          onChange={(e) => setEditFormData({ ...editFormData, perkDescription: e.target.value })}
                          placeholder="특전 설명 (선택사항)"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">특전 이미지</Label>
                        <Input 
                          type="file"
                          accept="image/*"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setUploadingEditPerkImage(true);
                                const url = await uploadImageToS3(file, 'perks');
                                setEditPerkImageUrl(url);
                                setEditFormData({ ...editFormData, perkImage: url });
                              } catch (err) {
                                alert((err as Error)?.message || '이미지 업로드에 실패했습니다.');
                              } finally {
                                setUploadingEditPerkImage(false);
                              }
                            }
                          }}
                          disabled={uploadingEditPerkImage}
                        />
                        {uploadingEditPerkImage && (
                          <p className="text-sm text-gray-400 mt-1">업로드 중...</p>
                        )}
                        {editPerkImageUrl && !uploadingEditPerkImage && (
                          <p className="text-sm text-green-400 mt-1">✓ 업로드 완료</p>
                        )}
                        {editPerkImageUrl && (
                          <img src={editPerkImageUrl} alt="특전 이미지" className="mt-2 w-full h-32 object-cover rounded" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label className="text-gray-300">이벤트 공개</Label>
                          <Switch 
                            checked={editFormData.isPublic}
                            onCheckedChange={(checked) => setEditFormData({ ...editFormData, isPublic: checked })}
                            className="data-[state=checked]:bg-red-600"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          비공개 시 일반 사용자에게 표시되지 않습니다
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Theater Selection */}
                <div className="border-l border-red-900/30 pl-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white">참여 극장 선택</h3>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="edit-select-all"
                        checked={filteredTheaters.length > 0 && filteredTheaters.every(t => editSelectedTheaters.includes(t.theater_id))}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditSelectedTheaters(prev => {
                              const newIds = filteredTheaters.map(t => t.theater_id);
                              return [...new Set([...prev, ...newIds])];
                            });
                          } else {
                            setEditSelectedTheaters(prev => 
                              prev.filter(id => !filteredTheaters.some(t => t.theater_id === id))
                            );
                          }
                        }}
                        className="border-red-600 data-[state=checked]:bg-red-600"
                      />
                      <Label htmlFor="edit-select-all" className="text-white cursor-pointer text-sm">
                        전체 선택 ({editSelectedTheaters.filter(id => filteredTheaters.some(t => t.theater_id === id)).length}/{filteredTheaters.length})
                      </Label>
                    </div>
                  </div>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="극장명 또는 지역 검색..."
                      value={theaterSearchQuery}
                      onChange={(e) => setTheaterSearchQuery(e.target.value)}
                      className="bg-gray-900 border-red-900/50 text-white pl-10"
                    />
                  </div>

                  {/* Theater List */}
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {filteredTheaters.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        검색 결과가 없습니다
                      </div>
                    ) : (
                      filteredTheaters.map((theater) => (
                        <div key={theater.theater_id} className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg border border-red-900/30 hover:border-red-600/50 transition-colors">
                          <Checkbox 
                            id={`edit-theater-${theater.theater_id}`}
                            checked={editSelectedTheaters.includes(theater.theater_id)}
                            onCheckedChange={() => {
                              setEditSelectedTheaters(prev => 
                                prev.includes(theater.theater_id)
                                  ? prev.filter(id => id !== theater.theater_id)
                                  : [...prev, theater.theater_id]
                              );
                            }}
                            className="border-red-600 data-[state=checked]:bg-red-600"
                          />
                          <Label 
                            htmlFor={`edit-theater-${theater.theater_id}`} 
                            className="text-gray-300 cursor-pointer flex items-center gap-2 flex-1"
                          >
                            <span className="flex-1">{theater.name}</span>
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-4 mt-6 border-t border-red-900/30 flex-shrink-0">
              <Button
                onClick={handleUpdateEvent}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                수정 완료
              </Button>
              <Button
                onClick={() => setIsEditDialogOpen(false)}
                variant="outline"
                className="flex-1 border-red-900/50 text-gray-400 hover:text-white"
              >
                취소
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
