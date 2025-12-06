import { motion } from 'motion/react';
import { Calendar, Edit, Film, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useAuth } from '../hooks/useAuth';
import { viewingRecordsApi, usersApi } from '../lib/api';
import { uploadImageToS3 } from '../lib/imageUpload';
import { useEffect, useState } from 'react';

interface UserProfileProps {
  onNavigateToWatchHistory?: () => void;
}

const posterFallback = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80';

export function UserProfile({ onNavigateToWatchHistory }: UserProfileProps) {
  const { user, refreshUser } = useAuth();
  const [recentMovies, setRecentMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editProfileImage, setEditProfileImage] = useState('');
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);

  useEffect(() => {
    const fetchRecentRecords = async () => {
      try {
        setLoading(true);
        const records = await viewingRecordsApi.getMyViewingRecords();
        setRecentMovies(records.slice(0, 4)); // 최근 4개만
      } catch (err) {
        console.error('관람 기록을 불러오지 못했습니다:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchRecentRecords();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditProfileImage(user.profileImage || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await usersApi.updateProfile({
        name: editName,
        profile_image: editProfileImage || undefined,
      });
      await refreshUser();
      setIsEditDialogOpen(false);
      alert('프로필이 수정되었습니다.');
    } catch (err) {
      alert((err as Error)?.message || '프로필 수정에 실패했습니다.');
    }
  };


  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl">프로필</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-black border border-red-900/50 p-6 sticky top-20">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-red-600/50">
                    {user?.profileImage && (
                      <AvatarImage 
                        src={user.profileImage} 
                        alt={user?.name || '프로필'}
                        className="object-cover"
                        loading="eager"
                      />
                    )}
                    <AvatarFallback className="bg-red-600/20 text-red-600 text-3xl">
                      {user?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl mb-2 text-white">{user?.name || '사용자'}</h2>
                  <p className="text-sm text-gray-400">{user?.email || ''}</p>
                </div>

                <Separator className="bg-red-900/50 mb-6" />

                {/* Info */}
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span className="text-gray-500">가입일:</span>
                    <span className="text-white ml-auto">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</span>
                  </div>
                </div>

                <Separator className="bg-red-900/50 mb-6" />

                {/* Action Buttons */}
                <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
                  setIsEditDialogOpen(open);
                  if (!open && user) {
                    // 다이얼로그 닫을 때 편집 상태 초기화
                    setEditName(user.name || '');
                    setEditProfileImage(user.profileImage || '');
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <Edit className="w-4 h-4 mr-2" />
                      프로필 수정
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black border-2 border-red-600/50 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl">프로필 수정</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        프로필 정보를 수정할 수 있습니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="edit-name" className="text-gray-300">이름</Label>
                        <Input 
                          id="edit-name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="이름을 입력하세요"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-profile-image" className="text-gray-300">프로필 이미지</Label>
                        <Input 
                          id="edit-profile-image"
                          type="file"
                          accept="image/*"
                          className="bg-gray-900 border-red-900/50 text-white mt-2"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setUploadingProfileImage(true);
                                const url = await uploadImageToS3(file, 'profiles');
                                setEditProfileImage(url);
                              } catch (err) {
                                alert((err as Error)?.message || '이미지 업로드에 실패했습니다.');
                              } finally {
                                setUploadingProfileImage(false);
                              }
                            }
                          }}
                          disabled={uploadingProfileImage}
                        />
                        {uploadingProfileImage && (
                          <p className="text-sm text-gray-400 mt-1">업로드 중...</p>
                        )}
                        {editProfileImage && !uploadingProfileImage && (
                          <div className="mt-2">
                            <p className="text-sm text-green-400 mb-2">✓ 업로드 완료</p>
                            <ImageWithFallback
                              src={editProfileImage}
                              alt="프로필 미리보기"
                              className="w-24 h-24 rounded-full object-cover border-2 border-red-600/50"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button 
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleUpdateProfile}
                        >
                          수정 완료
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-red-900/50 text-gray-400 hover:text-white"
                          onClick={() => setIsEditDialogOpen(false)}
                        >
                          취소
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Watch History */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-black border border-red-900/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-white">관람 기록</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Film className="w-4 h-4 text-red-600" />
                    <span>총 {recentMovies.length}편 관람</span>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-gray-400">로딩 중...</div>
                ) : recentMovies.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">관람 기록이 없습니다.</div>
                ) : (
                  <div className="space-y-4">
                    {recentMovies.map((record, index) => {
                      const movieTitle = record.movie?.title || record.movie_title || '영화 제목';
                      const movieImage = record.movie?.movie_image || record.movie_image || posterFallback;
                      return (
                      <div key={record.record_id || index}>
                        <div className="flex gap-4">
                          {/* Poster */}
                          <div className="w-20 h-28 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-red-900/30">
                            <ImageWithFallback
                              src={movieImage}
                              alt={movieTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h4 className="text-white mb-2">{movieTitle}</h4>
                            <div className="space-y-1 text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-red-600" />
                                <span>{record.viewing_date || record.view_date || '-'}</span>
                              </div>
                              {record.theater_name && (
                                <div className="flex items-center gap-2">
                                  <Film className="w-3.5 h-3.5 text-red-600" />
                                  <span>{record.theater_name}</span>
                                </div>
                              )}
                              {record.rating && (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                      key={i}
                                      className={i < Math.round(record.rating) ? 'text-red-600' : 'text-gray-700'}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {index < recentMovies.length - 1 && (
                          <Separator className="bg-red-900/50 my-4" />
                        )}
                      </div>
                      );
                    })}
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-red-900/50 text-gray-400 hover:text-white hover:border-red-600/50"
                  onClick={onNavigateToWatchHistory}
                >
                  전체 관람 기록 보기
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
