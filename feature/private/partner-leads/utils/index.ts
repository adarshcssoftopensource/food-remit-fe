export const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "CONTACTED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "QUALIFIED":
      return "bg-teal-100 text-teal-800 border-teal-200";
    case "REGISTRATION_INVITED":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "REGISTRATION_STARTED":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "APPROVED":
      return "bg-green-100 text-green-800 border-green-200";
    case "NOT_QUALIFIED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
