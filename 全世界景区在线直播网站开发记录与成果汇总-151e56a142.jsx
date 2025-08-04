import React, { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { 
  MapPin, 
  Headphones, 
  Cloud, 
  Globe, 
  Search, 
  Star, 
  ChevronRight,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScenicLiveWebsite = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedScenic, setSelectedScenic] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mapContainerRef = useRef(null);
  const mapSDK = useRef();
  const mapInstance = useRef();

  // 景区数据
  const scenicSpots = [
    {
      id: 1,
      name: '美国大峡谷',
      location: '美国',
      liveUrl: 'https://v.qq.com/x/cover/mzc003lxo9xui9l/p3538oyruut.html',
      description: '世界自然遗产，科罗拉多河切割形成的壮丽峡谷景观',
      weather: '晴, 25℃',
      address: '美国亚利桑那州',
      panoramaUrl: 'https://airpano.org.cn/360video/video-grand-canyon/',
      audioGuide: 'https://example.com/audio/grand-canyon.mp3',
      coordinates: [112.23, 36.06]
    },
    {
      id: 2,
      name: '澳大利亚大堡礁',
      location: '澳大利亚',
      liveUrl: 'https://www.acfun.cn/v/ac3423898_1',
      description: '世界最大最长的珊瑚礁群，世界七大自然景观之一',
      weather: '多云, 28℃',
      address: '澳大利亚昆士兰州',
      panoramaUrl: 'https://airpano.org.cn/360video/video-great-barrier-reef/',
      audioGuide: 'https://example.com/audio/barrier-reef.mp3',
      coordinates: [146.26, -18.28]
    },
    {
      id: 3,
      name: '中国黄山风景区',
      location: '中国',
      liveUrl: 'https://www.huangshan1.com/live',
      description: '以奇松、怪石、云海、温泉、冬雪五绝著称的世界遗产',
      weather: '小雨, 24℃',
      address: '安徽省黄山市汤口镇',
      panoramaUrl: '',
      audioGuide: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/0aebeccb319c429bb34e8511a81ca911.mp3',
      coordinates: [118.17, 30.13]
    },
    {
      id: 4,
      name: '中国九寨沟',
      location: '中国',
      liveUrl: 'https://www.jiuzhai.com/zhuanti/cloud/index.html',
      description: '以翠海、叠瀑、彩林、雪峰、藏情、蓝冰六绝著称',
      weather: '小雨, 21℃',
      address: '四川省阿坝藏族羌族自治州',
      panoramaUrl: '',
      audioGuide: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/6a354cc087ee4be5945aa557e4cbc07f.mp3',
      coordinates: [103.92, 33.17]
    },
    {
      id: 5,
      name: '中国故宫博物院',
      location: '中国',
      liveUrl: 'https://www.dpm.org.cn/liveBroadcast.html',
      description: '世界现存规模最大、保存最完整的木质结构古建筑群',
      weather: '晴, 22℃',
      address: '北京市东城区景山前街4号',
      panoramaUrl: '',
      audioGuide: 'https://example.com/audio/forbidden-city.mp3',
      coordinates: [116.40, 39.92]
    }
  ];

  // 初始化地图
  useEffect(() => {
    AMapLoader.load({
      key: 'd17c17f8f712c81a7e4241aff4faa7b0',
      plugins: ['AMap.Scale', 'AMap.MarkerClusterer']
    }).then(AMap => {
      mapSDK.current = AMap;
      const map = new AMap.Map(mapContainerRef.current, {
        viewMode: '3D',
        zoom: 3,
        center: [116.40, 39.92],
        mapStyle: 'amap://styles/darkblue'
      });
      mapInstance.current = map;

      // 添加景区标记
      scenicSpots.forEach(spot => {
        if (spot?.coordinates?.length === 2) {
          const marker = new AMap.Marker({
            position: new AMap.LngLat(spot.coordinates[0], spot.coordinates[1]),
            title: spot.name,
            content: `<div class="custom-marker">
              <div class="marker-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="marker-pulse"></div>
            </div>`
          });

          marker.on('click', () => {
            setSelectedScenic(spot);
            setActiveTab('detail');
          });

          map.add(marker);
        }
      });

      // 添加比例尺
      map.addControl(new AMap.Scale());
    }).catch(e => {
      console.error('地图加载失败:', e);
    });

    return () => {
      mapInstance.current?.destroy();
    };
  }, []);

  const renderHome = () => (
    <div className="space-y-8">
      {/* 地图区域 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[500px] rounded-xl overflow-hidden shadow-xl"
      >
        <div ref={mapContainerRef} className="w-full h-full"></div>
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <Globe className="inline mr-2" size={20} />
          <span>全球景区分布</span>
        </div>
      </motion.div>

      {/* 热门景区 */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Star className="mr-2 text-yellow-500" size={24} />
          热门景区直播
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenicSpots.slice(0, 3).map(spot => (
            <motion.div
              key={spot.id}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-900/80 to-blue-700/80 rounded-xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => {
                setSelectedScenic(spot);
                setActiveTab('detail');
              }}
            >
              <div className="relative h-48">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-xl font-bold text-white">{spot.name}</h3>
                  <div className="flex items-center text-white/80">
                    <MapPin className="mr-1" size={16} />
                    <span>{spot.location}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-2 py-1 rounded-full text-sm flex items-center">
                  <Play className="mr-1" size={14} />
                  <span>直播中</span>
                </div>
                <img 
                  src={`/api/coze_space/text2image?prompt=${encodeURIComponent(`"${spot.name}" 景区风景照`)}&width=512&height=512`} 
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-white">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Cloud className="mr-1" size={16} />
                    <span>{spot.weather}</span>
                  </div>
                  <button className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                    立即观看
                  </button>
                </div>
                <p className="text-sm text-white/80 line-clamp-2">{spot.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 全部景区 */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <MapPin className="mr-2 text-blue-500" size={24} />
            全部景区
          </h2>
          <button className="text-blue-400 hover:text-blue-300 flex items-center">
            查看全部 <ChevronRight size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {scenicSpots.map(spot => (
            <motion.div
              key={spot.id}
              whileHover={{ x: 5 }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-colors"
              onClick={() => {
                setSelectedScenic(spot);
                setActiveTab('detail');
              }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-900/50 flex items-center justify-center">
                  <MapPin className="text-blue-300" size={20} />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-white">{spot.name}</h3>
                  <div className="flex items-center text-sm text-white/60 mt-1">
                    <span className="mr-3">{spot.location}</span>
                    <span className="flex items-center">
                      <Cloud className="mr-1" size={14} />
                      {spot.weather}
                    </span>
                  </div>
                </div>
                <div className="text-blue-400">
                  <ChevronRight size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedScenic) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* 返回按钮 */}
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center text-blue-400 hover:text-blue-300"
        >
          <ChevronRight className="rotate-180 mr-1" size={18} />
          返回
        </button>

        {/* 景区标题 */}
        <div>
          <h1 className="text-3xl font-bold text-white">{selectedScenic.name}</h1>
          <div className="flex items-center mt-2 text-white/80">
            <MapPin className="mr-1" size={16} />
            <span>{selectedScenic.address}</span>
            <span className="mx-2">•</span>
            <Cloud className="mr-1" size={16} />
            <span>{selectedScenic.weather}</span>
          </div>
        </div>

        {/* 直播区域 */}
        <div className="bg-black/30 rounded-xl overflow-hidden shadow-xl">
          <div className="relative pt-[56.25%]">
            <iframe
              src={selectedScenic.liveUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen"
            ></iframe>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full flex items-center">
                <Play className="mr-2" size={16} />
                <span>观看直播</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full flex items-center">
                <Headphones className="mr-2" size={16} />
                <span>语音导览</span>
              </button>
            </div>
          </div>
        </div>

        {/* 景区介绍 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-white">景区介绍</h2>
          <p className="text-white/80 leading-relaxed">{selectedScenic.description}</p>
        </div>

        {/* 天气信息 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-white">天气信息</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-900/30 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-300 mb-1">今日天气</div>
              <div className="text-2xl font-bold text-white">{selectedScenic.weather.split(',')[0]}</div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-300 mb-1">当前温度</div>
              <div className="text-2xl font-bold text-white">{selectedScenic.weather.split(',')[1]}</div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-300 mb-1">适宜度</div>
              <div className="text-2xl font-bold text-white">适宜</div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-300 mb-1">紫外线</div>
              <div className="text-2xl font-bold text-white">中等</div>
            </div>
          </div>
        </div>

        {/* 360°全景 */}
        {selectedScenic.panoramaUrl && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white">360°全景体验</h2>
            <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
              <iframe
                src={selectedScenic.panoramaUrl}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Globe className="text-blue-400 mr-2" size={24} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              全球景区直播
            </h1>
          </div>
          
          {/* 桌面导航 */}
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => setActiveTab('home')}
              className={`${activeTab === 'home' ? 'text-blue-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              首页
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`${activeTab === 'list' ? 'text-blue-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              景区列表
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`${activeTab === 'favorites' ? 'text-blue-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              我的收藏
            </button>
          </div>

          {/* 搜索框 */}
          <div className="hidden md:flex items-center bg-white/10 rounded-full px-4 py-2 w-64">
            <Search className="text-white/50 mr-2" size={18} />
            <input 
              type="text" 
              placeholder="搜索景区..." 
              className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full"
            />
          </div>

          {/* 移动菜单按钮 */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* 移动菜单 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-3 space-y-3 border-t border-white/10">
                <button 
                  onClick={() => {
                    setActiveTab('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 ${activeTab === 'home' ? 'text-blue-400' : 'text-white'}`}
                >
                  首页
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('list');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 ${activeTab === 'list' ? 'text-blue-400' : 'text-white'}`}
                >
                  景区列表
                </button>
                <button 
                  onClick={() => {
                    setActiveTab('favorites');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 ${activeTab === 'favorites' ? 'text-blue-400' : 'text-white'}`}
                >
                  我的收藏
                </button>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2 mt-2">
                  <Search className="text-white/50 mr-2" size={18} />
                  <input 
                    type="text" 
                    placeholder="搜索景区..." 
                    className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'detail' && renderDetail()}
      </main>

      {/* 页脚 */}
      <footer className="bg-black/50 border-t border-white/10 py-6">
        <div className="container mx-auto px-4 text-center text-white/50 text-sm">
          <p>
            created by <a href="https://space.coze.cn" className="text-blue-400 hover:text-blue-300">coze space</a> | 页面内容均由 AI 生成，仅供参考
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ScenicLiveWebsite;