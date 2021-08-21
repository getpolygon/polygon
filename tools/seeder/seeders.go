package main

import (
	"context"
	"fmt"

	"github.com/bxcodec/faker/v3"
	pgx "github.com/jackc/pgx/v4"
)

type User struct {
	ID        string `faker:"-"`
	Cover     string `faker:"url"`
	Avatar    string `faker:"url"`
	Bio       string `faker:"sentence"`
	Password  string `faker:"password"`
	LastName  string `faker:"last_name"`
	FirstName string `faker:"first_name"`
	Email     string `faker:"email,unique"`
	Username  string `faker:"username,unique"`
}

type Post struct {
	Body   string `faker:"sentence"`
	UserID string `faker:"-"`
}

func SeedUsersFunc(conn *pgx.Conn) {
	fmt.Println(`Seeding "users" started`)

	for i := 0; i < 100; i++ {
		u := User{}
		fakerErr := faker.FakeData(&u)

		if fakerErr != nil {
			fmt.Println("Faker error")
			return
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
				return
			}
		}
	}

	fmt.Println(`Seeding "users" was successful`)
}

func SeedPostsFunc(conn *pgx.Conn) {
	fmt.Println(`Seeding "posts" started`)

	if rows, err := conn.Query(context.Background(), `
    SELECT id FROM users;
  `); err != nil {
	} else {
		var tmp User
		var users []User
		defer rows.Close()

		for rows.Next() {
			rows.Scan(&tmp.ID)
			users = append(users, tmp)
		}

		if rows.Err() != nil {
			fmt.Println(`Seeding "posts" was unsuccessful`)
			return
		}

		for i := range users {
			post := Post{}
			user := users[i]
			fakerErr := faker.FakeData(&post)

			if fakerErr != nil {
				fmt.Println("Faker error")
				return
			}

			_, insertErr := conn.Exec(context.Background(), `
          INSERT INTO posts (
            body,
            user_id
          ) VALUES ($1, $2);
      `, post.Body, user.ID)

			if insertErr != nil {
				fmt.Printf(`Failed to insert post %v\n`, i)
				return
			}
		}
	}

	fmt.Println(`Seeding "posts" was successful`)
}

func SeedAll(conn *pgx.Conn) {
	SeedUsersFunc(conn)
	SeedPostsFunc(conn)
}
