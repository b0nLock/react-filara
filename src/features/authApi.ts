import { api } from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../features/authTypes";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    me: build.query<{ id: string; email: string }, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["User"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useMeQuery } = authApi;
