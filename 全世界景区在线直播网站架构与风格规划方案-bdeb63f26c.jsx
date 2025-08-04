import React, { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import {
  MapPin,
  Globe,
  List,
  Info,
  TrendingUp,
  Search,
  Cloud,
  Navigation,
  Volume2,
  Play,
  Pause,
  Fullscreen,
  Share2,
  MessageSquare,
  Heart,
  Users,
  Phone,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WorldLiveTour = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mapContainerRef = useRef(null);
  const mapSDK = useRef<any>();
  const mapInstance = useRef<any>();
  const [selectedScenic, setSelectedScenic] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 模拟景区数据
  const scenicSpots = [
    {
      id: 1,
      name: '长城',
      location: '中国北京',
      type: '文化遗产',
      isPopular: true,
      liveUrl: 'https://example.com/live/greatwall',
      description: '长城是中国古代的军事防御工程，也是世界上最伟大的建筑之一。',
      weather: {
        temp: '18°C',
        condition: '晴朗',
        humidity: '45%',
      },
      coordinates: [116.397428, 39.90923],
    },
    {
      id: 2,
      name: '埃菲尔铁塔',
      location: '法国巴黎',
      type: '地标建筑',
      isPopular: true,
      liveUrl: 'https://example.com/live/eiffel',
      description: '埃菲尔铁塔是巴黎的标志性建筑，也是世界著名的旅游景点。',
      weather: {
        temp: '22°C',
        condition: '多云',
        humidity: '60%',
      },
      coordinates: [2.2945, 48.8584],
    },
    {
      id: 3,
      name: '大峡谷',
      location: '美国亚利桑那州',
      type: '自然景观',
      isPopular: true,
      liveUrl: 'https://example.com/live/grandcanyon',
      description: '科罗拉多大峡谷是世界七大自然奇观之一，景色壮丽。',
      weather: {
        temp: '28°C',
        condition: '晴朗',
        humidity: '30%',
      },
      coordinates: [-112.112997, 36.106965],
    },
    {
      id: 4,
      name: '悉尼歌剧院',
      location: '澳大利亚悉尼',
      type: '文化地标',
      isPopular: true,
      liveUrl: 'https://example.com/live/sydneyopera',
      description: '悉尼歌剧院是20世纪最具特色的建筑之一，也是世界著名的表演艺术中心。',
      weather: {
        temp: '20°C',
        condition: '晴朗',
        humidity: '55%',
      },
      coordinates: [151.2153, -33.8568],
    },
  ];

  // 初始化地图
  useEffect(() => {
    AMapLoader.load({
      key: 'd17c17f8f712c81a7e4241aff4faa7b0',
      plugins: ['AMap.Scale', 'AMap.ToolBar'],
    })
      .then(AMap => {
        mapSDK.current = AMap;
        const map = new AMap.Map(mapContainerRef.current, {
          viewMode: '3D',
          zoom: 2,
          center: [116.397428, 39.90923],
        });
        mapInstance.current = map;

        // 添加景区标记
        scenicSpots.forEach(spot => {
          const marker = new AMap.Marker({
            position: spot.coordinates,
            map: map,
            content: `<div class="map-marker ${spot.isPopular ? 'popular' : ''}">
                        <MapPin size="16" color="${spot.isPopular ? '#FF5722' : '#4CAF50'}" />
                      </div>`,
            offset: new AMap.Pixel(-10, -30),
          });

          marker.on('click', () => {
            setSelectedScenic(spot);
            setActiveTab('detail');
          });
        });
      })
      .catch(e => {
        console.error('地图加载失败:', e);
      });

    return () => {
      mapInstance.current?.destroy();
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderHome = () => (
    <div className="space-y-8">
      {/* 地图展示区 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Globe className="mr-2 text-blue-500" />
            全球景区分布
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
              <span className="text-xs">热门景区</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs">普通景区</span>
            </div>
          </div>
        </div>
        <div ref={mapContainerRef} className="h-96 w-full"></div>
      </div>

      {/* 热门推荐区 */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-purple-500" />
          热门景区直播
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenicSpots.filter(s => s.isPopular).map(spot => (
            <motion.div
              key={spot.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedScenic(spot);
                setActiveTab('detail');
              }}
            >
              <div className="relative h-40 bg-gray-100">
                <img
                  src={`/api/coze_space/text2image?prompt=${encodeURIComponent(
                    `"${spot.name}"景区高清直播画面`
                  )}&width=512&height=512`}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  直播中
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium">{spot.name}</h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {spot.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 天气信息区 */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Cloud className="mr-2 text-blue-400" />
          景区天气速览
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {scenicSpots.filter(s => s.isPopular).map(spot => (
            <div key={spot.id} className="flex items-center">
              <div className="bg-blue-50 rounded-lg p-3 mr-3">
                <Cloud className="text-blue-500" />
              </div>
              <div>
                <div className="font-medium">{spot.name}</div>
                <div className="text-sm text-gray-500">
                  {spot.weather.temp} · {spot.weather.condition}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderList = () => (
    <div className="space-y-6">
      {/* 筛选区 */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地区</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option>全部地区</option>
              <option>亚洲</option>
              <option>欧洲</option>
              <option>美洲</option>
              <option>非洲</option>
              <option>大洋洲</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option>全部类型</option>
              <option>自然景观</option>
              <option>文化遗产</option>
              <option>地标建筑</option>
              <option>主题公园</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">热门程度</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option>全部</option>
              <option>热门景区</option>
              <option>普通景区</option>
            </select>
          </div>
        </div>
      </div>

      {/* 景区列表 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold">全球景区列表</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {scenicSpots.map(spot => (
            <div
              key={spot.id}
              className="p-4 hover:bg-gray-50 cursor-pointer flex items-start"
              onClick={() => {
                setSelectedScenic(spot);
                setActiveTab('detail');
              }}
            >
              <div className="bg-blue-50 rounded-lg p-3 mr-4">
                <MapPin className="text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{spot.name}</h4>
                  {spot.isPopular && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      热门
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">{spot.location}</div>
                <div className="text-sm text-gray-500 mt-1 flex items-center">
                  <Cloud className="w-4 h-4 mr-1" />
                  {spot.weather.temp} · {spot.weather.condition}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedScenic) return null;

    return (
      <div className="space-y-6">
        {/* 景区基本信息 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
              <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`/api/coze_space/text2image?prompt=${encodeURIComponent(
                    `"${selectedScenic.name}"景区高清全景`
                  )}&width=512&height=512`}
                  alt={selectedScenic.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-2">{selectedScenic.name}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-1" />
                {selectedScenic.location}
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <Cloud className="w-5 h-5 mr-1 text-blue-500" />
                  <span>
                    {selectedScenic.weather.temp} · {selectedScenic.weather.condition}
                  </span>
                </div>
                <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                  <Users className="w-5 h-5 mr-1 text-green-500" />
                  <span>直播中 · 1.2万观看</span>
                </div>
              </div>
              <p className="text-gray-700">{selectedScenic.description}</p>
            </div>
          </div>
        </div>

        {/* 在线直播区 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold flex items-center">
              <Play className="mr-2 text-red-500" />
              景区实时直播
            </h3>
          </div>
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 bg-black">
              <iframe
                src={selectedScenic.liveUrl}
                className="w-full h-96"
                allowFullScreen
              ></iframe>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button
                onClick={togglePlay}
                className="bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:bg-opacity-100 transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:bg-opacity-100 transition"
              >
                <Fullscreen className="w-5 h-5" />
              </button>
              <button className="bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:bg-opacity-100 transition">
                <Volume2 className="w-5 h-5" />
              </button>
              <button className="bg-white bg-opacity-80 rounded-full p-3 shadow-md hover:bg-opacity-100 transition">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 景区详情 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 景区介绍 */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Info className="mr-2 text-blue-500" />
              景区详细介绍
            </h3>
            <div className="prose max-w-none">
              <p>
                {selectedScenic.description} {selectedScenic.description}
              </p>
              <p>
                这里可以添加更多关于景区的详细信息，包括历史背景、文化意义、特色景点等。可以分段展示，使内容更加丰富和易于阅读。
              </p>
            </div>
          </div>

          {/* 实用信息 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Navigation className="mr-2 text-green-500" />
                景区地址
              </h3>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-gray-500" />
                <div>
                  <p className="font-medium">{selectedScenic.name}</p>
                  <p className="text-gray-600">{selectedScenic.location}</p>
                </div>
              </div>
              <div className="mt-4 h-40 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  ref={mapContainerRef}
                  className="h-full w-full"
                  style={{ minHeight: '160px' }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Volume2 className="mr-2 text-purple-500" />
                语音导览
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <span>中文导览</span>
                  <Play className="w-5 h-5 text-blue-500" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <span>English Guide</span>
                  <Play className="w-5 h-5 text-blue-500" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <span>日本語ガイド</span>
                  <Play className="w-5 h-5 text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPopular = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <TrendingUp className="mr-2 text-orange-500" />
          热门景区直播
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenicSpots
            .filter(s => s.isPopular)
            .map(spot => (
              <motion.div
                key={spot.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={`/api/coze_space/text2image?prompt=${encodeURIComponent(
                      `"${spot.name}"景区高清直播画面`
                    )}&width=512&height=512`}
                    alt={spot.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    <span>1.2万观看</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg">{spot.name}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {spot.location}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button className="flex items-center text-sm text-blue-500 hover:text-blue-700">
                      <Play className="w-4 h-4 mr-1" />
                      进入直播
                    </button>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-blue-500">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-green-500">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-8">
      {/* 网站介绍 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6">关于我们</h2>
        <div className="prose max-w-none">
          <p>
            全世界景区在线直播网站是一个创新的旅游科技平台，致力于通过实时直播技术将全球著名景区呈现给用户。
          </p>
          <p>
            我们的使命是打破地理限制，让用户足不出户就能欣赏世界各地的美景，为未来的旅行计划提供参考。
          </p>
          <p>
            平台采用最先进的流媒体技术和交互设计，提供高清、流畅的景区直播体验，并结合丰富的景区信息和实用的旅行建议。
          </p>
        </div>
      </div>

      {/* 团队介绍 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6">我们的团队</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: '张明',
              role: '创始人兼CEO',
              bio: '旅游科技行业资深专家，拥有10年互联网创业经验。',
              img: 'https://s.coze.cn/t/qhW0NjUI_8k/',
            },
            {
              name: '李华',
              role: '技术总监',
              bio: '全栈工程师，专注于流媒体技术和地图应用开发。',
              img: 'https://s.coze.cn/t/5Rmyi4BMOnc/',
            },
            {
              name: '王芳',
              role: '内容总监',
              bio: '旅游内容专家，负责全球景区内容策划和制作。',
              img: 'https://s.coze.cn/t/rCftK53pyQY/',
            },
          ].map((member, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xl font-semibold">{member.name}</h4>
              <p className="text-blue-600 mb-2">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 联系我们 */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6">联系我们</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">联系方式</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-500" />
                <span>contact@worldlivetour.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-500" />
                <span>+86 10 1234 5678</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 text-blue-500" />
                <span>
                  北京市朝阳区科技园区88号
                  <br />
                  世界旅游科技大厦15层
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">发送消息</h4>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="您的姓名"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="电子邮箱"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="您的消息"
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                发送消息
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                世界景区直播
              </span>
            </div>

            {/* 桌面导航 */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: 'home', label: '首页', icon: Globe },
                { id: 'list', label: '景区列表', icon: List },
                { id: 'popular', label: '热门直播', icon: TrendingUp },
                { id: 'about', label: '关于我们', icon: Info },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 pt-1 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-300'
                  } transition`}
                >
                  <tab.icon className="w-5 h-5 mr-1" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            <div className="hidden md:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="搜索景区..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* 移动菜单按钮 */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
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
              <div className="pt-2 pb-3 space-y-1">
                {[
                  { id: 'home', label: '首页', icon: Globe },
                  { id: 'list', label: '景区列表', icon: List },
                  { id: 'popular', label: '热门直播', icon: TrendingUp },
                  { id: 'about', label: '关于我们', icon: Info },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center pl-3 pr-4 py-2 border-l-4 ${
                      activeTab === tab.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="px-4 pb-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="搜索景区..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
        {activeTab === 'list' && renderList()}
        {activeTab === 'detail' && renderDetail()}
        {activeTab === 'popular' && renderPopular()}
        {activeTab === 'about' && renderAbout()}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 text-sm space-y-1">
            <div>
              <a
                href="https://space.coze.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                created by coze space
              </a>
            </div>
            <div>页面内容均由 AI 生成，仅供参考</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorldLiveTour;