/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

//backend route to fetch a building
const Building = require("./models/Building");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// GET /api/random-building
router.get("/random-building", async (req, res) => {
  try {
    const count = await Building.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const building = await Building.findOne().skip(randomIndex);

    res.send(building);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error fetching building" });
  }
});
// POST /api/game/finish
router.post("/game/finish", auth.ensureLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const { guessesThisGame } = req.body;

    if (typeof guessesThisGame !== "number") {
      return res.status(400).send({ error: "Invalid guess count" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ error: "User not found" });

    user.totalAttempts += 1;
    user.totalGuesses += guessesThisGame;

    await user.save();

    const average = user.totalAttempts === 0 ? 0 : user.totalGuesses / user.totalAttempts;

    res.send({
      totalAttempts: user.totalAttempts,
      totalGuesses: user.totalGuesses,
      averageGuesses: average,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error updating stats" });
  }
});
// GET /api/profile/stats
router.get("/profile/stats", auth.ensureLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ error: "User not found" });

    const average = user.totalAttempts === 0 ? 0 : user.totalGuesses / user.totalAttempts;

    res.send({
      totalAttempts: user.totalAttempts,
      totalGuesses: user.totalGuesses,
      averageGuesses: average,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error fetching stats" });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
