import React from "react";
import { Todo as TodoType } from "../utils/api";

interface TodoProps {
  todo: TodoType;
  onDelete: (id: string) => void;
}

const Todo: React.FC<TodoProps> = ({ todo, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{todo.title}</h3>
          <p className="mt-1 text-gray-600">{todo.description}</p>
        </div>
        <div className="ml-4">
          <button
            onClick={() => {
              const todoId = todo.id;
              if (!todoId) {
                console.error("Cannot delete todo without id:", todo);
                return;
              }
              onDelete(todoId);
            }}
            className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
            aria-label="Delete todo"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todo;
