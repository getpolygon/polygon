package main

import (
	"context"
	"fmt"

	"github.com/bxcodec/faker/v3"
	pgx "github.com/jackc/pgx/v4"
)

type User struct {
	Cover     string `faker:"url"`
	Avatar    string `faker:"url"`
	Bio       string `faker:"sentence"`
	Password  string `faker:"password"`
	LastName  string `faker:"last_name"`
	FirstName string `faker:"first_name"`
	Email     string `faker:"email,unique"`
	Username  string `faker:"username,unique"`
}

func SeedUsersFunc(conn *pgx.Conn) {
	fmt.Println(`Seeding "users" started`)

	for i := 0; i < 100; i++ {
		u := User{}
		fakerErr := faker.FakeData(&u)

		if fakerErr != nil {
			panic(fakerErr)
		} else {
			_, err := conn.Exec(context.Background(), `
				INSERT INTO users (
					bio,
					email,
					cover,
					avatar,
					password,
					username,
					last_name,
					first_name
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
			`,
				u.Bio,
				u.Email,
				u.Cover,
				u.Avatar,
				u.Password,
				u.Username,
				u.LastName,
				u.FirstName,
			)
			if err != nil {
				fmt.Printf("Failed to insert user %v\n", i)
				panic(err)
			}
		}
	}

	fmt.Println(`Seeding "users" was successfull`)
}

func SeedAll(conn *pgx.Conn) {
	SeedUsersFunc(conn)
}
