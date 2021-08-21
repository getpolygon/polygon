package main

import (
	"context"
	"fmt"
	"os"
	"strconv"

	pgx "github.com/jackc/pgx/v4"
)

type Seeder struct {
	Name string
	ID   int
}

// Seeder commands
var Seeders = []Seeder{
	{
		ID:   0,
		Name: "all",
	},
	{
		ID:   1,
		Name: "users",
	},
	{
		ID:   2,
		Name: "posts",
	},
}

// A function that will return a nice list of all the seed commands
func formatSeeders() string {
	var formatted string

	for i := range Seeders {
		seeder := Seeders[i]
		// Creating the formatted text
		formatted += seeder.Name + ": " + strconv.Itoa(seeder.ID)

		// Add a nice separator for every item that is not the last one
		if i < len(Seeders)-1 {
			formatted += ", "
		}
	}

	return formatted
}

func main() {
	var input int

	fmt.Printf("Enter the number of the seeder from this list to execute: (%v)\n> ", formatSeeders())
	// Get the input from the user
	fmt.Scanln(&input)

	// Connecting to the database
	dbConn, dbErr := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if dbErr != nil {
		panic(dbErr)
	}

	switch input {
	case 0:
		SeedAll(dbConn)
	case 1:
		SeedUsersFunc(dbConn)
	case 2:
		SeedPostsFunc(dbConn)
	default:
		fmt.Fprintln(os.Stderr, "No matching command found")
	}
}
