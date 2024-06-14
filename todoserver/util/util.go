package util

import (
	"strings"
)

func BuildConditions(cdns []string) string {
	switch len(cdns) {
	case 0:
		return ""
	case 1:
		return "WHERE " + cdns[0]
	default:
		var statement strings.Builder
		statement.WriteString("WHERE ")
		statement.WriteString(cdns[0])
		for _, s := range cdns[1:] {
			statement.WriteString(" AND ")
			statement.WriteString(s)
		}
		return statement.String()
	}
}
