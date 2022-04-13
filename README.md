# Nocode Audio Player

Customize the audio player to your liking. You can edit the player's appearance and then embed the iframe in your own website.

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

Before running the server side code, create a .env file with the values from .env.example. Then run the following commands:

```
$ cd server
$ npm install
$ nodemon index.js
```

## Contribute

Feel free to use code however you would like.

If you have any questions feel free to email me at toshvelaga@gmail.com

## License

MIT © Tosh Velaga
