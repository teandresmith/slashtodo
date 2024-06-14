package model

import (
	"reflect"
	"slices"
	"strings"
	"time"
)

type TodoStatusEnum string

const (
	TodoStatusEnumOpen   TodoStatusEnum = "open"
	TodoStatusEnumClosed TodoStatusEnum = "closed"
)

type TodoDatabase struct {
	ID          string         `db:"id"`
	Name        string         `db:"name"`
	Status      TodoStatusEnum `db:"status"`
	Description *string        `db:"description"`
	DueDate     *time.Time     `db:"due_date"`
	IsArchived  bool           `db:"is_archived"`
	CreatedAt   time.Time      `db:"created_at"`
	UpdatedAt   time.Time      `db:"updated_at"`
	DeletedAt   *time.Time     `db:"deleted_at"`
}

func (d *TodoDatabase) GraphQLModel() *Todo {
	return &Todo{
		ID:          d.ID,
		Name:        d.Name,
		Description: d.Description,
		DueDate:     d.DueDate,
		Status:      TodoStatus(strings.ToUpper(string(d.Status))),
		IsArchived:  d.IsArchived,
		CreatedAt:   d.CreatedAt,
		UpdatedAt:   d.UpdatedAt,
		DeletedAt:   d.DeletedAt,
	}
}

// Gets all database columns and joins them together into a single
// string clause
func (d TodoDatabase) ColumnStatement() string {
	return strings.Join(d.Columns(), ",")
}

// Gets all database columns by looking up the value for each field's struct tag name `db`
func (d TodoDatabase) Columns() []string {
	return collectTags(d, "db", []string{"-", ""})
}

// Collect struct tag values using reflection. Takes in
// a non-pointer struct, a tag name and a slice of
// values that should be excluded
func collectTags(m any, tag string, exclude []string) []string {
	t := reflect.TypeOf(m)
	collected := make([]string, 0, t.NumField())
	for i := 0; i < t.NumField(); i++ {
		tagValue := t.Field(i).Tag.Get(tag)
		if slices.Contains(exclude, tagValue) {
			continue
		}

		collected = append(collected, tagValue)
	}
	return collected
}
