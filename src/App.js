import React, { useState, useEffect, useRef } from 'react';
import { Globe, MapPin, Headphones, Cloud, Search, Menu, X, Star, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedScenic, setSelectedScenic] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);

  const scenicSpots = [
    {
      id: 1,
      name: '美国大峡谷',
      location: '美国',
      coordinates: [-112.1, 36.1],
      address: '美国亚利桑那州',
      description: '世界自然遗产，科罗拉多河切割形成的壮丽峡谷景观',
      liveUrl: 'https://v.qq.com/x/cover/mzc003lxo9xui9l/p3538oyruut.html',
      audioUrl: '',
      weather: '晴, 25℃',
      panoramaUrl: 'https://airpano.org.cn/360video/video-grand-canyon/',
      highlights: [
        '南缘：最受欢迎的观景点',
        '玻璃天空步道：悬空观景平台',
        '科罗拉多河漂流：独特体验'
      ]
    },
    {
      id: 2,
      name: '澳大利亚大堡礁',
      location: '澳大利亚',
      coordinates: [146.26, -18.28],
      address: '澳大利亚昆士兰州',
      description: '世界最大最长的珊瑚礁群，世界七大自然景观之一',
      liveUrl: 'https://www.acfun.cn/v/ac3423898_1',
      audioUrl: '',
      weather: '多云, 28℃',
      panoramaUrl: 'https://airpano.org.cn/360video/video-great-barrier-reef/',
      highlights: [
        '心形礁：最著名的珊瑚礁景观',
        '白天堂海滩：世界最美海滩之一',
        '海洋生物：丰富的海洋生态系统'
      ]
    },
    {
      id: 3,
      name: '中国黄山风景区',
      location: '中国',
      coordinates: [118.17, 30.13],
      address: '安徽省黄山市汤口镇',
      description: '以奇松、怪石、云海、温泉、冬雪五绝著称的世界遗产',
      liveUrl: 'https://www.huangshan1.com/live',
      audioUrl: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/0aebeccb319c429bb34e8511a81ca911.mp3',
      weather: '小雨, 24℃',
      panoramaUrl: '',
      highlights: [
        '迎客松：黄山标志性景观',
        '光明顶：黄山第二高峰',
        '飞来石：神奇的巨石景观'
      ]
    },
    {
      id: 4,
      name: '中国九寨沟',
      location: '中国',
      coordinates: [103.92, 33.17],
      address: '四川省阿坝藏族羌族自治州',
      description: '以翠海、叠瀑、彩林、雪峰、藏情、蓝冰六绝著称',
      liveUrl: 'https://www.jiuzhai.com/zhuanti/cloud/index.html',
      audioUrl: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/6a354cc087ee4be5945aa557e4cbc07f.mp3',
      weather: '小雨, 21℃',
      panoramaUrl: '',
      highlights: [
        '五花海：九寨沟C位景点，碧绿湖水犹如碧玉',
        '珍珠滩瀑布：86版《西游记》取景地',
        '镜海：清晨如天空之镜般的梦幻景象'
      ]
    },
    {
      id: 5,
      name: '中国故宫博物院',
      location: '中国',
      coordinates: [116.40, 39.92],
      address: '北京市东城区景山前街4号',
      description: '世界现存规模最大、保存最完整的木质结构古建筑群',
      liveUrl: 'https://www.dpm.org.cn/liveBroadcast.html',
      audioUrl: '',
      weather: '晴, 22℃',
      panoramaUrl: '',
      highlights: [
        '太和殿：紫禁城最重要的宫殿',
        '御花园：皇家园林艺术典范',
        '珍宝馆：珍贵文物收藏'
      ]
    }
  ];
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
              全球景区直播
            </h1>
          </div>

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
              onClick={() => setActiveTab('popular')}
              className={`${activeTab === 'popular' ? 'text-blue-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              热门直播
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`${activeTab === 'about' ? 'text-blue-400' : 'text-white/70 hover:text-white'} transition-colors`}
            >
              关于我们
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
                  首页
                </button>
                <button
                  onClick={() => { setActiveTab('list'); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left py-2 ${activeTab === 'list' ? 'text-blue-400' : 'text-white'}`}
                >
                  景区列表
                </button>
                <button
                  onClick={() => { setActiveTab('popular'); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left py-2 ${activeTab === 'popular' ? 'text-blue-400' : 'text-white'}`}
                >
                  热门直播
                </button>
                <button
                  onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }}
                  className={`block w-full text-left py-2 ${activeTab === 'about' ? 'text-blue-400' : 'text-white'}`}
                >
                  关于我们
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
                        <span>直播中</span>
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
                <button
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                  onClick={() => setActiveTab('list')}
                >
                  查看全部 <ChevronRight size={18} />
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
                <h2 className="text-xl font-semibold text-white">景区列表</h2>
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
                  title={`${selectedScenic.name}直播`}
                ></iframe>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full flex items-center text-white">
                    <Play className="mr-2" size={16} />
                    <span>观看直播</span>
                  </button>
                  {selectedScenic.audioUrl && (
                    <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full flex items-center text-white">
                      <Headphones className="mr-2" size={16} />
                      <span>语音导览</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 景区介绍 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-white">景区介绍</h2>
              <p className="text-white/80 leading-relaxed mb-4">{selectedScenic.description}</p>
              <h3 className="text-lg font-semibold mb-3 text-white">特色景点</h3>
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
                  语音介绍
                </h2>
                <audio controls className="w-full">
                  <source src={selectedScenic.audioUrl} type="audio/mpeg" />
                  您的浏览器不支持音频元素。
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
                <h2 className="text-xl font-semibold text-white">热门直播</h2>
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
                        直播中
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/80 flex items-center">
                          <Cloud className="mr-1" size={14} />
                          {scenic.weather}
                        </span>
                        <button className="text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-full text-white transition-colors">
                          观看
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
            <h2 className="text-2xl font-bold mb-6 text-white">关于我们</h2>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-white">网站介绍</h3>
              <p className="text-white/80 mb-4">
                全球景区直播平台是一个专注于提供世界各地著名景区实时直播的网站。我们整合了全球各大景区的公开直播资源，让用户足不出户就能欣赏到世界各地的自然风光和人文景观。
              </p>
              <p className="text-white/80">
                我们的目标是打造一个科技感十足的旅游直播平台，为用户提供沉浸式的旅游体验，同时为计划出行的游客提供实用的景区信息和参考。
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-white">技术特点</h3>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  采用最新的Web技术，提供流畅的直播体验
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  交互式地图展示全球景区分布
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  响应式设计，适配各种设备
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  整合天气、语音导览等实用信息
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-white">联系我们</h3>
              <p className="text-white/80 mb-2">如有任何问题或建议，欢迎通过以下方式联系我们：</p>
              <p className="text-white/80">邮箱：contact@sceniclive.com</p>
            </div>
          </motion.div>
        )}
      </main>

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

export default App;