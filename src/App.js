import React, { useState, useEffect, useRef } from 'react';
import { Globe, MapPin, Headphones, Cloud, Search, Menu, X } from 'lucide-react';
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
      name: '九寨沟',
      location: [103.92, 33.17],
      address: '四川省阿坝藏族羌族自治州九寨沟县漳扎镇',
      description: '世界自然遗产，以翠海、叠瀑、彩林、雪峰、藏情、蓝冰"六绝"著称',
      liveUrl: 'https://www.jiuzhai.com/zhuanti/cloud/index.html',
      audioUrl: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/6a354cc087ee4be5945aa557e4cbc07f.mp3',
      weather: {
        current: { temp: 21, condition: '小雨', wind: '北风 1-3级' },
        forecast: [
          { date: '2025-04-23', day: '小雨', night: '小雨', tempDay: 18, tempNight: 5 },
          { date: '2025-04-24', day: '小雨', night: '小雨', tempDay: 16, tempNight: 5 },
          { date: '2025-04-25', day: '小雨', night: '小雨', tempDay: 19, tempNight: 6 }
        ]
      },
      highlights: [
        '五花海：九寨沟C位景点，碧绿湖水犹如碧玉',
        '珍珠滩瀑布：86版《西游记》取景地',
        '镜海：清晨如天空之镜般的梦幻景象'
      ]
    },
    {
      id: 2,
      name: '黄山',
      location: [118.17, 30.17],
      address: '安徽省黄山市汤口镇汤泉路1号',
      description: '世界文化与自然遗产，以奇松、怪石、云海、温泉、冬雪"五绝"著称',
      liveUrl: 'https://www.huangshan1.com/live',
      audioUrl: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/0aebeccb319c429bb34e8511a81ca911.mp3',
      weather: {
        current: { temp: 24, condition: '小雨', wind: '东北风 1-3级' },
        forecast: [
          { date: '2025-04-23', day: '晴', night: '晴', tempDay: 28, tempNight: 15 },
          { date: '2025-04-24', day: '小雨', night: '小雨', tempDay: 25, tempNight: 15 },
          { date: '2025-04-25', day: '多云', night: '多云', tempDay: 21, tempNight: 9 }
        ]
      },
      highlights: [
        '迎客松：黄山标志性景观',
        '光明顶：黄山第二高峰',
        '飞来石：神奇的巨石景观'
      ]
    },
    {
      id: 3,
      name: '美国大峡谷',
      location: [-112.1, 36.1],
      address: '美国亚利桑那州',
      description: '世界自然奇观，科罗拉多河数百万年冲刷形成的巨大峡谷',
      liveUrl: 'https://v.qq.com/x/cover/mzc003lxo9xui9l/p3538oyruut.html',
      audioUrl: '',
      weather: {
        current: { temp: 18, condition: '晴', wind: '西南风 2-4级' },
        forecast: [
          { date: '2025-04-23', day: '晴', night: '晴', tempDay: 22, tempNight: 12 },
          { date: '2025-04-24', day: '多云', night: '多云', tempDay: 20, tempNight: 10 },
          { date: '2025-04-25', day: '晴', night: '晴', tempDay: 25, tempNight: 15 }
        ]
      },
      highlights: [
        '南缘：最受欢迎的观景点',
        '玻璃天空步道：悬空观景平台',
        '科罗拉多河漂流：独特体验'
      ]
    }
  ];  
