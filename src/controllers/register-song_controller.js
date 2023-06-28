const createError = require('http-errors');
const debug = require('debug')('app:module-register-song-controller');

const { RegisterSongService } = require('../services/register-song_service');
const { Response } = require('../common/response');

module.exports.RegisterSongController = {
    getTest: (req, res) => {
        let { params: { id_album } } = req;
        let result = RegisterSongService.getSongsAlbum( id_album );
        result
            .then( songs => {
                Response.success(res, 201, `Album's ${id_album} canciones`, songs);
            })
            .catch( error => {
                debug( error );
                Response.error(res, error);
            })
    },
    addSong: (req, res) => {
        let { params: { id_album, id_song } } = req;
        let result = RegisterSongService.registerSong( id_album, id_song );
        result
            .then( album => {
                Response.success(res, 201, 'Canción agregada al album', album);
            })
            .catch( error => {
                debug( error );
                Response.error(res, error);
            })
    },
    removeSong: (req, res) => {
        let { params: { id_album, id_song } } = req;
        let result = RegisterSongService.removeSong( id_album, id_song );
        result
            .then( album => {
                Response.success(res, 201, 'Canción eliminada del album', album);
            })
            .catch( error => {
                debug( error );
                Response.error(res, error);
            })
    }
}