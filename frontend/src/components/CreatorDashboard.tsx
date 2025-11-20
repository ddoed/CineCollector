import { useState } from 'react';
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

export function CreatorDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheaters, setSelectedTheaters] = useState<number[]>([]);
  const [theaterSearchQuery, setTheaterSearchQuery] = useState('');

  const theaters = [
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

  const filteredTheaters = theaters.filter(theater => 
    theater.name.toLowerCase().includes(theaterSearchQuery.toLowerCase()) ||
    theater.region.toLowerCase().includes(theaterSearchQuery.toLowerCase())
  );

  const events = [
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

  const analytics = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.status === 'ACTIVE').length,
    totalPerks: events.reduce((sum, e) => sum + e.perk.quantity, 0),
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.movie.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="w-5 h-5 mr-2" />
                  신규 이벤트 등록
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-2 border-red-600/50 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl text-white">신규 이벤트 등록</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    새로운 특전 이벤트를 등록합니다. 이벤트 하나당 특전 하나가 등록됩니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  {/* Left Column - Event Info */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">영화 제목</Label>
                      <Input 
                        placeholder="영화 제목 입력"
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">이벤트 제목</Label>
                      <Input 
                        placeholder="예: 1주차 포토카드 이벤트"
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">시작일</Label>
                        <Input 
                          type="date"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">종료일</Label>
                        <Input 
                          type="date"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">이벤트 이미지 URL</Label>
                      <Input 
                        placeholder="https://..."
                        className="bg-gray-900 border-red-900/50 text-white mt-2"
                      />
                    </div>
                    
                    {/* Perk Info */}
                    <div className="border-t border-red-900/30 pt-4 mt-4">
                      <h3 className="text-white mb-4">특전 정보</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-300">특전 이름</Label>
                          <Input 
                            placeholder="예: 포토카드 세트"
                            className="bg-gray-900 border-red-900/50 text-white mt-2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-gray-300">특전 종류</Label>
                            <Select>
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
                              placeholder="500"
                              className="bg-gray-900 border-red-900/50 text-white mt-2"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-300">1인당 수령 제한</Label>
                          <Input 
                            type="number"
                            placeholder="1"
                            className="bg-gray-900 border-red-900/50 text-white mt-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <Label className="text-gray-300">이벤트 공개</Label>
                            <Switch defaultChecked className="data-[state=checked]:bg-red-600" />
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
                          checked={selectedTheaters.length === theaters.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTheaters(theaters.map(t => t.id));
                            } else {
                              setSelectedTheaters([]);
                            }
                          }}
                          className="border-red-600 data-[state=checked]:bg-red-600"
                        />
                        <Label htmlFor="select-all" className="text-white cursor-pointer text-sm">
                          전체 선택 ({selectedTheaters.length}/{theaters.length})
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
                          <div key={theater.id} className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg border border-red-900/30 hover:border-red-600/50 transition-colors">
                            <Checkbox 
                              id={`theater-${theater.id}`}
                              checked={selectedTheaters.includes(theater.id)}
                              onCheckedChange={() => handleTheaterToggle(theater.id)}
                              className="border-red-600 data-[state=checked]:bg-red-600"
                            />
                            <Label 
                              htmlFor={`theater-${theater.id}`} 
                              className="text-gray-300 cursor-pointer flex items-center gap-2 flex-1"
                            >
                              <span className="flex-1">{theater.name}</span>
                              <Badge variant="outline" className="border-gray-600 text-gray-500 text-xs">
                                {theater.region}
                              </Badge>
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 mt-6 border-t border-red-900/30">
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                    이벤트 등록
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-400">영화별 특전 이벤트를 등록하고 극장별 배포를 관리하세요</p>
        </motion.div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900 border-red-900/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">총 이벤트</div>
                <div className="text-2xl text-white">{analytics.totalEvents}</div>
              </div>
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
          </Card>
          
          <Card className="bg-gray-900 border-red-900/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">진행중</div>
                <div className="text-2xl text-white">{analytics.activeEvents}</div>
              </div>
              <Film className="w-8 h-8 text-red-600" />
            </div>
          </Card>
          
          <Card className="bg-gray-900 border-red-900/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">총 특전 수량</div>
                <div className="text-2xl text-white">{analytics.totalPerks.toLocaleString()}</div>
              </div>
              <Gift className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

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
            return (
              <motion.div
                key={event.id}
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
                          src={event.image}
                          alt={event.movie}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <Badge 
                          className={`absolute top-4 right-4 ${
                            event.status === 'ACTIVE' 
                              ? 'bg-red-600' 
                              : 'bg-gray-600'
                          } text-white border-0`}
                        >
                          {event.status === 'ACTIVE' ? '진행중' : '종료'}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-9 p-6 flex flex-col h-full">
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 min-h-[80px]">
                        <div>
                          <h3 className="mb-1 text-white">{event.movie}</h3>
                          <p className="text-sm text-gray-400 mb-2">{event.title}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {event.startDate} ~ {event.endDate}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:self-start">
                          <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600/10">
                            <Edit className="w-4 h-4 mr-1" />
                            수정
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-600/10">
                            <Trash2 className="w-4 h-4 mr-1" />
                            삭제
                          </Button>
                        </div>
                      </div>

                      {/* Perk Info Card */}
                      <div className="bg-black border border-red-900/30 rounded-lg p-5 flex flex-col h-[240px]">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="text-white text-lg">{event.perk.name}</h4>
                          <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                            {event.perk.type}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          <div>
                            <span className="text-gray-400">총 제작 수량: </span>
                            <span className="text-white">{event.perk.quantity}개</span>
                          </div>
                          <div>
                            <span className="text-gray-400">1인당 수령: </span>
                            <span className="text-red-500">{event.perk.limitPerPerson}개</span>
                          </div>
                          <div>
                            <span className="text-gray-400">참여 극장: </span>
                            <span className="text-white">{event.theaters}개</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 py-3 border-t border-red-900/20 mb-3">
                          <div className="flex items-center gap-2">
                            {event.isPublic ? (
                              <Eye className="w-4 h-4 text-green-500" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            )}
                            <span className={`text-sm ${event.isPublic ? 'text-green-500' : 'text-gray-500'}`}>
                              {event.isPublic ? '공개' : '비공개'}
                            </span>
                          </div>
                          <Switch 
                            defaultChecked={event.isPublic} 
                            className="data-[state=checked]:bg-red-600"
                          />
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white mt-auto">
                              <MapPin className="w-4 h-4 mr-2" />
                              극장별 재고 배포 관리
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black border-2 border-red-600/50 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl text-white">
                                {event.perk.name} - 극장별 재고 배포
                              </DialogTitle>
                              <DialogDescription className="text-gray-400">
                                각 극장에 배포할 재고를 등록합니다. (Inventory INSERT)
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              {/* Perk Info */}
                              <Card className="bg-gray-900 border-red-900/30 p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-sm text-gray-400">특전 정보</div>
                                    <div className="text-white mt-1">{event.movie}</div>
                                    <div className="text-sm text-gray-400 mt-1">{event.perk.name} ({event.perk.type})</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-400">총 제작 수량</div>
                                    <div className="text-2xl text-red-500">{event.perk.quantity}</div>
                                  </div>
                                </div>
                              </Card>

                              {/* Theaters List */}
                              <div className="space-y-3">
                                {[
                                  { id: 1, name: 'CGV 용산아이파크몰', region: '서울', current: 0 },
                                  { id: 2, name: 'CGV 강남', region: '서울', current: 0 },
                                  { id: 3, name: '메가박스 코엑스', region: '서울', current: 0 },
                                  { id: 4, name: 'CGV 대구', region: '대구', current: 0 },
                                  { id: 5, name: '롯데시네마 부산', region: '부산', current: 0 },
                                  { id: 6, name: 'CGV 광주', region: '광주', current: 0 },
                                  { id: 7, name: '메가박스 대전', region: '대전', current: 0 },
                                  { id: 8, name: '롯데시네마 인천', region: '인천', current: 0 },
                                ].map((theater) => (
                                  <Card key={theater.id} className="bg-gray-900 border-red-900/30 p-4">
                                    <div className="flex items-center gap-4">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <MapPin className="w-4 h-4 text-red-600" />
                                          <span className="text-white">{theater.name}</span>
                                          <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                            {theater.region}
                                          </Badge>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                          현재 배포: {theater.current}개
                                        </div>
                                      </div>
                                      <div className="w-32">
                                        <Input 
                                          type="number"
                                          min="0"
                                          placeholder="배포 수량"
                                          className="bg-black border-red-900/50 text-white"
                                        />
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>

                              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                                재고 배포 완료
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
}
