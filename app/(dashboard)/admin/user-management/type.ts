export interface AdminUserSummary {
  id: number;
  email: string;
  fullName: string;
  role: string;
  status: string;
  dailyAiUsage: number;
  lastAiUsageDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTopComic {
  id: number;
  title: string;
  coverImageUrl: string;
  averageRating: number;
  totalRatings: number;
}

export interface AdminDashboardSummary {
  totalComics: number;
  totalChapters: number;
  totalPages: number;
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
  totalRatings: number;
  totalReadingHistories: number;
  topComics: AdminTopComic[];
}