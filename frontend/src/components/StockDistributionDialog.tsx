import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { inventoryApi } from '../lib/api';

interface Theater {
  theater_id: number;
  name: string;
  location?: string | null;
  current_stock?: number;
}

interface StockDistributionDialogProps {
  perkName: string;
  movieTitle: string;
  perkType: string;
  perkId: number;
  distributionStocks: Record<number, number>;
  onStockChange: (theaterId: number, stock: number) => void;
  onDistribute: () => void;
  trigger: React.ReactNode;
}

export function StockDistributionDialog({
  perkName,
  movieTitle,
  perkType,
  perkId,
  distributionStocks,
  onStockChange,
  onDistribute,
  trigger,
}: StockDistributionDialogProps) {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchTheaters = async () => {
        try {
          setLoading(true);
          const distribution = await inventoryApi.getTheaterStockDistribution(perkId);
          const fetchedTheaters = distribution.theaters || [];
          setTheaters(fetchedTheaters);
          
          // 기존 재고 수량을 distributionStocks에 초기값으로 설정
          fetchedTheaters.forEach((theater: Theater) => {
            if (theater.current_stock !== undefined && theater.current_stock > 0) {
              onStockChange(theater.theater_id, theater.current_stock);
            }
          });
        } catch (err) {
          console.error('극장 정보를 불러오지 못했습니다:', err);
          setTheaters([]);
        } finally {
          setLoading(false);
        }
      };
      fetchTheaters();
    }
  }, [open, perkId]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className="bg-black border-2 border-red-600/50 text-white max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: '60vw', width: '60vw' }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {perkName} - 극장별 재고 배포
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            각 극장에 배포할 재고를 등록합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Perk Info */}
          <Card className="bg-gray-900 border-red-900/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">특전 정보</div>
                <div className="text-white mt-1">{movieTitle}</div>
                <div className="text-sm text-gray-400 mt-1">{perkName} ({perkType})</div>
              </div>
            </div>
          </Card>

          {/* Theaters List */}
          {loading ? (
            <div className="text-center py-8 text-gray-400">극장 정보를 불러오는 중...</div>
          ) : theaters.length === 0 ? (
            <div className="text-center py-8 text-gray-400">등록된 극장이 없습니다.</div>
          ) : (
            <div className="space-y-3">
              {theaters.map((theater) => (
              <Card key={theater.theater_id} className="bg-gray-900 border-red-900/30 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-white">{theater.name}</span>
                      {theater.location && (
                        <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                          {theater.location}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="w-32">
                    <Input 
                      type="number"
                      min="0"
                      placeholder="배포 수량"
                      className="bg-black border-red-900/50 text-white"
                      value={distributionStocks[theater.theater_id] ?? (theater.current_stock ?? '')}
                      onChange={(e) => onStockChange(theater.theater_id, Number(e.target.value))}
                    />
                    {theater.current_stock !== undefined && theater.current_stock > 0 && (
                      <p className="text-xs text-gray-400 mt-1">현재: {theater.current_stock}개</p>
                    )}
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}

          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={onDistribute}
          >
            재고 배포 완료
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

