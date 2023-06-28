const Album = require('../models/album_model');
const Song = require('../models/song_model');
const createError = require('http-errors');
const debug = require('debug')('app:module-register-song-services');

const getSongsAlbum = async ( id_album ) => {
    let album = await Album.findOne( { "_id" : id_album });
    if ( !album )
        throw new createError(400, `Error! El album ${id_album} no existe`);
    let songs = await Album.findById(id_album).select( { title:1, songs:1 } );
    return songs;
}

const registerSong = async (id_album, id_song) => {
    let song = await Song.findOne( { "_id" : id_song } );
    let album = await Album.findOne( { "_id": id_album});
    if ( !album )
        throw new createError(400, `Error! el album ${id_album} no existe`);
    if ( !song )
        throw new createError(400, `Song ${id_song} doesn't exist`);
    let result = await Album.updateOne ( { "_id" : id_album }, {
        $addToSet: {
            songs: id_song
        }
    })
    if ( !result.modifiedCount )
        throw new createError(400, `La canción ${id_song} se agregoal album ${id_album}`);
    album = await Album.findOne( { "_id": id_album});
    return album;
}

const removeSong = async  ( id_album, id_song ) => {
    let song = await Song.findOne( { "_id" : id_song } );
    let album = await Album.findOne( { "_id": id_album});
    if ( !album )
        throw new createError(400, `Error! El album ${id_album} no existe`);
    if ( !song )
        throw new createError(400, `La canción ${id_song} no existe`);
    let result = await Album.updateOne ( { "_id" : id_album }, {
        $pullAll: {
            songs: [ id_song ]
        }
    })
    if ( !result.modifiedCount )
        throw new createError(400, `La canción ${id_song} no se encuentra en el album ${id_album}`);
    return album;
}

module.exports.RegisterSongService = {
    getSongsAlbum,
    registerSong,
    removeSong
};