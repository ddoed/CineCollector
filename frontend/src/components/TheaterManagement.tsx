import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { inventoryApi, theatersApi } from '../lib/api';

export function TheaterManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editStock, setEditStock] = useState<Record<number, number>>({});
  const [myTheater, setMyTheater] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerkForEdit, setSelectedPerkForEdit] = useState<number | null>(null);
  const [selectedPerkForApplicants, setSelectedPerkForApplicants] = useState<number | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [theaterData, inventoryData, statsData] = await Promise.all([
          theatersApi.getMyTheater(),
          inventoryApi.getList({ movie_title: searchQuery || undefined }),
          inventoryApi.getStatistics(),
        ]);
        setMyTheater(theaterData);
        setInventory(inventoryData);
        setStatistics(statsData);
      } catch (err) {
        setError((err as Error)?.message ?? '데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery]);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (selectedPerkForApplicants) {
        try {
          const data = await inventoryApi.getApplicants(selectedPerkForApplicants);
          setApplicants(data);
        } catch (err) {
          console.error('신청자 목록을 불러오지 못했습니다:', err);
        }
      }
    };
    fetchApplicants();
  }, [selectedPerkForApplicants]);

  const handleUpdateStock = async (perkId: number, theaterId: number) => {
    try {
      const stock = editStock[perkId];
      if (stock === undefined) {
        return;
      }
      await inventoryApi.updateStock(perkId, theaterId, { stock });
      setSelectedPerkForEdit(null);
      setEditStock({});
      // 목록 새로고침
      const inventoryData = await inventoryApi.getList();
      setInventory(inventoryData);
      alert('재고가 수정되었습니다.');
    } catch (err) {
      alert((err as Error)?.message || '재고 수정에 실패했습니다.');
    }
  };

  const mockInventory = [
    {
      id: 1,
      movie: '듄: 파트2',
      event: '개봉 1주차 특전',
      perk: '포토카드 세트',
      week: 1,
      totalStock: 500,
      currentStock: 142,
      limitPerPerson: 1,
      status: 'AVAILABLE',
      startDate: '2024-03-01',
      endDate: '2024-03-07',
      applicants: [
        { id: 1, name: '김철수', email: 'kim@example.com', appliedAt: '2024-03-02 14:30', status: 'PENDING' },
        { id: 2, name: '이영희', email: 'lee@example.com', appliedAt: '2024-03-02 15:20', status: 'APPROVED' },
        { id: 3, name: '박민수', email: 'park@example.com', appliedAt: '2024-03-03 10:15', status: 'APPROVED' },
        { id: 4, name: '최수진', email: 'choi@example.com', appliedAt: '2024-03-03 16:45', status: 'PENDING' },
        { id: 5, name: '정현우', email: 'jung@example.com', appliedAt: '2024-03-04 09:30', status: 'APPROVED' },
      ]
    },
    {
      id: 2,
      movie: '듄: 파트2',
      perk: '아크라키스 포스터',
      event: '개봉 2주차 특전',
      week: 2,
      totalStock: 300,
      currentStock: 12,
      limitPerPerson: 1,
      status: 'AVAILABLE',
      startDate: '2024-03-08',
      endDate: '2024-03-14',
      applicants: [
        { id: 6, name: '강지훈', email: 'kang@example.com', appliedAt: '2024-03-08 11:20', status: 'APPROVED' },
        { id: 7, name: '한소희', email: 'han@example.com', appliedAt: '2024-03-09 13:45', status: 'PENDING' },
      ]
    },
    {
      id: 3,
      movie: '파묘',
      event: '개봉 1주차 특전',
      perk: '부적 카드',
      week: 1,
      totalStock: 400,
      currentStock: 0,
      limitPerPerson: 1,
      status: 'SOLD_OUT',
      startDate: '2024-03-01',
      endDate: '2024-03-07',
      applicants: [
        { id: 8, name: '윤서준', email: 'yoon@example.com', appliedAt: '2024-03-01 10:00', status: 'APPROVED' },
        { id: 9, name: '임지원', email: 'lim@example.com', appliedAt: '2024-03-01 14:30', status: 'APPROVED' },
      ]
    },
    {
      id: 4,
      movie: '웡카',
      event: '개봉 3주차 특전',
      perk: '한정 포토카드',
      week: 3,
      totalStock: 250,
      currentStock: 198,
      limitPerPerson: 1,
      status: 'AVAILABLE',
      startDate: '2024-03-15',
      endDate: '2024-03-21',
      applicants: [
        { id: 10, name: '송민호', email: 'song@example.com', appliedAt: '2024-03-15 16:20', status: 'PENDING' },
      ]
    },
    {
      id: 5,
      movie: '파묘',
      event: '개봉 4주차 특전',
      perk: '한정 필름',
      week: 4,
      totalStock: 200,
      currentStock: 156,
      limitPerPerson: 1,
      status: 'AVAILABLE',
      startDate: '2024-03-22',
      endDate: '2024-03-28',
      applicants: [
        { id: 11, name: '오승현', email: 'oh@example.com', appliedAt: '2024-03-22 09:15', status: 'APPROVED' },
        { id: 12, name: '배수지', email: 'bae@example.com', appliedAt: '2024-03-23 11:30', status: 'PENDING' },
        { id: 13, name: '조유리', email: 'jo@example.com', appliedAt: '2024-03-24 14:00', status: 'APPROVED' },
      ]
    },
  ];

  const getStockPercentage = (current: number, total: number) => {
    return (current / total) * 100;
  };

  const getStatusConfig = (stockPercentage: number) => {
    if (stockPercentage === 0) {
      return { label: '소진', color: 'text-gray-400' };
    }
    if (stockPercentage < 30) {
      return { label: '소량', color: 'text-yellow-500' };
    }
    return { label: '여유', color: 'text-red-500' };
  };

  const totalItems = inventory.length;
  const soldOutItems = inventory.filter(i => {
    const remaining = i.remaining_stock || 0;
    return remaining === 0;
  }).length;
  const lowStockItems = inventory.filter(i => {
    const remaining = i.remaining_stock || 0;
    const total = i.total_stock || 1;
    const percentage = getStockPercentage(remaining, total);
    return percentage > 0 && percentage < 30;
  }).length;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl mb-2 text-white">극장 재고 관리</h1>
          <p className="text-gray-400">영화사가 할당한 특전 재고를 조회하고 관리합니다</p>
        </motion.div>

        {/* Theater Info */}
        {loading ? (
          <Card className="bg-gray-900 border-red-900/50 p-6 mb-8">
            <div className="text-gray-400">로딩 중...</div>
          </Card>
        ) : error ? (
          <Card className="bg-gray-900 border-red-900/50 p-6 mb-8">
            <div className="text-red-500">{error}</div>
          </Card>
        ) : (
          <>
            <Card className="bg-gray-900 border-red-900/50 p-6 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-gray-400">담당 극장:</span>
                <span className="text-white text-lg">{myTheater?.name || '극장 정보 없음'}</span>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gray-900 border-red-900/30 p-6">
                <div className="text-sm text-gray-400 mb-1">총 특전 종류</div>
                <div className="text-3xl text-white">{totalItems}</div>
              </Card>
              
              <Card className="bg-gray-900 border-yellow-900/30 p-6">
                <div className="text-sm text-gray-400 mb-1">소량</div>
                <div className="text-3xl text-yellow-500">{lowStockItems}</div>
              </Card>
              
              <Card className="bg-gray-900 border-gray-700 p-6">
                <div className="text-sm text-gray-400 mb-1">소진</div>
                <div className="text-3xl text-gray-400">{soldOutItems}</div>
              </Card>
            </div>
          </>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="영화 제목, 특전 이름 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-red-900/30 text-white"
          />
        </div>

        {/* Inventory Table */}
        {loading ? (
          <Card className="bg-gray-900 border-red-900/30 p-12 text-center">
            <p className="text-gray-400">재고를 불러오는 중...</p>
          </Card>
        ) : error ? (
          <Card className="bg-gray-900 border-red-900/30 p-12 text-center">
            <p className="text-red-500">{error}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {inventory.map((item, index) => {
              const remainingStock = item.remaining_stock || 0;
              const totalStock = item.total_stock || 1;
              const stockPercentage = getStockPercentage(remainingStock, totalStock);
              const statusConfig = getStatusConfig(stockPercentage);

              return (
                <motion.div
                  key={item.perk_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gray-900 border-red-900/30 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Movie & Perk Info */}
                      <div className="lg:col-span-4">
                        <div>
                          <h3 className="mb-1 text-white">{item.movie?.title || '영화 제목'}</h3>
                          <p className="text-sm text-gray-400 mb-2">{item.perk_name}</p>
                          <div className="flex gap-2">
                            {item.week_no && (
                              <Badge variant="outline" className="border-red-600 text-red-600 text-xs">
                                {item.week_no}주차
                              </Badge>
                            )}
                            {item.event_title && (
                              <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                {item.event_title}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stock Progress */}
                      <div className="lg:col-span-5">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">재고 현황</span>
                            <span className={statusConfig.color}>{statusConfig.label}</span>
                          </div>
                          <Progress 
                            value={stockPercentage} 
                            className="h-3 bg-gray-800"
                          />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              잔여: <span className="text-red-500">{remainingStock}</span>
                            </span>
                            <span className="text-gray-400">
                              총: <span className="text-white">{totalStock}</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                              기간: {item.start_date} ~ {item.end_date}
                            </span>
                            {item.limit_per_user && (
                              <span className="text-red-400 font-medium">
                                1인당 {item.limit_per_user}개
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-3 flex flex-col gap-2 justify-center">
                        <Dialog open={selectedPerkForEdit === item.perk_id} onOpenChange={(open) => {
                          if (!open) setSelectedPerkForEdit(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => setSelectedPerkForEdit(item.perk_id)}
                            >
                              재고 수정
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black border-2 border-red-600/50 text-white">
                            <DialogHeader>
                              <DialogTitle className="text-xl text-white">재고 수정</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                현재 재고 수량을 수정합니다.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <Label className="text-gray-300">특전 정보</Label>
                                <p className="text-white mt-2">{item.movie?.title} - {item.perk_name}</p>
                                <p className="text-sm text-gray-400">현재 재고: {remainingStock}개</p>
                                {item.limit_per_user && (
                                  <p className="text-sm text-red-400">1인당 수령 제한: {item.limit_per_user}개</p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="edit-stock" className="text-gray-300">수정할 재고 수량</Label>
                                <Input 
                                  id="edit-stock"
                                  type="number"
                                  min="0"
                                  max={totalStock}
                                  placeholder={remainingStock.toString()}
                                  value={editStock[item.perk_id] || ''}
                                  onChange={(e) => setEditStock({
                                    ...editStock,
                                    [item.perk_id]: Number(e.target.value),
                                  })}
                                  className="bg-gray-900 border-red-900/50 text-white mt-2"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  0 ~ {totalStock} 사이의 값을 입력하세요
                                </p>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button 
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => {
                                    // theaterId는 myTheater에서 가져와야 함
                                    if (myTheater?.theater_id) {
                                      handleUpdateStock(item.perk_id, myTheater.theater_id);
                                    }
                                  }}
                                >
                                  수정 완료
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={selectedPerkForApplicants === item.perk_id} onOpenChange={(open) => {
                          if (!open) setSelectedPerkForApplicants(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full border-red-600 text-red-600 hover:bg-red-600/10"
                              onClick={() => setSelectedPerkForApplicants(item.perk_id)}
                            >
                              <Users className="w-4 h-4 mr-2" />
                              신청자 목록 ({item.applicant_count || 0})
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black border-2 border-red-600/50 text-white max-w-3xl">
                            <DialogHeader>
                              <DialogTitle className="text-xl text-white">신청자 목록</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                {item.movie?.title} - {item.perk_name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              <Table>
                                <TableHeader>
                                  <TableRow className="border-red-900/30 hover:bg-transparent">
                                    <TableHead className="text-gray-400">이름</TableHead>
                                    <TableHead className="text-gray-400">이메일</TableHead>
                                    <TableHead className="text-gray-400">신청일시</TableHead>
                                    <TableHead className="text-gray-400">수량</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {applicants.length === 0 ? (
                                    <TableRow>
                                      <TableCell colSpan={4} className="text-center text-gray-400">
                                        신청자가 없습니다.
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    applicants.map((applicant) => (
                                      <TableRow key={applicant.user_id} className="border-red-900/30 hover:bg-red-900/10">
                                        <TableCell className="text-white">{applicant.name}</TableCell>
                                        <TableCell className="text-gray-400">{applicant.email}</TableCell>
                                        <TableCell className="text-gray-400">
                                          {new Date(applicant.applied_at).toLocaleString('ko-KR')}
                                        </TableCell>
                                        <TableCell className="text-gray-400">{applicant.quantity}개</TableCell>
                                      </TableRow>
                                    ))
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}