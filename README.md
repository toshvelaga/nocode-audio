# [Nocode Audio Player](https://audioplayr.netlify.app/)

<img width="1113" alt="Screen Shot 2022-04-13 at 5 08 10 AM" src="https://user-images.githubusercontent.com/38474161/163168339-a5d6418d-75b0-4782-abfa-2532abd0d201.png">

Create a customizable audio player that you can embed in your own website. Check out how it will look embedded on your site [HERE](https://codepen.io/santhoshvelaga/pen/oNpPRmo).

## Tech/framework used

Frontend tech stack:

- React JS
- CSS
- React Router v6
- [React Icons](https://react-icons.github.io/react-icons/)
- Vite

Backend tech stack:

- Node
- Express
- PostgresSQL
- AWS SDK

Frontend is hosted on Netlify. Backend is hosted on AWS EC2 instance.

Production site is deployed to [https://audioplayr.netlify.app/](https://audioplayr.netlify.app/)

## Installation

To run the client side code use the following commands:

```
$ cd client
$ npm install
$ npm run dev
```

Before running the server side code be sure that you have added your AWS and postgres credentials to the .env file.

```
$ cd server
$ touch .env
$ cp .env.example .env
$ npm install
$ nodemon index.js
```

## Contribute

Feel free to use code however you would like.

If you have any questions feel free to email me at toshvelaga@gmail.com

## License

MIT © Tosh Velaga

```

```
