import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AuthResponse {
  token: string;
}

export const authApi = createApi({
  reducerPath: "authapi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (info) => ({
        url: "/auth/login",
        method: "POST",
        body: info,
      }),
    }),
    register: build.mutation<AuthResponse, RegisterRequest>({
      query: (info) => ({
        url: "/auth/register",
        method: "POST",
        body: info,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;