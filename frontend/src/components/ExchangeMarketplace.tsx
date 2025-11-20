import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowLeftRight, Plus, Clock, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Avatar } from './ui/avatar';

interface Exchange {
  id: number;
  images: string[];
  title: string;
  offering: string;
  wanting: string;
  price: string;
  postedAt: string;
  status: 'available' | 'completed';
  user: string;
  description?: string;
}

export function ExchangeMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'completed'>('all');
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);

  const exchanges = [
    {
      id: 1,
      images: [
        'https://images.unsplash.com/photo-1664997296099-5a0b63ab0196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwY2FyZHMlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MjI0NzMyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
      title: '듄: 파트2 포토카드 세트 ↔ 파묘 부적 카드',
      offering: '듄: 파트2 포토카드 세트',
      wanting: '파묘 부적 카드',
      price: '교환',
      postedAt: '2시간 전',
      status: 'available',
      user: '영화광수집가',
      description: '듄: 파트2 개봉 1주차 특전 포토카드 세트입니다. 5종 풀세트이며 상태 매우 좋습니다. 파묘 부적 카드와 교환 원합니다.',
    },
    {
      id: 2,
      images: [
        'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwY2FyZHN8ZW58MXx8fHwxNzYyMjQ2MDY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
      title: '웡카 초콜릿 티켓 ↔ 듄: 파트2 아크라키스 포스터',
      offering: '웡카 초콜릿 티켓',
      wanting: '듄: 파트2 아크라키스 포스터',
      price: '교환',
      postedAt: '5시간 전',
      status: 'available',
      user: 'MovieCollector',
      description: '웡카 초콜릿 공장 굿즈입니다. 직거래 또는 택배 가능합니다.',
    },
    {
      id: 3,
      images: [
        'https://images.unsplash.com/photo-1607310073276-9f48dec47340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWN0aWJsZSUyMGNhcmRzfGVufDF8fHx8MTc2MjIzODAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
      title: '파묘 한정 필름 ↔ 웡카 한정 포토카드',
      offering: '파묘 한정 필름',
      wanting: '웡카 한정 포토카드',
      price: '교환',
      postedAt: '1일 전',
      status: 'completed',
      user: '특전헌터',
      description: '교환 완료되었습니다.',
    },
    {
      id: 4,
      images: [
        'https://images.unsplash.com/photo-1679699316094-a74534381e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMG1pbmltYWx8ZW58MXx8fHwxNzYyMjQ2MDY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
      title: '듄: 파트2 특별 필름마크 ↔ 파묘 영화 포스터',
      offering: '듄: 파트2 특별 필름마크',
      wanting: '파묘 영화 포스터',
      price: '교환',
      postedAt: '3시간 전',
      status: 'available',
      user: '시네마러버',
      description: '4주차 특전 필름마크입니다. 파묘 공식 포스터와 교환하고 싶습니다.',
    },
    {
      id: 5,
      images: [
        'https://images.unsplash.com/photo-1664997296099-5a0b63ab0196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwY2FyZHMlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MjI0NzMyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
      title: '웡카 캐릭터 스티커 ↔ 듄: 파트2 포토카드 세트',
      offering: '웡카 캐릭터 스티커',
      wanting: '듄: 파트2 포토카드 세트',
      price: '교환',
      postedAt: '2일 전',
      status: 'available',
      user: '수집왕',
      description: '웡카 캐릭터 스티커 세트입니다. 미개봉 새상품입니다.',
    },
    {
      id: 6,
      images: [
        'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwY2FyZHN8ZW58MXx8fHwxNzYyMjQ2MDY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ],
      title: '오펜하이머 한정 포스터 ↔ 서울의 봄 스페셜 포스터',
      offering: '오펜하이머 한정 포스터',
      wanting: '서울의 봄 스페셜 포스터',
      price: '교환',
      postedAt: '6시간 전',
      status: 'available',
      user: '포스터매니아',
      description: 'IMAX 상영관 한정 포스터입니다. A3 사이즈, 상태 완벽합니다.',
    },
  ];

  const filteredExchanges = exchanges.filter(exchange => {
    if (searchQuery && !exchange.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterStatus !== 'all' && exchange.status !== filterStatus) {
      return false;
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
          <h1 className="text-3xl mb-2">특전 교환</h1>
        </motion.div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            교환 등록하기
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="영화 제목, 특전 이름 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-red-900/50 text-white h-11"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              className={filterStatus === 'all' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/50 text-gray-400 hover:text-white'}
            >
              전체
            </Button>
            <Button
              variant={filterStatus === 'available' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('available')}
              className={filterStatus === 'available' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/50 text-gray-400 hover:text-white'}
            >
              교환 가능
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('completed')}
              className={filterStatus === 'completed' ? 'bg-red-600 hover:bg-red-700' : 'border-red-900/50 text-gray-400 hover:text-white'}
            >
              교환 완료
            </Button>
          </div>
        </div>

        {/* Exchange Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredExchanges.map((exchange, index) => (
            <motion.div
              key={exchange.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="cursor-pointer"
              onClick={() => setSelectedExchange(exchange)}
            >
              <Card className="bg-black border border-red-900/50 overflow-hidden hover:border-red-600/70 transition-all group">
                {/* Image */}
                <div className="aspect-square bg-gray-900 overflow-hidden relative">
                  <ImageWithFallback
                    src={exchange.images[0]}
                    alt={exchange.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {exchange.status === 'completed' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Badge className="bg-gray-800 text-white border-0">
                        교환 완료
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-2.5">
                  <h3 className="text-sm text-white mb-2 line-clamp-2 min-h-[2.5rem]">
                    {exchange.title}
                  </h3>

                  <div className="text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{exchange.postedAt}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredExchanges.length === 0 && (
          <Card className="bg-black border-2 border-red-900/50 p-12 text-center">
            <p className="text-gray-400">검색 결과가 없습니다.</p>
          </Card>
        )}

        {/* Detail Modal */}
        {selectedExchange && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedExchange(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-black border-2 border-red-600/50 shadow-2xl">
                {/* Modal Header */}
                <div className="p-4 border-b border-red-900/50 flex items-center justify-between">
                  <h2 className="text-xl text-white">교환 상세</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedExchange(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Horizontal Layout */}
                <div className="flex flex-col md:flex-row">
                  {/* Left: Image Gallery */}
                  <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-red-900/50">
                    <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden sticky top-6">
                      <ImageWithFallback
                        src={selectedExchange.images[0]}
                        alt={selectedExchange.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="md:w-1/2 flex flex-col">
                    {/* Product Info */}
                    <div className="p-6 flex-1 border-b border-red-900/50">
                      <h3 className="text-xl text-white mb-4">{selectedExchange.title}</h3>
                      
                      <div className="space-y-4 mb-6">
                        <div className="bg-gray-900 border border-red-900/50 rounded-lg p-4">
                          <div className="text-sm text-red-400 mb-2">제공하는 특전</div>
                          <div className="text-white">{selectedExchange.offering}</div>
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-600/50 flex items-center justify-center">
                            <ArrowLeftRight className="w-5 h-5 text-red-600" />
                          </div>
                        </div>

                        <div className="bg-gray-900 border border-red-900/50 rounded-lg p-4">
                          <div className="text-sm text-red-400 mb-2">원하는 특전</div>
                          <div className="text-white">{selectedExchange.wanting}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-2">상세 설명</div>
                        <p className="text-gray-300">{selectedExchange.description}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{selectedExchange.postedAt}</span>
                      </div>
                    </div>

                    {/* User Info & Action */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Avatar className="w-12 h-12 bg-red-600/20 border border-red-600/30" />
                        <div>
                          <div className="text-white">{selectedExchange.user}</div>
                          <div className="text-sm text-gray-400">판매자</div>
                        </div>
                      </div>

                      {selectedExchange.status === 'available' ? (
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                          교환 제안하기
                        </Button>
                      ) : (
                        <Button className="w-full bg-gray-600 text-white" disabled>
                          교환 완료된 상품
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
