import React, { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Map, Compass, Mountain, Waves, CloudRain, Thermometer, Calendar, Clock, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const WorldTravelLive = () => {
  const mapContainerRef = useRef(null);
  const mapSDK = useRef<any>();
  const mapInstance = useRef<any>();
  const [activeTab, setActiveTab] = useState('huangshan');
  const [isPlaying, setIsPlaying] = useState(false);

  // 景区数据
  const scenicSpots = [
    {
      id: 'huangshan',
      name: '黄山风景区',
      address: '汤口镇汤泉路1号',
      position: [118.189678, 30.084619],
      description: '黄山是世界文化与自然遗产，以奇松、怪石、云海、温泉、冬雪\"五绝\"著称于世。',
      weather: {
        current: { temp: 24, condition: '小雨', wind: '东北风 1-3级' },
        forecast: [
          { date: '2025-04-23', day: '晴', night: '晴', tempDay: 28, tempNight: 15 },
          { date: '2025-04-24', day: '小雨', night: '小雨', tempDay: 25, tempNight: 15 },
          { date: '2025-04-25', day: '多云', night: '多云', tempDay: 21, tempNight: 9 }
        ]
      },
      liveUrls: [
        { name: '黄山旅游网直播', url: 'https://www.huangshan1.com/live' },
        { name: '直播中国', url: 'https://livechina.cctv.com/live_zb/LIVE2780.html' },
        { name: '光明顶直播', url: 'http://livechina.cctv.com/huangshan/06/' }
      ],
      audioUrl: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/0aebeccb319c429bb34e8511a81ca911.mp3',
      imageUrl: 'https://s.coze.cn/t/SGK7uJPKKhI/'
    },
    {
      id: 'jiuzhaigou',
      name: '九寨沟景区',
      address: '漳扎镇',
      position: [103.861238, 33.295478],
      description: '九寨沟是世界自然遗产，以翠海、叠瀑、彩林、雪峰、藏情、蓝冰\"六绝\"著称，被誉为\"童话世界\"。',
      weather: {
        current: { temp: 21, condition: '小雨', wind: '北风 1-3级' },
        forecast: [
          { date: '2025-04-23', day: '小雨', night: '小雨', tempDay: 18, tempNight: 5 },
          { date: '2025-04-24', day: '小雨', night: '小雨', tempDay: 16, tempNight: 5 },
          { date: '2025-04-25', day: '小雨', night: '小雨', tempDay: 19, tempNight: 6 }
        ]
      },
      liveUrls: [
        { name: '云游九寨实时景观直播', url: 'https://www.jiuzhai.com/zhuanti/cloud/index.html' },
        { name: '直播中国', url: 'https://livechina.cctv.com/live_zb/LIVE3144.html' },
        { name: '央视直播', url: 'https://www.jiuzhai.com/news/scenic-news/9554-2024-04-01-11-23-36' }
      ],
      audioUrl: 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/6a354cc087ee4be5945aa557e4cbc07f.mp3',
      imageUrl: 'https://s.coze.cn/t/dX-CSZZxl3A/'
    }
  ];

  // 初始化地图
  useEffect(() => {
    AMapLoader.load({
      key: 'd17c17f8f712c81a7e4241aff4faa7b0',
      plugins: ['AMap.Marker', 'AMap.InfoWindow']
    }).then(AMap => {
      mapSDK.current = AMap;
      const map = new AMap.Map(mapContainerRef.current, {
        viewMode: '3D',
        zoom: 5,
        center: [110, 32]
      });
      mapInstance.current = map;

      // 添加标记点
      scenicSpots.forEach(spot => {
        const marker = new AMap.Marker({
          position: spot.position,
          title: spot.name,
          map: map
        });

        marker.on('click', () => {
          setActiveTab(spot.id);
        });
      });
    }).catch(e => {
      console.error('地图加载失败:', e);
    });

    return () => {
      mapInstance.current?.destroy();
    };
  }, []);

  const activeSpot = scenicSpots.find(spot => spot.id === activeTab) || scenicSpots[0];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Compass className="text-blue-500" size={24} />
            <h1 className="text-2xl font-bold text-gray-800">全球景区直播</h1>
          </div>
          <div className="text-sm text-gray-500">
            数据更新: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* 地图区域 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
            <Map className="text-blue-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-700">景区分布地图</h2>
          </div>
          <div ref={mapContainerRef} className="h-96 w-full"></div>
        </div>

        {/* 景区详情 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* 景区选择 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-lg font-semibold text-gray-700">选择景区</h2>
            </div>
            <div className="p-4">
              {scenicSpots.map(spot => (
                <motion.div
                  key={spot.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${activeTab === spot.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab(spot.id)}
                >
                  <div className="flex items-center">
                    <Mountain className="text-blue-500 mr-2" size={18} />
                    <span className="font-medium">{spot.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 景区基本信息 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden lg:col-span-2">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
              <Mountain className="text-blue-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-700">{activeSpot.name}详情</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <h3 className="text-md font-semibold mb-2 flex items-center">
                    <Waves className="text-blue-500 mr-2" size={18} />
                    景区介绍
                  </h3>
                  <p className="text-gray-600">{activeSpot.description}</p>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">地址</h4>
                    <p className="text-gray-700">{activeSpot.address}</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img 
                    src={activeSpot.imageUrl} 
                    alt={activeSpot.name}
                    className="w-full h-48 object-cover rounded-lg shadow-sm"
                  />
                </div>
              </div>

              {/* 天气信息 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-md font-semibold mb-3 flex items-center">
                  <CloudRain className="text-blue-500 mr-2" size={18} />
                  天气情况
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center mb-1">
                      <Thermometer className="text-blue-500 mr-2" size={16} />
                      <span className="text-sm text-gray-500">当前温度</span>
                    </div>
                    <div className="text-2xl font-bold">{activeSpot.weather.current.temp}°C</div>
                    <div className="text-sm text-gray-600">{activeSpot.weather.current.condition}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center mb-1">
                      <Waves className="text-blue-500 mr-2" size={16} />
                      <span className="text-sm text-gray-500">风力</span>
                    </div>
                    <div className="text-lg font-medium">{activeSpot.weather.current.wind}</div>
                  </div>
                  {activeSpot.weather.forecast.slice(0, 2).map((day, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center mb-1">
                        <Calendar className="text-blue-500 mr-2" size={16} />
                        <span className="text-sm text-gray-500">{day.date.split('-').slice(1).join('/')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-medium">{day.tempDay}°C / {day.tempNight}°C</div>
                          <div className="text-sm text-gray-600">{day.day}转{day.night}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 语音介绍 */}
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2 flex items-center">
                  <Headphones className="text-blue-500 mr-2" size={18} />
                  语音介绍
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <audio 
                    controls 
                    src={activeSpot.audioUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full"
                  >
                    您的浏览器不支持音频元素。
                  </audio>
                </div>
              </div>

              {/* 直播链接 */}
              <div>
                <h3 className="text-md font-semibold mb-3 flex items-center">
                  <Clock className="text-blue-500 mr-2" size={18} />
                  实时直播
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeSpot.liveUrls.map((live, index) => (
                    <motion.a
                      key={index}
                      whileHover={{ y: -2 }}
                      href={live.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                        <span className="font-medium">{live.name}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>created by <a href="https://space.coze.cn" className="text-blue-500 hover:underline">coze space</a> | 页面内容均由 AI 生成，仅供参考</p>
        </div>
      </footer>
    </div>
  );
};

export default WorldTravelLive;