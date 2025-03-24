// Types based on the database schema
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message?: string;
  success?: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Auth APIs
export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Logout failed");
}

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password, name }),
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
}

// Todo APIs
export async function getTodos(): Promise<ApiResponse<Todo[]>> {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch todos");
  return response.json();
}

export async function addTodo(
  title: string,
  description: string
): Promise<ApiResponse<Todo>> {
  const response = await fetch(`${API_BASE_URL}/todos/addTodo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) throw new Error("Failed to add todo");

  return response.json();
}

export async function removeTodo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/todos/removeTodo/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete todo");
}
