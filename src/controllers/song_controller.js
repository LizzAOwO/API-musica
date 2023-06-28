const createError = require('http-errors');
const debug = require('debug')('app:module-song-controller');

const { SongService } = require('../services/song_services');
const { Response } = require('../common/response');

module.exports.SongController = {
    getSongs: (req, res) => {
        let result = SongService.getSongs();
        result
            .then( songs => {
                Response.success(res, 200, 'Lista de canciones:', songs);
            } )
            .catch( error => {
                debug( error );
                Response.error(res);
            });
    },
    getSong: (req, res) => {
        let { params : { id } } = req;
        let result = SongService.getById( id );
        result
            .then( song => {
                Response.success(res, 200, 'Canción', song);
            })
            .catch( error => {
                debug( error );
                Response.error(res, error);
            });
    },
    createSong: (req, res) => {
        let { body } = req;
        let { title, track_number, length } = body;
        const { error, value } = SongService.schema.validate({
            title,
            track_number,
            length
        });
        if ( !error ){
            let result = SongService.createSong( value );
            result
                .then( song => {
                    Response.success(res, 201, 'Canción agregada', song);
                })
                .catch( error => {
                    debug( error );
                    Response.error(res);
                })
        }
        else {
            debug( error );
            Response.errorJoi( res, 400, error );
        }
    },
    updateSong: (req, res) => {
        const { body } = req;
        const { title, track_number, length } = body;
        const { params : { id } } = req;
        const { error, value } = SongService.schema.validate({
            title,
            track_number,
            length
        });
        if ( !error ) {
            let result = SongService.updateSong( id, value );
            result
                .then( song => {
                    Response.success(res, 200, 'Canción modificada', song)
                })
                .catch( error => {
                    debug(error);
                    Response.error(res, error);
                })
        }
        else {
            debug( error );
            Response.errorJoi(res, 400, error);
        }
    },
    deleteSong: (req, res) => {
        const { params : { id }} = req;
        const result = SongService.deleteSong( id );
        result
            .then( song => {
                song
                    ? Response.success(res, 200, 'Canción eliminadas', song)
                    : Response.error(res, new createError.NotFound);
            })
            .catch( error => {
                debug( error );
                Response.error(res, error);
            });
    }
}