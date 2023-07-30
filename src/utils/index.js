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
    username,
    name,
    owner,
    playlistId: playlist_id,
    songId: song_id,
});

module.exports = { mapDBToModel };
