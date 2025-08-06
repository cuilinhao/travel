import React, { useState, useRef, useEffect } from 'react';
import LiveStreamPlaceholder from './LiveStreamPlaceholder';

const LiveStreamViewer = ({ liveUrl, scenicName, language }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    
    // 设置超时检测
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 10000); // 10秒超时

    return () => clearTimeout(timeout);
  }, [liveUrl, isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    // 检查iframe内容是否可访问
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        // 尝试访问iframe内容，如果被阻止会抛出错误
        const href = iframe.contentWindow.location.href;
        console.log('Iframe loaded successfully:', href);
      }
    } catch (error) {
      // 如果无法访问iframe内容，可能是跨域或连接被拒绝
      console.warn('Live stream may be blocked:', error);
      setHasError(true);
    }
  };

  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // 检查URL是否可能有问题
  const isProblematicUrl = (url) => {
    const problematicDomains = ['acfun.cn', 'qq.com'];
    return problematicDomains.some(domain => url.includes(domain));
  };

  // 如果URL可能有问题，直接显示占位符
  if (isProblematicUrl(liveUrl)) {
    return <LiveStreamPlaceholder liveUrl={liveUrl} scenicName={scenicName} language={language} />;
  }

  if (hasError) {
    return <LiveStreamPlaceholder liveUrl={liveUrl} scenicName={scenicName} language={language} />;
  }

  return (
    <div className="relative pt-[56.25%]">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white/70">
              {language === 'zh' ? '正在加载直播...' : 'Loading live stream...'}
            </p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={liveUrl}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen"
        title={`${scenicName}${language === 'zh' ? '直播' : ' Live Stream'}`}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};

export default LiveStreamViewer;