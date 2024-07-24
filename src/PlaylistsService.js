const { Pool } = require("pg");
require("dotenv").config();
class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    console.log(playlistId);
    const query = {
      text: `
        SELECT 
          p.id AS playlist_id,
          p.name AS playlist_name,
          s.id AS song_id,
          s.title AS song_title,
          s.performer AS song_performer
        FROM 
          playlists p
        JOIN 
          playlist_songs ps ON p.id = ps.playlist_id
        JOIN 
          songs s ON ps.song_id = s.id
        WHERE 
          p.id = $1
        ORDER BY 
          s.title; 
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("Playlist tidak berhasil ditemukan");
    }

    const playlistDetails = result.rows[0];
    const playlist = {
      playlist: {
        id: playlistDetails.playlist_id,
        name: playlistDetails.playlist_name,
        songs: result.rows.map((row) => ({
          id: row.song_id,
          title: row.song_title,
          performer: row.song_performer,
        })),
      },
    };

    return playlist;
  }
}

module.exports = PlaylistsService;