useEffect(() => {
    if (window.AMap && mapContainerRef.current) {
      mapInstance.current = new window.AMap.Map(mapContainerRef.current, {
        viewMode: '3D',
        zoom: 3,
        center: [105, 35]
      });

      scenicSpots.forEach(spot => {
        new window.AMap.Marker({
          position: new window.AMap.LngLat(spot.location[0], spot.location[1]),
          title: spot.name,
          map: mapInstance.current,
          content: `<div style="background-color:#4f46e5;color:white;padding:2px 6px;border-radius:4px;font-size:12px">${spot.name}</div>`
        });
      });

      mapInstance.current.addControl(new window.AMap.Scale());
      mapInstance.current.addControl(new window.AMap.ToolBar());
    }

    return () => {
      mapInstance.current?.destroy();
    };
  }, []);

  const handleScenicSelect = (scenic) => {
    setSelectedScenic(scenic);
    setActiveTab('detail');
    if (mapInstance.current) {
      mapInstance.current.setCenter([scenic.location[0], scenic.location[1]]);
      mapInstance.current.setZoom(12);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Globe className="text-blue-600 mr-2" size={24} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              全球景区直播
            </h1>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => setActiveTab('home')}
              className={`${activeTab === 'home' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
            >
              首页
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`${activeTab === 'list' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
            >
              景区列表
            </button>
            <button 
              onClick={() => setActiveTab('popular')}
              className={`${activeTab === 'popular' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
            >
              热门直播
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`${activeTab === 'about' ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
            >
              关于我们
            </button>
          </div>
          
          <button 
            className="md:hidden text-gray-600 p-1 rounded-md hover:bg-gray-100"
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
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
                <button 
                  onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
                  className={`${activeTab === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} py-2 px-4 rounded-md text-left`}
                >
                  首页
                </button>
                <button 
                  onClick={() => { setActiveTab('list'); setIsMobileMenuOpen(false); }}
                  className={`${activeTab === 'list' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} py-2 px-4 rounded-md text-left`}
                >
                  景区列表
                </button>
                <button 
                  onClick={() => { setActiveTab('popular'); setIsMobileMenuOpen(false); }}
                  className={`${activeTab === 'popular' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} py-2 px-4 rounded-md text-left`}
                >
                  热门直播
                </button>
                <button 
                  onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }}
                  className={`${activeTab === 'about' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} py-2 px-4 rounded-md text-left`}
                >
                  关于我们
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav> 
     <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="搜索景区名称或地点..."
              className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {activeTab === 'home' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-4 border-b border-gray-200 flex items-center">
                <MapPin className="text-blue-600 mr-2" size={20} />
                <h2 className="text-xl font-semibold">全球景区分布</h2>
              </div>
              <div ref={mapContainerRef} className="h-96 w-full"></div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-4 h-4 bg-blue-600 rounded-full mr-2"></span>
                热门景区直播
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenicSpots.slice(0, 3).map(scenic => (
                  <motion.div
                    key={scenic.id}
                    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                    onClick={() => handleScenicSelect(scenic)}
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden flex items-center justify-center">
                      <h3 className="text-white font-bold text-2xl">{scenic.name}</h3>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white/80 text-sm">{scenic.address}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Cloud className="mr-1" size={16} />
                        <span>{scenic.weather.current.condition} {scenic.weather.current.temp}°C</span>
                      </div>
                      <p className="text-gray-700 line-clamp-2">{scenic.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Cloud className="text-blue-600 mr-2" size={20} />
                景区天气速览
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenicSpots.slice(0, 3).map(scenic => (
                  <div key={scenic.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800">{scenic.name}</h3>
                    <div className="flex items-center mt-2">
                      <div className="text-3xl font-bold mr-4">{scenic.weather.current.temp}°C</div>
                      <div>
                        <div className="text-gray-600">{scenic.weather.current.condition}</div>
                        <div className="text-sm text-gray-500">{scenic.weather.current.wind}</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        {scenic.weather.forecast.slice(0, 3).map((day, i) => (
                          <div key={i} className="text-center">
                            <div className="text-gray-500">{day.date.split('-')[2]}/{day.date.split('-')[1]}</div>
                            <div className="font-medium">{day.day}</div>
                            <div>{day.tempDay}°/{day.tempNight}°</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}    
    {activeTab === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">景区列表</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {scenicSpots.map(scenic => (
                  <div 
                    key={scenic.id} 
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleScenicSelect(scenic)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md overflow-hidden mr-4 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{scenic.name}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{scenic.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{scenic.address}</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{scenic.description}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="flex items-center text-sm text-gray-600">
                          <Cloud className="mr-1" size={16} />
                          <span>{scenic.weather.current.temp}°C</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{scenic.weather.current.condition}</div>
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
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{selectedScenic.name}</h2>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  返回列表
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                      实时直播
                    </h3>
                    <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                      <iframe 
                        src={selectedScenic.liveUrl}
                        className="w-full h-96"
                        allowFullScreen
                        allow="autoplay"
                        title={`${selectedScenic.name}直播`}
                      ></iframe>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">景区介绍</h3>
                    <p className="text-gray-700 mb-4">{selectedScenic.description}</p>
                    
                    <h4 className="font-medium mb-2">特色景点</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {selectedScenic.highlights.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Cloud className="mr-2" size={20} />
                      天气情况
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="text-4xl font-bold mr-4">{selectedScenic.weather.current.temp}°C</div>
                      <div>
                        <div className="font-medium">{selectedScenic.weather.current.condition}</div>
                        <div className="text-sm text-gray-600">{selectedScenic.weather.current.wind}</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="text-sm font-medium mb-2">未来三天预报</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedScenic.weather.forecast.slice(0, 3).map((day, i) => (
                          <div key={i} className="text-center">
                            <div className="text-sm font-medium">{day.date.split('-')[2]}/{day.date.split('-')[1]}</div>
                            <div className="text-xs">{day.day}</div>
                            <div className="text-xs">{day.tempDay}°/{day.tempNight}°</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <MapPin className="mr-2" size={20} />
                      景区地址
                    </h3>
                    <p className="text-gray-700 mb-2">{selectedScenic.address}</p>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      查看地图导航
                    </button>
                  </div>
                  
                  {selectedScenic.audioUrl && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Headphones className="mr-2" size={20} />
                        语音介绍
                      </h3>
                      <audio controls className="w-full">
                        <source src={selectedScenic.audioUrl} type="audio/mpeg" />
                        您的浏览器不支持音频元素。
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}   
     {activeTab === 'popular' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">热门直播</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {scenicSpots.map(scenic => (
                  <motion.div
                    key={scenic.id}
                    whileHover={{ y: -5 }}
                    className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleScenicSelect(scenic)}
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-400 to-purple-500 relative h-48 flex items-center justify-center">
                      <h3 className="text-white font-bold text-xl">{scenic.name}</h3>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                        <div>
                          <p className="text-white/80 text-sm">{scenic.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">{scenic.weather.current.condition} {scenic.weather.current.temp}°C</span>
                        <span className="text-sm text-red-500 flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                          直播中
                        </span>
                      </div>
                      <p className="text-gray-700 line-clamp-2">{scenic.description}</p>
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
            className="bg-white rounded-xl shadow-md p-8"
          >
            <h2 className="text-2xl font-bold mb-6">关于我们</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">网站介绍</h3>
              <p className="text-gray-700 mb-4">
                全球景区直播平台是一个专注于提供世界各地著名景区实时直播的网站。我们整合了全球各大景区的公开直播资源，让用户足不出户就能欣赏到世界各地的自然风光和人文景观。
              </p>
              <p className="text-gray-700">
                我们的目标是打造一个科技感十足的旅游直播平台，为用户提供沉浸式的旅游体验，同时为计划出行的游客提供实用的景区信息和参考。
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">技术特点</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>采用最新的Web技术，提供流畅的直播体验</li>
                <li>交互式地图展示全球景区分布</li>
                <li>响应式设计，适配各种设备</li>
                <li>整合天气、语音导览等实用信息</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">联系我们</h3>
              <p className="text-gray-700 mb-2">如有任何问题或建议，欢迎通过以下方式联系我们：</p>
              <p className="text-gray-700">邮箱：contact@sceniclive.com</p>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-2 md:mb-0">
              页面内容均由 AI 生成，仅供参考
            </div>
            <div className="text-sm text-gray-600">
              created by <a href="https://space.coze.cn" className="text-blue-600 hover:text-blue-800 underline">coze space</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;