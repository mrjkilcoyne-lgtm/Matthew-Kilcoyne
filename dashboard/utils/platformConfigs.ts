// ============================================================
// PLATFORM CONFIGURATIONS - All supported social media platforms
// ============================================================

import { PlatformConfig, PlatformId } from '../types';

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  // === CORE PLATFORMS ===

  x: {
    id: 'x',
    name: 'X (Twitter)',
    category: 'core',
    color: '#000000',
    bgColor: '#f5f5f5',
    icon: 'twitter',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    apiBaseUrl: 'https://api.twitter.com/2',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access', 'bookmark.read', 'like.read'],
    regions: ['UK', 'US', 'EU', 'UAE', 'CANZUK', 'LATAM', 'AFRICA', 'APAC'],
    features: ['posting', 'analytics', 'scheduling', 'polls', 'spaces', 'threads'],
  },

  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'core',
    color: '#0A66C2',
    bgColor: '#EBF4FF',
    icon: 'linkedin',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    apiBaseUrl: 'https://api.linkedin.com/v2',
    scopes: ['r_liteprofile', 'r_organization_social', 'w_member_social', 'r_organization_admin'],
    regions: ['UK', 'US', 'EU', 'UAE', 'CANZUK'],
    features: ['posting', 'analytics', 'newsletters', 'polls'],
  },

  facebook: {
    id: 'facebook',
    name: 'Facebook',
    category: 'core',
    color: '#1877F2',
    bgColor: '#EBF0FF',
    icon: 'facebook',
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    apiBaseUrl: 'https://graph.facebook.com/v19.0',
    scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts', 'read_insights'],
    regions: ['UK', 'US', 'EU', 'UAE', 'CANZUK', 'LATAM', 'AFRICA', 'APAC'],
    features: ['posting', 'analytics', 'stories', 'reels', 'live', 'polls'],
  },

  instagram: {
    id: 'instagram',
    name: 'Instagram',
    category: 'core',
    color: '#E4405F',
    bgColor: '#FFF0F3',
    icon: 'instagram',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    apiBaseUrl: 'https://graph.instagram.com/v19.0',
    scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_insights'],
    regions: ['UK', 'US', 'EU', 'UAE', 'CANZUK', 'LATAM', 'AFRICA', 'APAC'],
    features: ['posting', 'analytics', 'stories', 'reels', 'live'],
  },

  youtube: {
    id: 'youtube',
    name: 'YouTube',
    category: 'core',
    color: '#FF0000',
    bgColor: '#FFF0F0',
    icon: 'youtube',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/yt-analytics.readonly'],
    regions: ['UK', 'US', 'EU', 'UAE', 'CANZUK', 'LATAM', 'AFRICA', 'APAC'],
    features: ['posting', 'analytics', 'shorts', 'live'],
  },

  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    category: 'core',
    color: '#000000',
    bgColor: '#f0fffe',
    icon: 'music',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    apiBaseUrl: 'https://open.tiktokapis.com/v2',
    scopes: ['user.info.basic', 'video.list', 'video.publish', 'video.upload'],
    regions: ['UK', 'US', 'EU', 'CANZUK', 'LATAM', 'APAC'],
    features: ['posting', 'analytics', 'reels', 'live'],
  },

  substack: {
    id: 'substack',
    name: 'Substack',
    category: 'core',
    color: '#FF6719',
    bgColor: '#FFF4EE',
    icon: 'book-open',
    authUrl: '', // Substack uses RSS/API keys, no OAuth
    apiBaseUrl: 'https://substack.com/api/v1',
    scopes: [],
    regions: ['UK', 'US', 'EU', 'CANZUK'],
    features: ['posting', 'analytics', 'newsletters'],
  },

  // === EMERGING PLATFORMS ===

  threads: {
    id: 'threads',
    name: 'Threads',
    category: 'emerging',
    color: '#000000',
    bgColor: '#f5f5f5',
    icon: 'at-sign',
    authUrl: 'https://threads.net/oauth/authorize',
    apiBaseUrl: 'https://graph.threads.net/v1.0',
    scopes: ['threads_basic', 'threads_content_publish', 'threads_manage_insights'],
    regions: ['UK', 'US', 'EU', 'CANZUK'],
    features: ['posting', 'analytics', 'threads'],
  },

  bluesky: {
    id: 'bluesky',
    name: 'Bluesky',
    category: 'emerging',
    color: '#0085FF',
    bgColor: '#EBF5FF',
    icon: 'cloud',
    authUrl: 'https://bsky.social/xrpc/com.atproto.server.createSession',
    apiBaseUrl: 'https://bsky.social/xrpc',
    scopes: [],
    regions: ['UK', 'US', 'EU', 'CANZUK'],
    features: ['posting', 'analytics', 'threads'],
  },

  mastodon: {
    id: 'mastodon',
    name: 'Mastodon',
    category: 'emerging',
    color: '#6364FF',
    bgColor: '#F0F0FF',
    icon: 'globe',
    authUrl: '', // Instance-specific
    apiBaseUrl: '', // Instance-specific
    scopes: ['read', 'write', 'follow'],
    regions: ['UK', 'US', 'EU', 'CANZUK'],
    features: ['posting', 'analytics', 'polls'],
  },

  reddit: {
    id: 'reddit',
    name: 'Reddit',
    category: 'emerging',
    color: '#FF4500',
    bgColor: '#FFF3EE',
    icon: 'message-circle',
    authUrl: 'https://www.reddit.com/api/v1/authorize',
    apiBaseUrl: 'https://oauth.reddit.com/api/v1',
    scopes: ['identity', 'read', 'submit', 'history'],
    regions: ['UK', 'US', 'EU', 'CANZUK'],
    features: ['posting', 'analytics', 'polls'],
  },

  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'emerging',
    color: '#E60023',
    bgColor: '#FFF0F2',
    icon: 'pin',
    authUrl: 'https://api.pinterest.com/oauth',
    apiBaseUrl: 'https://api.pinterest.com/v5',
    scopes: ['boards:read', 'pins:read', 'user_accounts:read'],
    regions: ['UK', 'US', 'EU', 'CANZUK'],
    features: ['posting', 'analytics'],
  },

  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    category: 'emerging',
    color: '#FFFC00',
    bgColor: '#FFFDE6',
    icon: 'camera',
    authUrl: 'https://accounts.snapchat.com/accounts/oauth2/auth',
    apiBaseUrl: 'https://adsapi.snapchat.com/v1',
    scopes: ['snapchat-marketing-api'],
    regions: ['UK', 'US', 'EU', 'UAE', 'CANZUK'],
    features: ['posting', 'analytics', 'stories'],
  },

  // === GLOBAL SOUTH / REGIONAL ===

  telegram: {
    id: 'telegram',
    name: 'Telegram',
    category: 'global_south',
    color: '#26A5E4',
    bgColor: '#EBF8FF',
    icon: 'send',
    authUrl: '', // Bot token based
    apiBaseUrl: 'https://api.telegram.org/bot',
    scopes: [],
    regions: ['EU', 'UAE', 'LATAM', 'AFRICA', 'APAC'],
    features: ['posting', 'analytics', 'polls'],
  },

  wechat: {
    id: 'wechat',
    name: 'WeChat',
    category: 'global_south',
    color: '#07C160',
    bgColor: '#EEFFF5',
    icon: 'message-square',
    authUrl: 'https://open.weixin.qq.com/connect/qrconnect',
    apiBaseUrl: 'https://api.weixin.qq.com/cgi-bin',
    scopes: ['snsapi_userinfo'],
    regions: ['APAC'],
    features: ['posting', 'analytics', 'newsletters'],
  },

  weibo: {
    id: 'weibo',
    name: 'Weibo',
    category: 'global_south',
    color: '#E6162D',
    bgColor: '#FFF0F2',
    icon: 'radio',
    authUrl: 'https://api.weibo.com/oauth2/authorize',
    apiBaseUrl: 'https://api.weibo.com/2',
    scopes: ['all'],
    regions: ['APAC'],
    features: ['posting', 'analytics', 'stories', 'live'],
  },

  vk: {
    id: 'vk',
    name: 'VK',
    category: 'global_south',
    color: '#0077FF',
    bgColor: '#EBF3FF',
    icon: 'users',
    authUrl: 'https://oauth.vk.com/authorize',
    apiBaseUrl: 'https://api.vk.com/method',
    scopes: ['wall', 'stats', 'groups'],
    regions: ['EU'],
    features: ['posting', 'analytics', 'stories', 'live', 'polls'],
  },

  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    category: 'messaging',
    color: '#25D366',
    bgColor: '#EEFFF5',
    icon: 'phone',
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    apiBaseUrl: 'https://graph.facebook.com/v19.0',
    scopes: ['whatsapp_business_management', 'whatsapp_business_messaging'],
    regions: ['UK', 'US', 'EU', 'UAE', 'CANZUK', 'LATAM', 'AFRICA', 'APAC'],
    features: ['posting', 'analytics'],
  },

  line: {
    id: 'line',
    name: 'LINE',
    category: 'global_south',
    color: '#00C300',
    bgColor: '#EEFFF0',
    icon: 'message-circle',
    authUrl: 'https://access.line.me/oauth2/v2.1/authorize',
    apiBaseUrl: 'https://api.line.me/v2',
    scopes: ['profile', 'openid'],
    regions: ['APAC'],
    features: ['posting', 'analytics'],
  },
};

export const CORE_PLATFORMS: PlatformId[] = ['x', 'linkedin', 'facebook', 'instagram', 'youtube', 'tiktok', 'substack'];
export const EMERGING_PLATFORMS: PlatformId[] = ['threads', 'bluesky', 'mastodon', 'reddit', 'pinterest', 'snapchat'];
export const GLOBAL_SOUTH_PLATFORMS: PlatformId[] = ['telegram', 'wechat', 'weibo', 'vk', 'whatsapp', 'line'];

export const getPlatformsByRegion = (region: string): PlatformConfig[] => {
  return Object.values(PLATFORMS).filter(p => p.regions.includes(region));
};

export const getPlatformsByCategory = (category: string): PlatformConfig[] => {
  return Object.values(PLATFORMS).filter(p => p.category === category);
};
