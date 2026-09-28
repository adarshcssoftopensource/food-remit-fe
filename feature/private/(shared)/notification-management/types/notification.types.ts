export type WebNotificationItem = {
  id: string;
  title: string;
  message: string;
  status: number;
  isRead: boolean;
  addedOn: string;
  addedOnTimestamp: string;
  createdAt: string;
};

export type WebNotificationsResponse = {
  status: boolean;
  message?: string;
  data: WebNotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  count?: number;
};
