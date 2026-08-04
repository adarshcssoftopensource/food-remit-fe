import { MOCK_FAQS, type FaqData } from "@/constants/content-management";
import { useMemo, useState } from "react";
import { type FaqFormValues } from "../schema/content.schema";

export function useFaqManagement() {
  const [faqs, setFaqs] = useState<FaqData[]>(MOCK_FAQS);

  const stats = useMemo(
    () => ({
      total: faqs.length,
    }),
    [faqs],
  );

  const addFaq = (values: FaqFormValues) => {
    const newItem: FaqData = {
      id: `faq-${Date.now()}`,
      question: values.question.trim(),
      answer: values.answer.trim(),
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    setFaqs((prev) => [newItem, ...prev]);
  };

  const updateFaq = (id: string, values: FaqFormValues) => {
    setFaqs((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              question: values.question.trim(),
              answer: values.answer.trim(),
            }
          : item,
      ),
    );
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    addFaq,
    deleteFaq,
    faqs,
    stats,
    updateFaq,
  };
}
