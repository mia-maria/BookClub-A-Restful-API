# API

This is a web API following the theory of REST. It consists of an authorisation service and a book-club service.

# URIs

## Authorisation service

GET localhost:8080 Shows a welcome-message. Provides links to authorisation/register, authorisation/login and book-club/book-posts.
POST localhost:8080/register Registration for membership in the book-club. Provides links to authorisation/login and book-club/book-posts.
POST localhost:8080/login A member logs in and gets a access token. Provides links to book-club/book-posts and authorisation/register.

## Book-Club service

GET localhost:8080 Shows a welcome-message. Provides links to authorisation/register, authorisation/login and book-club/book-posts.
GET localhost:8080/book-posts Authorised members can read all created book-posts. Provides links to book-club/book-posts/register-webhook and book-club/book-posts/{{bookPostID}}
POST localhost:8080/book-posts Authorised members can create book-posts. Provides a link to book-club/book-posts/{{bookPostID}} where a member can read a specific book-post or update or delete their own book-posts.
PUT localhost:8080/book-posts/{{id}} An authorised member can update their own specific book-post.
PATCH localhost:8080/book-posts/{{id}} An authorised member can partially update their own specific book-post.
DELETE localhost:8080/book-posts/{{id}} An authorised member can delete their own specific book-post.
POST localhost:8080/book-posts/register-webhook Authorised members can register for a webhook in order to get information about newly created book-posts.