// Banner Service - Manages banner operations
import { mockBanners } from '../data/bannerData';

// Get all banners
export const getBanners = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBanners);
    }, 300);
  });
};

// Add new banner
export const addBanner = async (bannerData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBanner = {
        id: Date.now(),
        header: bannerData.header,
        content: bannerData.content,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockBanners.push(newBanner);
      resolve(newBanner);
    }, 500);
  });
};

// Update banner
export const updateBanner = async (id, bannerData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bannerIndex = mockBanners.findIndex(banner => banner.id === id);
      if (bannerIndex !== -1) {
        mockBanners[bannerIndex] = {
          ...mockBanners[bannerIndex],
          ...bannerData,
          updatedAt: new Date().toISOString()
        };
        resolve(mockBanners[bannerIndex]);
      } else {
        throw new Error('Banner not found');
      }
    }, 500);
  });
};

// Get active banner
export const getActiveBanner = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activeBanner = mockBanners.find(banner => banner.active);
      resolve(activeBanner || null);
    }, 100);
  });
};