package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"
	"os"
	"todoserver/graph"
	"todoserver/resolver"

	"github.com/go-chi/httplog/v2"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {
	logger := httplog.NewLogger("todo", httplog.Options{
		LogLevel:         slog.LevelInfo,
		Concise:          true,
		MessageFieldName: "message",
	})

	router := chi.NewRouter()
	router.Use(httplog.RequestLogger(logger))
	router.Use(cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
	}).Handler)
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	ctx := context.Background()

	cfg, err := pgxpool.ParseConfig(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	err = pool.Ping(ctx)
	if err != nil {
		log.Fatal(err)
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &resolver.Resolver{Database: pool}}))
	router.Handle("/", playground.ApolloSandboxHandler("GraphQL playground", "/graphql"))
	router.Handle("/graphql", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
