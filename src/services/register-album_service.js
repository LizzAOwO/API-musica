const Album = require('../models/album_model');
const Singer = require('../models/singer_model');
const createError = require('http-errors');
const debug = require('debug')('app:module-register-album-services');

const getAlbumsSinger = async ( id_singer ) => {
    let singer = await Singer.findOne( { "_id" : id_singer });
    if ( !singer )
        throw new createError(400, `El cantante ${id_singer} no existe`);
    let albums = await Singer.findById(id_singer).select( { artistic_name:1, albums:1 } );
    return albums;
}

const registerAlbum = async (id_singer, id_album) => {
    let singer = await Singer.findOne( { "_id" : id_singer } );
    let album = await Album.findOne( { "_id": id_album});
    if ( !singer )
        throw new createError(400, `El cantante ${id_singer} no existe`);
    if ( !album )
        throw new createError(400, `El album ${id_album} no existe`);
    let result = await Singer.updateOne ( { "_id" : id_singer }, {
        $addToSet: {
            albums: id_album
        }
    })
    if ( !result.modifiedCount )
        throw new createError(400, `El album ${id_album} se registro para el cantante ${id_singer}`);
    singer = await Singer.findOne( { "_id" : id_singer } );
    return singer;
}

const removeAlbum = async (id_singer, id_album) => {
    let singer = await Singer.findOne( { "_id" : id_singer } );
    let album = await Album.findOne( { "_id": id_album});
    if ( !singer )
        throw new createError(400, `El cantante ${id_singer} no existe`);
    if ( !album )
        throw new createError(400, `El album ${id_album} no existe`);
    let result = await Singer.updateOne ( { "_id" : id_singer }, {
        $pullAll: {
            albums: [ id_album ]
        }
    })
    if ( !result.modifiedCount )
        throw new createError(400, `El album ${id_album} no existe en el cantante ${id_singer}`);
    return singer;
}

module.exports.RegisterAlbumService = {
    getAlbumsSinger,
    registerAlbum,
    removeAlbum
};