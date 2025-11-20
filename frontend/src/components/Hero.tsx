import { motion } from 'motion/react';
import { Film, Trophy, Users, TrendingUp, Ticket, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface HeroProps {
  onNavigate: (view: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const features = [
    {
      icon: Film,
      title: '영화 관람 기록',
      description: '관람한 영화와 감상을 기록하고 관리하세요',
      color: 'from-red-600 to-rose-600'
    },
    {
      icon: Trophy,
      title: '특전 도감',
      description: '주차별 특전을 수집하고 수집률을 확인하세요',
      color: 'from-amber-600 to-yellow-600'
    },
    {
      icon: Users,
      title: '특전 교환',
      description: '중복된 특전을 다른 수집가와 교환하세요',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: TrendingUp,
      title: '실시간 재고',
      description: '극장별 특전 재고를 실시간으로 확인하세요',
      color: 'from-purple-600 to-pink-600'
    }
  ];

  const stats = [
    { label: '등록된 영화', value: '1,234', icon: Film },
    { label: '총 특전 수', value: '5,678', icon: Ticket },
    { label: '활성 사용자', value: '12,345', icon: Users },
    { label: '교환 완료', value: '3,456', icon: Star },
  ];

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
            <div className="inline-block mb-6 px-6 py-2 bg-red-600/20 border border-red-600/50 rounded-full">
              <span className="text-red-400 tracking-wider">DATABASE PROGRAMMING PROJECT</span>
            </div>
            
            <h1 className="mb-6 text-5xl md:text-7xl tracking-tight">
              CINE<span className="text-red-600">COLLECTOR</span>
            </h1>
            
            <p className="mb-4 text-xl md:text-2xl text-gray-300">
              영화 특전 수집의 모든 것
            </p>
            
            <p className="mb-12 text-gray-400 max-w-2xl mx-auto">
              영화 관람 기록부터 한정 특전 수집, 교환까지<br />
              CineCollector에서 당신만의 컬렉션을 완성하세요
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <Button
                size="lg"
                onClick={() => onNavigate('collection')}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6"
              >
                <Trophy className="w-5 h-5 mr-2" />
                컬렉션 시작하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('exchange')}
                className="border-red-600 text-red-600 hover:bg-red-600/10 px-8 py-6"
              >
                <Users className="w-5 h-5 mr-2" />
                특전 교환하기
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-lg p-6 backdrop-blur-sm"
                >
                  <Icon className="w-6 h-6 text-red-600 mb-2 mx-auto" />
                  <div className="text-2xl md:text-3xl mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl md:text-4xl">주요 기능</h2>
            <p className="text-gray-400">CineCollector가 제공하는 핵심 서비스</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border-red-900/30 p-6 h-full hover:border-red-600/50 transition-all group">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity`} />
                    <div className="relative">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-r from-red-950/50 to-rose-950/50 border-red-900/50 p-12 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
            <div className="relative">
              <Ticket className="w-16 h-16 text-red-600 mx-auto mb-6" />
              <h2 className="mb-4 text-3xl">지금 시작하세요</h2>
              <p className="mb-8 text-gray-300">
                CineCollector와 함께 당신만의 특별한 영화 컬렉션을 만들어보세요
              </p>
              <Button
                size="lg"
                onClick={() => onNavigate('profile')}
                className="bg-red-600 hover:bg-red-700 text-white px-8"
              >
                회원가입하기
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
