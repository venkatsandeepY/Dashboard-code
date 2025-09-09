import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'react-feather';
import { getActiveBanner } from '../../services/bannerService';

const BannerNotice = () => {
  const [banner, setBanner] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveBanner();
  }, []);

  const loadActiveBanner = async () => {
    try {
      const activeBanner = await getActiveBanner();
      setBanner(activeBanner);
    } catch (error) {
      console.error('Error loading active banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (loading || !banner || !isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm">{banner.header}</div>
            <div className="text-sm opacity-90">{banner.content}</div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default BannerNotice;