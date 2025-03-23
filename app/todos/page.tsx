"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Todo from "../components/Todo";
import {
  getTodos,
  addTodo,
  removeTodo,
  logout,
  Todo as TodoType,
} from "../utils/api";

export default function TodosPage() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const response = await getTodos();
      console.log("Raw todos response:", response);

      // Extract todos from the nested data structure
      const todosData = response.data;

      // Process the todos
      const processedTodos = todosData.map((todo) => ({
        ...todo,
        id: todo.id, // Only use actual IDs from the backend
      }));

      console.log("Processed todos:", processedTodos);
      setTodos(processedTodos);
    } catch (err) {
      console.error("Error loading todos:", err);
      setError("Failed to load todos");
      if (err instanceof Error && err.message.includes("unauthorized")) {
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const todo = await addTodo(title, description);
      console.log("Added todo response:", todo);

      setTodos((current) => [...current, todo.data]);
      setTitle("");
      setDescription("");
      setIsAddingTodo(false);
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add todo");
      if (err instanceof Error && err.message.includes("unauthorized")) {
        router.push("/");
      }
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await removeTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo");
      if (err instanceof Error && err.message.includes("unauthorized")) {
        router.push("/");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsAddingTodo(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add New Task
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {isAddingTodo && (
          <form
            onSubmit={handleAddTodo}
            className="bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task description"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTodo(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Add Task
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {Array.isArray(todos) &&
            todos.map((todo) => (
              <Todo key={todo.id} todo={todo} onDelete={handleDeleteTodo} />
            ))}
          {(!Array.isArray(todos) || todos.length === 0) && !isAddingTodo && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tasks yet
              </h3>
              <p className="text-gray-500">Get started by adding a new task</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
