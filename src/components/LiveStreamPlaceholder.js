import React, { useState } from 'react';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

const LiveStreamPlaceholder = ({ liveUrl, scenicName, language }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      window.location.reload();
    }, 1000);
  };

  const handleOpenExternal = () => {
    window.open(liveUrl, '_blank');
  };

  const messages = {
    en: {
      title: "Live Stream Unavailable",
      description: "The live stream is currently unavailable or blocked by the source.",
      reasons: [
        "The streaming service may be temporarily down",
        "Geographic restrictions may apply",
        "The stream URL may have changed"
      ],
      retry: "Retry",
      openExternal: "Open in New Tab",
      retrying: "Retrying..."
    },
    zh: {
      title: "直播暂时无法观看",
      description: "直播源暂时无法访问或被阻止连接。",
      reasons: [
        "直播服务可能暂时不可用",
        "可能存在地理位置限制",
        "直播链接可能已更改"
      ],
      retry: "重试",
      openExternal: "在新标签页打开",
      retrying: "重试中..."
    }
  };

  const t = messages[language] || messages.en;

  return (
    <div className="relative pt-[56.25%] bg-gray-800 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6">
            <AlertCircle className="mx-auto text-yellow-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
            <p className="text-white/70 text-sm mb-4">{t.description}</p>
          </div>

          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <p className="text-white/80 text-sm mb-2">可能的原因：</p>
            <ul className="text-white/60 text-xs space-y-1">
              {t.reasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1 h-1 bg-white/40 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`mr-2 ${isRetrying ? 'animate-spin' : ''}`} size={16} />
              {isRetrying ? t.retrying : t.retry}
            </button>
            
            <button
              onClick={handleOpenExternal}
              className="flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="mr-2" size={16} />
              {t.openExternal}
            </button>
          </div>

          <div className="mt-4 text-xs text-white/50">
            {scenicName} - {language === 'zh' ? '直播源' : 'Live Stream'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPlaceholder;