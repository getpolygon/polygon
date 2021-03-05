# API Documentation

## Posts API

GET - `/api/posts/fetch` - Used for fetching posts

PUT - `/api/posts/create` - Used for creating a post

PUT - `/api/posts/save/?postId=POST_ID` - Used for saving posts

PUT - `/api/posts/heart/?postId=POST_ID` -
Used for hearting a post

DELETE - `/api/posts/delete/?postId=POST_ID` - Used for deleting a post

PUT - `/api/posts/unheart/?postId=POST_ID` - Used for unhearting a post

POST - `/api/posts/comments/create/?postId=POST_ID` - Used for creating a comment on a post

## Account API

GET - `/api/accounts/fetch` - Used for fetching account details

DELETE - `/api/accounts/delete` - Used for deleting current account

PUT - `/api/accounts/update` - Used for updating/making changes to current Account

## Friends API

PUT - `/api/friends/add/?accountId=ACCOUNT_ID` - Used for adding friends

GET - `/api/friends/check/?accountId=ACCOUNT_ID` - Used for checking current friendship status

## Search API

GET - `/api/search/?query=SEARCH_TERM` - Used for search
