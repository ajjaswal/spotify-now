const router = require("express").Router();
const { User, Playlist } = require("../../models");
const sequelize = require("../../config/connection");

// get all playlists
router.get("/", (req, res) => {
    Playlist.findAll({

    })
        .then((dbPlaylistData) => res.json(dbPlaylistData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get("/:id", (req, res) => {
    Playlist.findByPk(req.params.id, {
 
    })
        .then((dbPlaylistData) => {
            if (!dbPlaylistData) {
                res.status(404).json({ message: "no playlist found with that id" });
                return;
            }
            res.json(dbPlaylistData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post("/", (req, res) => {
    Playlist.create({
        username: req.body.username,
        link: req.body.link
        })
        .then((dbPlaylistData) => res.json(dbPlaylistData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete("/:id", (req, res) => {
    Playlist.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((dbPlaylistData) => {
            if (!dbPlaylistData) {
                res.status(404).json({ message: "no playlist found with that id" });
                return;
            }
            res.json(dbPlaylistData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
