/* eslint-disable camelcase */
const mapAlbumDBToModel = ({
    album_id,
    name,
    year,
}) => ({
    id: album_id,
    name,
    year,
});

const mapSongsDBToModel = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id,
}) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId: album_id,
});

module.exports = { mapAlbumDBToModel, mapSongsDBToModel };