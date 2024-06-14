package db

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"todoserver/model"
	"todoserver/util"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// Error that indicates that the resource did not exist
var ErrResourceDoesNotExist = errors.New("resource does not exist")

// Fetches all available todos
func FetchTodos(ctx context.Context, db *pgxpool.Pool, filter *model.TodoFilter) ([]*model.Todo, error) {
	var conditions []string
	var values []any
	count := 1
	if filter != nil {
		if filter.IsDeleted != nil && *filter.IsDeleted {
			conditions = append(conditions, "deleted_at is not null")
		} else {
			conditions = append(conditions, "deleted_at is null")
		}

		if filter.IsOverdue != nil {
			conditions = append(conditions, "due_date < current_timestamp")
		}

		if filter.IsArchived != nil {
			conditions = append(conditions, fmt.Sprintf("is_archived = $%d", count))
			values = append(values, *filter.IsArchived)
			count++
		}

		if filter.Status != nil {
			conditions = append(conditions, fmt.Sprintf("status = $%d", count))
			values = append(values, strings.ToLower(filter.Status.String()))
			count++
		}
	} else {
		conditions = append(conditions, "deleted_at is null")
	}

	sql := fmt.Sprintf(`select %s from todo %s order by id desc`, model.TodoDatabase{}.ColumnStatement(), util.BuildConditions(conditions))
	rows, err := db.Query(ctx, sql, values...)
	if err != nil {
		return nil, fmt.Errorf("was fetching todos: %w", err)
	}
	res, err := pgx.CollectRows[*model.TodoDatabase](rows, pgx.RowToAddrOfStructByName)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrResourceDoesNotExist
		}
		return nil, fmt.Errorf("was collecting rows: %w", err)
	}

	todos := make([]*model.Todo, len(res))
	for idx, v := range res {
		todos[idx] = v.GraphQLModel()
	}

	return todos, nil
}

// Fetches a single todo given an id
func FetchTodo(ctx context.Context, db *pgxpool.Pool, id string, excludeDeleted bool) (*model.Todo, error) {
	conditions := []string{"id = $1"}
	if excludeDeleted {
		conditions = append(conditions, "deleted_at is null")
	}

	sql := fmt.Sprintf(`select %s from todo %s`, model.TodoDatabase{}.ColumnStatement(), util.BuildConditions(conditions))
	rows, err := db.Query(ctx, sql, id)
	if err != nil {
		return nil, fmt.Errorf("was fetching todo: %w", err)
	}
	res, err := pgx.CollectExactlyOneRow[*model.TodoDatabase](rows, pgx.RowToAddrOfStructByName)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrResourceDoesNotExist
		}
		return nil, fmt.Errorf("was collecting rows: %w", err)
	}

	return res.GraphQLModel(), nil
}

// Creates a new todo
func CreateTodo(ctx context.Context, db *pgxpool.Pool, input model.CreateTodoInput) (*model.Todo, error) {
	sql := fmt.Sprintf(`insert into todo (name, description, due_date) VALUES ($1, $2, $3) returning %s`, model.TodoDatabase{}.ColumnStatement())
	rows, err := db.Query(ctx, sql, input.Name, input.Description, input.DueDate)
	if err != nil {
		return nil, fmt.Errorf("was creating new todo: %w", err)
	}

	res, err := pgx.CollectExactlyOneRow[*model.TodoDatabase](rows, pgx.RowToAddrOfStructByName)
	if err != nil {
		return nil, fmt.Errorf("was collecting rows: %w", err)
	}

	return res.GraphQLModel(), nil
}

// Updates a single todo by id
func UpdateTodo(ctx context.Context, db *pgxpool.Pool, id string, input model.UpdateTodoInput) (*model.Todo, error) {
	updates := []string{
		"updated_at = current_timestamp",
	}
	var values []any
	count := 1

	if input.Name != nil {
		updates = append(updates, newUpdate("name", count))
		values = append(values, *input.Name)
		count++
	}

	if input.Description.IsSet() {
		updates = append(updates, newUpdate("description", count))
		values = append(values, input.Description.Value())
		count++
	}

	if input.DueDate.IsSet() {
		updates = append(updates, newUpdate("due_date", count))
		values = append(values, input.DueDate.Value())
		count++
	}

	if input.IsArchived != nil {
		updates = append(updates, newUpdate("is_archived", count))
		values = append(values, *input.IsArchived)
		count++
	}

	if input.Status != nil {
		updates = append(updates, newUpdate("status", count))
		values = append(values, strings.ToLower(input.Status.String()))
		count++
	}

	if len(values) == 0 {
		return nil, nil
	}

	values = append(values, id)
	sql := fmt.Sprintf(`update todo set %s WHERE id = $%d returning %s`, strings.Join(updates, ","), count, model.TodoDatabase{}.ColumnStatement())
	rows, err := db.Query(ctx, sql, values...)
	if err != nil {
		return nil, fmt.Errorf("was updating todo: %w", err)
	}

	res, err := pgx.CollectExactlyOneRow[*model.TodoDatabase](rows, pgx.RowToAddrOfStructByName)
	if err != nil {
		return nil, fmt.Errorf("was collecting rows: %w", err)
	}

	return res.GraphQLModel(), nil
}

func newUpdate(column string, count int) string {
	return fmt.Sprintf("%s = $%d", column, count)
}

func DeleteTodo(ctx context.Context, db *pgxpool.Pool, id string) (*model.Todo, error) {
	sql := fmt.Sprintf(`update todo set deleted_at = current_timestamp where id = $1 returning %s`, model.TodoDatabase{}.ColumnStatement())
	rows, err := db.Query(ctx, sql, id)
	if err != nil {
		return nil, fmt.Errorf("was deleting todo: %w", err)
	}

	res, err := pgx.CollectExactlyOneRow[*model.TodoDatabase](rows, pgx.RowToAddrOfStructByName)
	if err != nil {
		return nil, fmt.Errorf("was collecting rows: %w", err)
	}

	return res.GraphQLModel(), nil
}
