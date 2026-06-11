import type { ApiResponse } from "@/types/api";
import apiService from "../core";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    tokenType: string;
  };
  metadata: unknown;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export const fetchAuth = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("api/v1/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiService.post<ApiResponse<{ message: string }>>(
      "api/v1/auth/register",
      data
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiService.post("api/v1/auth/logout");
  },
};
