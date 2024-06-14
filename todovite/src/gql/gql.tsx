import { gql } from "../__generated__";

export const GET_TODOS = gql(`
  query Todos($filter: TodoFilter) {
    todos(filter: $filter) {
      __typename
      id
      name
      description
      dueDate
      status
      isArchived
      createdAt
      updatedAt
      deletedAt
    }
  }
`);

export const GET_TODO_NAMES = gql(`
  query TodoNames($filter: TodoFilter) {
    todos(filter: $filter) {
      __typename
      id
      name
    }
  }
`);

export const GET_TODO = gql(`
  query Todo($id: ID!) {
    todo(id: $id) {
      __typename
      id
      name
      description
      dueDate
      status
      isArchived
      createdAt
      updatedAt
      deletedAt
    }
  }
`);

export const CREATE_TODO = gql(`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      __typename
      id
      name
      description
      dueDate
      status
      isArchived
      createdAt
      updatedAt
      deletedAt
    }
  }
`);

export const UPDATE_TODO = gql(`
  mutation UpdateTodo($updateTodoId: ID!, $input: UpdateTodoInput!) {
    updateTodo(id: $updateTodoId, input: $input) {
      __typename
      id
      name
      description
      dueDate
      status
      isArchived
      createdAt
      updatedAt
      deletedAt
    }
  }
`);

export const DELETE_TODO = gql(`
  mutation DeleteTodo($deleteTodoId: ID!) {
    deleteTodo(id: $deleteTodoId) {
      __typename
      id
      name
      description
      dueDate
      status
      isArchived
      createdAt
      updatedAt
      deletedAt
    }
  }
`);
