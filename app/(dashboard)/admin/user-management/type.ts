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
}

export interface AdminDashboardSummary {
  totalUsers: number;
  totalComics: number;
  topComics: AdminTopComic[];
}