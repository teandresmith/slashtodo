/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query Todos($filter: TodoFilter) {\n    todos(filter: $filter) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.TodosDocument,
    "\n  query TodoNames($filter: TodoFilter) {\n    todos(filter: $filter) {\n      __typename\n      id\n      name\n    }\n  }\n": types.TodoNamesDocument,
    "\n  query Todo($id: ID!) {\n    todo(id: $id) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.TodoDocument,
    "\n  mutation CreateTodo($input: CreateTodoInput!) {\n    createTodo(input: $input) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.CreateTodoDocument,
    "\n  mutation UpdateTodo($updateTodoId: ID!, $input: UpdateTodoInput!) {\n    updateTodo(id: $updateTodoId, input: $input) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.UpdateTodoDocument,
    "\n  mutation DeleteTodo($deleteTodoId: ID!) {\n    deleteTodo(id: $deleteTodoId) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.DeleteTodoDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Todos($filter: TodoFilter) {\n    todos(filter: $filter) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  query Todos($filter: TodoFilter) {\n    todos(filter: $filter) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query TodoNames($filter: TodoFilter) {\n    todos(filter: $filter) {\n      __typename\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query TodoNames($filter: TodoFilter) {\n    todos(filter: $filter) {\n      __typename\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Todo($id: ID!) {\n    todo(id: $id) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  query Todo($id: ID!) {\n    todo(id: $id) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateTodo($input: CreateTodoInput!) {\n    createTodo(input: $input) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTodo($input: CreateTodoInput!) {\n    createTodo(input: $input) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateTodo($updateTodoId: ID!, $input: UpdateTodoInput!) {\n    updateTodo(id: $updateTodoId, input: $input) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTodo($updateTodoId: ID!, $input: UpdateTodoInput!) {\n    updateTodo(id: $updateTodoId, input: $input) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteTodo($deleteTodoId: ID!) {\n    deleteTodo(id: $deleteTodoId) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTodo($deleteTodoId: ID!) {\n    deleteTodo(id: $deleteTodoId) {\n      __typename\n      id\n      name\n      description\n      dueDate\n      status\n      isArchived\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;