async function newPlaylistHandler(event) {
    event.preventDefault();

    const response = await fetch('/generate');

    if (response.ok) {
        document.location.replace('/playlists')
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.btn').addEventListener('click', newPlaylistHandler);