import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/lib/api/services/studentService";
import type { ApiStudentDashboardData } from "@/app/(dashboard)/components/student-types";

export interface UseStudentDashboardOptions {
  interactionLimit?: number;
  suggestedEventLimit?: number;
}

export function useStudentDashboard(
  phone?: string | null,
  options?: UseStudentDashboardOptions
) {
  const normalizedPhone = phone?.trim();

  return useQuery<ApiStudentDashboardData, Error>({
    queryKey: ["studentDashboard", normalizedPhone, options?.interactionLimit, options?.suggestedEventLimit],
    queryFn: async () => {
      if (!normalizedPhone) {
        throw new Error("Số điện thoại không hợp lệ");
      }
      return studentService.getStudentDashboard({
        phone: normalizedPhone,
        interactionLimit: options?.interactionLimit,
        suggestedEventLimit: options?.suggestedEventLimit,
      });
    },
    enabled: !!normalizedPhone,
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    retry: 1, // Thử lại 1 lần nếu lỗi
  });
}
