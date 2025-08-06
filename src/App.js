import React, { useState, useEffect, useRef } from 'react';
import { Globe, MapPin, Headphones, Cloud, Search, Menu, X, Star, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './hooks/useLanguage';
import LanguageSwitcher from './components/LanguageSwitcher';
import LiveStreamViewer from './components/LiveStreamViewer';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedScenic, setSelectedScenic] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const { language, changeLanguage, t } = useLanguage();

  const getScenicSpots = () => {
    return [
      {
        id: 1,
        name: t('scenicSpots.1.name'),
        location: t('scenicSpots.1.location'),
        coordinates: [-112.1, 36.1],
        address: t('scenicSpots.1.address'),
        description: t('scenicSpots.1.description'),
        liveUrl: 'https://v.qq.com/x/cover/mzc003lxo9xui9l/p3538oyruut.html',
        audioUrl: '',
        weather: `${t('sunny')}, 25℃`,
        panoramaUrl: 'https://airpano.org.cn/360video/video-grand-canyon/',
        highlights: t('scenicSpots.1.highlights')
      },
      {
        id: 2,
        name: t('scenicSpots.2.name'),
        location: t('scenicSpots.2.location'),
        coordinates: [146.26, -18.28],
        address: t('scenicSpots.2.address'),
        description: t('scenicSpots.2.description'),
        liveUrl: 'https://www.acfun.cn/v/ac3423898_1',
        audioUrl: '',
        weather: `${t('cloudy')}, 28℃`,
        panoramaUrl: 'https://airpano.org.cn/360video/video-great-barrier-reef/',
        highlights: t('scenicSpots.2.highlights')
      },
      {
        id: 3,
        name: t('scenicSpots.3.name'),
        location: t('scenicSpots.3.location'),
        coordinates: [118.17, 30.13],
        address: t('scenicSpots.3.address'),
        description: t('scenicSpots.3.description'),
        liveUrl: 'https://www.huangshan1.com/live',
        audioUrl: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/0aebeccb319c429bb34e8511a81ca911.mp3',
        weather: `${t('rainy')}, 24℃`,
        panoramaUrl: '',
        highlights: t('scenicSpots.3.highlights')
      },
      {
        id: 4,
        name: t('scenicSpots.4.name'),
        location: t('scenicSpots.4.location'),
        coordinates: [103.92, 33.17],
        address: t('scenicSpots.4.address'),
        description: t('scenicSpots.4.description'),
        liveUrl: 'https://www.jiuzhai.com/zhuanti/cloud/index.html',
        audioUrl: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/6a354cc087ee4be5945aa557e4cbc07f.mp3',
        weather: `${t('rainy')}, 21℃`,
        panoramaUrl: '',
        highlights: t('scenicSpots.4.highlights')
      },
      {
        id: 5,
        name: t('scenicSpots.5.name'),
        location: t('scenicSpots.5.location'),
        coordinates: [116.40, 39.92],
        address: t('scenicSpots.5.address'),
        description: t('scenicSpots.5.description'),
        liveUrl: 'https://www.dpm.org.cn/liveBroadcast.html',
        audioUrl: '',
        weather: `${t('sunny')}, 22℃`,
        panoramaUrl: '',
        highlights: t('scenicSpots.5.highlights')
      }
    ];
  };

  const scenicSpots = getScenicSpots();
  useEffect(() => {
    // 动态加载高德地图API
    const loadAMapScript = () => {
      return new Promise((resolve, reject) => {
        if (window.AMap) {
          resolve(window.AMap);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=d17c17f8f712c81a7e4241aff4faa7b0';
        script.onload = () => resolve(window.AMap);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadAMapScript().then(AMap => {
      if (mapContainerRef.current) {
        mapInstance.current = new AMap.Map(mapContainerRef.current, {
          viewMode: '3D',
          zoom: 3,
          center: [116.40, 39.92],
          mapStyle: 'amap://styles/darkblue'
        });

        // 添加景区标记
        scenicSpots.forEach(spot => {
          if (spot?.coordinates?.length === 2) {
            const marker = new AMap.Marker({
              position: new AMap.LngLat(spot.coordinates[0], spot.coordinates[1]),
              title: spot.name,
              content: `<div style="background-color:#3b82f6;color:white;padding:4px 8px;border-radius:6px;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${spot.name}</div>`
            });

            marker.on('click', () => {
              setSelectedScenic(spot);
              setActiveTab('detail');
            });

            mapInstance.current.add(marker);
          }
        });

        // 添加比例尺
        mapInstance.current.addControl(new AMap.Scale());
      }
    }).catch(e => {
      console.error('地图加载失败:', e);
    });

    return () => {
      mapInstance.current?.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScenicSelect = (scenic) => {
    setSelectedScenic(scenic);
    setActiveTab('detail');
    if (mapInstance.current && scenic.coordinates) {
      mapInstance.current.setCenter([scenic.coordinates[0], scenic.coordinates[1]]);
      mapInstance.current.setZoom(12);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Globe className="text-blue-400 mr-2" size={24} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t('title')}
            </h1>
          </div>

          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`${activeTab === 'home' ? 'text-blue-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              {t('home')}
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`${activeTab === 'list' ? 'text-blue-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              {t('list')}
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`${activeTab === 'popular' ? 'text-blue-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              {t('popular')}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`${activeTab === 'about' ? 'text-blue-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              {t('about')}
            </button>
          </div>

          {/* 搜索框和语言切换 */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-white/10 rounded-full px-4 py-2 w-64">
              <Search className="text-white/50 mr-2" size={18} />
              <input
                type="text"
                placeholder={t('search')}
                className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full"
              />
            </div>
            <LanguageSwitcher language={language} onLanguageChange={changeLanguage} />
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

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
                  onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left py-2 ${activeTab === 'home' ? 'text-blue-400' : 'text-white'}`}
                >
                  {t('home')}
                </button>
                <button
                  onClick={() => { setActiveTab('list'); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left py-2 ${activeTab === 'list' ? 'text-blue-400' : 'text-white'}`}
                >
                  {t('list')}
                </button>
                <button
                  onClick={() => { setActiveTab('popular'); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left py-2 ${activeTab === 'popular' ? 'text-blue-400' : 'text-white'}`}
                >
                  {t('popular')}
                </button>
                <button
                  onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left py-2 ${activeTab === 'about' ? 'text-blue-400' : 'text-white'}`}
                >
                  {t('about')}
                </button>
                <div className="flex items-center bg-white/10 rounded-full px-4 py-2 mt-2">
                  <Search className="text-white/50 mr-2" size={18} />
                  <input
                    type="text"
                    placeholder={t('search')}
                    className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full"
                  />
                </div>
                <div className="pt-2">
                  <LanguageSwitcher language={language} onLanguageChange={changeLanguage} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
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
                <span>{t('globalDistribution')}</span>
              </div>
            </motion.div>

            {/* 热门景区 */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Star className="mr-2 text-yellow-500" size={24} />
                {t('popularScenic')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenicSpots.slice(0, 3).map(spot => (
                  <motion.div
                    key={spot.id}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-blue-900/80 to-blue-700/80 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                    onClick={() => handleScenicSelect(spot)}
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
                        <span>{t('live')}</span>
                      </div>
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold opacity-20">{spot.name}</span>
                      </div>
                    </div>
                    <div className="p-4 text-white">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Cloud className="mr-1" size={16} />
                          <span>{spot.weather}</span>
                        </div>
                        <button className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
                          {t('watchNow')}
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
                  {t('allScenic')}
                </h2>
                <button
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                  onClick={() => setActiveTab('list')}
                >
                  {t('viewAll')} <ChevronRight size={18} />
                </button>
              </div>
              <div className="space-y-4">
                {scenicSpots.map(spot => (
                  <motion.div
                    key={spot.id}
                    whileHover={{ x: 5 }}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-colors"
                    onClick={() => handleScenicSelect(spot)}
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
        )}

        {activeTab === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{t('list')}</h2>
              </div>
              <div className="divide-y divide-white/10">
                {scenicSpots.map(scenic => (
                  <div
                    key={scenic.id}
                    className="p-4 hover:bg-white/10 cursor-pointer transition-colors"
                    onClick={() => handleScenicSelect(scenic)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md overflow-hidden mr-4 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{scenic.name}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{scenic.name}</h3>
                        <p className="text-sm text-white/60 mb-1">{scenic.address}</p>
                        <p className="text-sm text-white/80 line-clamp-2">{scenic.description}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="flex items-center text-sm text-white/80">
                          <Cloud className="mr-1" size={16} />
                          <span>{scenic.weather}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'detail' && selectedScenic && (
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
              {t('back')}
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
              <LiveStreamViewer 
                liveUrl={selectedScenic.liveUrl}
                scenicName={selectedScenic.name}
                language={language}
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full flex items-center text-white">
                    <Play className="mr-2" size={16} />
                    <span>{t('watchLive')}</span>
                  </button>
                  {selectedScenic.audioUrl && (
                    <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full flex items-center text-white">
                      <Headphones className="mr-2" size={16} />
                      <span>{t('audioGuide')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 景区介绍 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-white">{t('scenicIntro')}</h2>
              <p className="text-white/80 leading-relaxed mb-4">{selectedScenic.description}</p>
              <h3 className="text-lg font-semibold mb-3 text-white">{t('highlights')}</h3>
              <ul className="space-y-2">
                {selectedScenic.highlights.map((item, i) => (
                  <li key={i} className="text-white/80 flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* 天气信息 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-white">{t('weatherInfo')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-900/30 rounded-lg p-4 text-center">
                  <div className="text-sm text-blue-300 mb-1">{t('todayWeather')}</div>
                  <div className="text-2xl font-bold text-white">{selectedScenic.weather.split(',')[0]}</div>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4 text-center">
                  <div className="text-sm text-blue-300 mb-1">{t('currentTemp')}</div>
                  <div className="text-2xl font-bold text-white">{selectedScenic.weather.split(',')[1]}</div>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4 text-center">
                  <div className="text-sm text-blue-300 mb-1">{t('suitability')}</div>
                  <div className="text-2xl font-bold text-white">{t('suitable')}</div>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4 text-center">
                  <div className="text-sm text-blue-300 mb-1">{t('uvIndex')}</div>
                  <div className="text-2xl font-bold text-white">{t('moderate')}</div>
                </div>
              </div>
            </div>

            {/* 360°全景 */}
            {selectedScenic.panoramaUrl && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-white">{t('panorama360')}</h2>
                <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
                  <iframe
                    src={selectedScenic.panoramaUrl}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    title={`${selectedScenic.name}全景`}
                  ></iframe>
                </div>
              </div>
            )}

            {/* 语音介绍 */}
            {selectedScenic.audioUrl && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                  <Headphones className="mr-2" size={20} />
                  {t('audioGuide')}
                </h2>
                <audio controls className="w-full">
                  <source src={selectedScenic.audioUrl} type="audio/mpeg" />
                  {t('browserNotSupported')}
                </audio>
              </div>
            )}
          </motion.div>
        )}
        {activeTab === 'popular' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">{t('popular')}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {scenicSpots.map(scenic => (
                  <motion.div
                    key={scenic.id}
                    whileHover={{ y: -5 }}
                    className="border border-white/20 rounded-lg overflow-hidden cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                    onClick={() => handleScenicSelect(scenic)}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <h3 className="text-white font-bold text-xl">{scenic.name}</h3>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                        <div>
                          <p className="text-white/80 text-sm">{scenic.address}</p>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                        {t('live')}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/80 flex items-center">
                          <Cloud className="mr-1" size={14} />
                          {scenic.weather}
                        </span>
                        <button className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-full text-white transition-colors">
                          {t('watchNow')}
                        </button>
                      </div>
                      <p className="text-white/70 line-clamp-2">{scenic.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">{t('aboutTitle')}</h2>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-white">{t('websiteIntro')}</h3>
              <p className="text-white/80 mb-4">
                {t('websiteDesc1')}
              </p>
              <p className="text-white/80">
                {t('websiteDesc2')}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-white">{t('techFeatures')}</h3>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {t('feature1')}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {t('feature2')}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {t('feature3')}
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {t('feature4')}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-white">{t('contactUs')}</h3>
              <p className="text-white/80 mb-2">{t('contactDesc')}</p>
              <p className="text-white/80">{t('email')}</p>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="bg-black/50 border-t border-white/10 py-6">
        <div className="container mx-auto px-4 text-center text-white/50 text-sm">
          <p>
            created by <a href="https://space.coze.cn" className="text-blue-400 hover:text-blue-300">coze space</a> | {t('footerText')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;