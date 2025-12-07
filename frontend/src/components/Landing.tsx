import { motion } from 'motion/react';
import { Film, Trophy, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LandingProps {
  onLogin?: () => void;
}

export function Landing({ onLogin }: LandingProps) {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, signup } = useAuth();

  const resetSignUpFields = () => {
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpPasswordConfirm('');
  };

  const resetLoginFields = () => {
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (signUpPassword !== signUpPasswordConfirm) {
      setAuthError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      setSignUpLoading(true);
      await signup(signUpName.trim(), signUpEmail.trim(), signUpPassword);
      resetSignUpFields();
      setShowSignUp(false);
      onLogin?.();
    } catch (error) {
      setAuthError((error as Error)?.message ?? '회원가입에 실패했습니다.');
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      setLoginLoading(true);
      await login(loginEmail.trim(), loginPassword);
      resetLoginFields();
      setShowLogin(false);
      onLogin?.();
    } catch (error) {
      setAuthError((error as Error)?.message ?? '로그인에 실패했습니다.');
    } finally {
      setLoginLoading(false);
    }
  };

  const features = [
    {
      icon: Film,
      title: '영화 관람 기록',
      description: '관람한 영화와 감상을 기록하고 관리하세요',
      image: 'https://images.unsplash.com/photo-1592780828756-c418d71faa1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MjI0MzczOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      icon: Trophy,
      title: '특전 도감',
      description: '주차별 특전을 수집하고 수집률을 확인하세요',
      image: 'https://images.unsplash.com/photo-1759446334429-bb1f2d1d9f13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBhd2FyZCUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzYyMjQzNzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      icon: TrendingUp,
      title: '실시간 재고',
      description: '극장별 특전 재고를 실시간으로 확인하세요',
      image: 'https://images.unsplash.com/photo-1721937127582-ed331de95a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZlbnRvcnklMjBzdG9jayUyMHNoZWx2ZXN8ZW58MXx8fHwxNzYyMjQzNzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    }
  ];

  const movieImages = [
    'https://images.unsplash.com/photo-1753944847480-92f369a5f00e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlciUyMGNpbmVtYXxlbnwxfHx8fDE3NjIxOTE3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1661343320593-127da7a9cc13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcmVlbCUyMHZpbnRhZ2V8ZW58MXx8fHwxNzYyMTUzMDk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1680979339679-a5e1a509218f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjB0aGVhdGVyJTIwcmVkfGVufDF8fHx8MTc2MjIzMDEyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1583608840477-694d63381083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMGNvbGxlY3Rpb24lMjBkdmR8ZW58MXx8fHwxNzYyMjMwMTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1661923782712-44dfa0a7024c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwY2FtZXJhJTIwdmludGFnZXxlbnwxfHx8fDE3NjIyMDY0OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1707061803305-58383ee49415?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRpY2tldHMlMjBwb3Bjb3JufGVufDF8fHx8MTc2MjIzMDEyNXww&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...movieImages, ...movieImages];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Ticket Pattern Background */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(239, 68, 68, 0.3) 50px,
              rgba(239, 68, 68, 0.3) 51px
            )`
          }} />
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 50px,
              rgba(239, 68, 68, 0.3) 50px,
              rgba(239, 68, 68, 0.3) 51px
            )`
          }} />
        </div>

        {/* Red Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-6 text-5xl md:text-7xl tracking-tight font-black">
              CINE<span className="text-red-600">COLLECTOR</span>
            </h1>
            
            <p className="mb-4 text-xl md:text-3xl text-gray-200 font-bold">
              영화 특전 수집의 모든 것
            </p>
            
            <p className="mb-8 text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
              영화 관람 기록부터 한정 특전 수집, 교환까지<br />
              CineCollector에서 당신만의 컬렉션을 완성하세요
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <Button
                size="lg"
                onClick={() => setShowSignUp(true)}
                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                회원가입
              </Button>
              <Button
                size="lg"
                onClick={() => setShowLogin(true)}
                variant="outline"
                className="bg-white hover:bg-gray-100 text-gray-900 border-white px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                로그인
              </Button>
            </div>
          </motion.div>

          {/* Movie Images Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full overflow-hidden max-w-5xl mx-auto"
          >
            <div className="relative h-64 md:h-80">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
              
              {/* Scrolling Container */}
              <motion.div
                className="flex gap-6 h-full"
                animate={{
                  x: [0, -1800],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
                whileHover={{ animationPlayState: 'paused' }}
                style={{ willChange: 'transform' }}
              >
                {duplicatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-48 md:w-56 h-full rounded-lg overflow-hidden border-2 border-red-900/30 hover:border-red-600/50 transition-all shadow-lg"
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Movie ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {/* Divider Line */}
                <div className="w-full h-px bg-red-600/30 mb-16" />
                
                <div className="space-y-8">
                  {/* Label */}
                  <div className="text-red-600 text-sm tracking-wider uppercase">
                    FEATURE {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl text-white font-extrabold">
                    {feature.title}
                  </h3>
                  
                  {/* Image Area */}
                  <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden max-w-2xl mx-auto">
                    <div className="aspect-video">
                      <ImageWithFallback
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-lg text-gray-400 leading-relaxed text-center">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Decorative Line */}
            <div className="w-24 h-px bg-red-600 mx-auto mb-12" />
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
              지금 바로 시작하세요
            </h2>
            
            <p className="text-gray-400 mb-12 max-w-xl mx-auto">
              CineCollector와 함께 당신만의 영화 특전 컬렉션을<br />
              체계적으로 관리하고 공유해보세요
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setShowSignUp(true)}
                className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                회원가입
              </Button>
              <Button
                size="lg"
                onClick={() => setShowLogin(true)}
                variant="outline"
                className="bg-white hover:bg-gray-100 text-gray-900 border-white px-10 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                로그인
              </Button>
            </div>
            
            {/* Decorative Line */}
            <div className="w-24 h-px bg-red-600 mx-auto mt-12" />
          </motion.div>
        </div>
      </div>

      {/* SignUp Dialog */}
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>회원가입</DialogTitle>
            <DialogDescription>CineCollector에 가입하세요</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignUp}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  type="text"
                  className="col-span-3"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="col-span-3"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="passwordConfirm" className="text-right">
                  비밀번호 확인
                </Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  className="col-span-3"
                  value={signUpPasswordConfirm}
                  onChange={(e) => setSignUpPasswordConfirm(e.target.value)}
                />
              </div>
            </div>
            {authError && (
              <p className="text-sm text-red-500 mt-2 text-center">{authError}</p>
            )}
            <Button type="submit" className="w-full">
              {signUpLoading ? '회원가입 중...' : '회원가입'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={(open) => {
        setShowLogin(open);
        if (open) {
          resetLoginFields();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>로그인</DialogTitle>
            <DialogDescription>CineCollector에 로그인하세요</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="col-span-3"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </div>
            {authError && (
              <p className="text-sm text-red-500 mt-2 text-center">{authError}</p>
            )}
            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}