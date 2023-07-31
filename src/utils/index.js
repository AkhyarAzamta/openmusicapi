/* eslint-disable camelcase */

const mapDBToModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    inserted_at,
    updated_at,
    album_id,
    username,
    name,
    owner,
    playlist_id,
    song_id,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: inserted_at,
    updatedAt: updated_at,
    albumId : album_id,
    username,
    name,
    owner,
    playlistId: playlist_id,
    songId: song_id,
});

module.exports = { mapDBToModel };
