export type FeedbackData = {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  rating: number;
  submittedOn: string;
  status: "Pending" | "Reviewed" | "Resolved";
};

export const MOCK_FEEDBACK: FeedbackData[] = [
  {
    id: "1",
    userName: "John Doe",
    userEmail: "john@example.com",
    subject: "App performance issue",
    message: "The app is running slow on my device. Please fix this issue.",
    rating: 3,
    submittedOn: "2024-01-15",
    status: "Pending",
  },
  {
    id: "2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    subject: "Great service",
    message: "I love the service! Keep up the good work.",
    rating: 5,
    submittedOn: "2024-01-16",
    status: "Reviewed",
  },
  {
    id: "3",
    userName: "Bob Wilson",
    userEmail: "bob@example.com",
    subject: "Payment error",
    message: "I encountered an error while making a payment. Please help.",
    rating: 2,
    submittedOn: "2024-01-17",
    status: "Resolved",
  },
  {
    id: "4",
    userName: "Alice Brown",
    userEmail: "alice@example.com",
    subject: "Feature request",
    message: "Please add dark mode to the app.",
    rating: 4,
    submittedOn: "2024-01-18",
    status: "Pending",
  },
  {
    id: "5",
    userName: "Charlie Davis",
    userEmail: "charlie@example.com",
    subject: "Login issue",
    message: "I'm unable to login to my account.",
    rating: 1,
    submittedOn: "2024-01-19",
    status: "Pending",
  },
];

export const FEEDBACK_STATUS_STYLES: Record<FeedbackData["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Reviewed: "bg-blue-100 text-blue-700 border-blue-200",
  Resolved: "bg-green-100 text-green-700 border-green-200",
};
