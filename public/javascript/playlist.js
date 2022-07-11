async function newPlaylistHandler(event) {
    // event.preventDefault();

    document.location.replace('/playlists/')
};

document.querySelector('.btn').addEventListener('click', newPlaylistHandler);