import Realm from 'realm';
export const PLAYLIST_SONG_SCHEMA = 'PlayListSong';
export const SONG_SCHEMA = 'Song';
export const PLAYLIST_SCHEMA = 'PlayList';

export const TRACK_SCHEMA = 'Track';

// モデルとそのプロパティを定義
export const TrackSchema = {
  name: TRACK_SCHEMA,
  primaryKey: 'id',
  properties: {
      id: 'int',
      playlist_id: 'string', // プレイリストID
      type: 'string', // これがないとエラー
      playlist_title: 'string', // プレイリストタイトル
      created_at: 'string', // 作成日
      update_at: 'string', // 更新日
  }
};

// 中間テーブル
export const PlayListSong = {
  name: PLAYLIST_SONG_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    owner_song: 'Song[]',
    owner_playlist: 'PlayList[]',
  }
};


export const SongSchema = {
  name : SONG_SCHEMA,
  primaryKey: 'song_id',
  properties: {
    song_id: 'string', // 曲ID
    song: 'string',
    title: 'string', // 曲名
    title_sort: 'string', // 曲名（ソート）
    album: 'string', // アルバム名
    album_sort: 'string', // アルバム名（ソート）
    album_artist: 'string', // アルバムアーティスト
    album_artist_sort: 'string', // アルバムアーティスト（ソート）
    artist: 'string', // アーティスト名
    artist_sort: 'string', // アーティスト名（ソート）
    composer: 'string', // 作曲者
    composer_sort: 'string', // 作曲者（ソート）
    genre: 'string', // ジャンル
    release_year: 'date',
    last_add_at: 'date', // 最後に追加した日
    last_play_at: 'date', // 最後に再生した日
    primary_artwork: 'string',
    secondary_artwork: 'string',

    owner_song_in: { type: 'linkingObjects', objectType: PLAYLIST_SONG_SCHEMA, property: 'owner_song'},

  }
};


export const PlayListSchema = {
  name: PLAYLIST_SCHEMA,
  primaryKey: 'playlist_id',
  properties: {
    playlist_id: 'int', // プレイリストID
    type: 'string', // これがないとエラー
    playlist_title: 'string', // プレイリストタイトル
    created_at: 'date', // 作成日
    update_at: 'date', // 更新日

    owner_playlist_in: { type: 'linkingObjects', objectType: PLAYLIST_SONG_SCHEMA, property: 'owner_playlist'},

  }
};


const databaseOptions = {
  path: 'musicPlayListApp.realm',
  schema: [PlayListSchema, SongSchema, PlayListSong], // スキーマはここに追加
  schemaVersion: 0, // optional
};


const randomNum = () => {
  const len = 8;
  const num = '0123456789';

  const numLen = num.length;
  let result = '';

  for(let i = 0; i < len; i++){
    result += num[Math.floor(Math.random() * numLen)];
  }

  return result;
};


/* =================================================================
* ダウンロードしたアルバムデータをRealmへ保存
================================================================= /*

/* saveNewSong
 --------------------------------------------- */
export const saveNewSong = (track, index) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    for(var i = 0; i <= index; i++){
      realm.write(() => {
        realm.create(SONG_SCHEMA, track, true)
        resolve();
      });
    }

  }).catch((error) => reject(error));
});


/* =================================================================
* プレイリストページの設定
================================================================= /*

/* insertNewTrack
 --------------------------------------------- */
export const insertNewTrack = playlist => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {

    realm.write(() => {
      realm.create(PLAYLIST_SCHEMA, playlist);
      resolve(playlist);
    });
  }).catch((error) => reject(error));
});


/* insertNewPlayList
 * resolveは「Success」、rejectは「Failed」
 --------------------------------------------- */
export const insertNewPlayList = insertPlayListItem => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      realm.create(PLAYLIST_SCHEMA, insertPlayListItem);
      resolve(insertPlayListItem);
    });
  }).catch((error) => reject(error));
});


/* updatePlayListTitle
 --------------------------------------------- */
export const updatePlayListTitle = (playLists) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let updatingPlayList = realm.objectForPrimaryKey(PLAYLIST_SCHEMA, playLists.playlist_id);

      // 必要に応じて他のフィールドを更新することができます
      updatingPlayList.playlist_title = playLists.playlist_title;
      resolve();
    });
  }).catch((error) => reject(error));
});


/* deletePlayList
 --------------------------------------------- */
export const deletePlayList = playlistId => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let deletingTodoList = realm.objectForPrimaryKey(PLAYLIST_SCHEMA, playlistId);

      // Delete 'playLists' => delete 'playlist' of 'playLists' / 'playLists'の 'playlist'を削除する
      // realm.delete(deletingTodoList.playlist);
      realm.delete(deletingTodoList);
      resolve();
    });
  }).catch((error) => reject(error));
});


/* deleteAllTodoLists
 --------------------------------------------- */
export const deleteAllTodoLists = () => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {

      // TodoList tableのすべてのレコードを取得
      let allTodoLists = realm.objects(PLAYLIST_SCHEMA);

      // Delete'playLists' => delete 'playlist' of 'playLists'
      for (let index in allTodoLists) {
        let eachTodoLists = allTodoLists[index];
        realm.delete(eachTodoLists.playlist);
      }
      realm.delete(allTodoLists);
      resolve();
    });
  }).catch((error) => reject(error));
});


/* queryAllPlayLists
 --------------------------------------------- */
export const queryAllPlayLists = () => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let allTodoLists = realm.objects(PLAYLIST_SCHEMA);
    resolve(allTodoLists);
  }).catch((error) => reject(error));
});


/* filterPlayLists
 * 検索機能
 --------------------------------------------- */
export const filterPlayLists = (searchedText) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let filteredTodoLists = realm.objects(PLAYLIST_SCHEMA)
      // Like:name like %abc% in 'SQL'
      .filtered(`name CONTAINS[c] "${searchedText}"`);

    resolve(filteredTodoLists);
  }).catch((error) => {
    reject(error);
  });
});



/* =================================================================
* プレイリスト詳細ページの設定
================================================================= /*

/* insertTodos2TodoList
 --------------------------------------------- */
// 既存のTodoListにTodosの配列を追加する / Add array of Todos to an existing TodoList
export const insertTodos2TodoList = (playlistId, newTodos) => new Promise((resolve, reject) => {

  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let playLists = realm.objectForPrimaryKey(PLAYLIST_SCHEMA, playlistId);
    realm.write(() => {

      // Realmデータベースに「todos」の配列を追加する / Add an array of 'playlist to Realm database
      for (let index in newTodos) {
        playLists.playlist.push(newTodos[index]);
      }

      resolve(newTodos);
    });
  }).catch((error => {
    reject(error);
  }));
});


/* getPlaylistsTrack
 --------------------------------------------- */
// // クリックしたプレイリストIDをわたす
export const getPlaylistsTrack = (playlistId) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let playLists = realm.objectForPrimaryKey(PLAYLIST_SCHEMA, playlistId);
      resolve(playLists.playlist);
  }).catch((error) => {
      reject(error);
  });
});


/* setPlaylistsData
 --------------------------------------------- */
export const setPlaylistsData = playLists => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let updatingPlayLists = realm.objectForPrimaryKey(PLAYLIST_SCHEMA, playLists.id);

      // 必要に応じて他のフィールドを更新することができます
      updatingPlayLists.name = playLists.playlist.title;
      resolve();
    });
  }).catch((error) => reject(error));
});


/* insertTrackItem
 --------------------------------------------- */
export const insertTrackItem = (playlistDetailId) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {

    let targetPlayList = realm.objectForPrimaryKey(PLAYLIST_SCHEMA, playlistDetailId);

    // realm.write(() => {
    //   const insertItem = {
    //       songId: Math.floor(new Date()), // 曲ID
    //       title: 'Good Goodbye', // 曲名
    //       titleSort: 'ぐっどぐっばい', // 曲名（ソート）
    //       album: '35xxxv', // アルバム名
    //       albumSort: '35xxxv', // アルバム名（ソート）
    //       albumArtist: 'ONE OK ROCK', // アルバムアーティスト
    //       albumArtistSort: 'ワンオクロック', // アルバムアーティスト（ソート）
    //       artist: 'ONE OK ROCK', // アーティスト名
    //       artist_sort: 'ワンオクロック', // アーティスト名（ソート）
    //       composer: 'Taka', // 作曲者
    //       composerSort: 'たか', // 作曲者（ソート）
    //       genre: 'ROCK', // ジャンル
    //       lastAddAt: new Date(), // 最後に追加した日
    //       lastPlayAt: new Date(), // 最後に再生した日
    //       albumArtPath: 'https://www.google.co.jp/',
    //       audioPath: 'https://www.google.co.jp/'
    //     };

    //   targetPlayList.playlist.push(insertItem);
    //   resolve();
    // });

  }).catch((error) => reject(error));
});


/* deleteTrackItem
 --------------------------------------------- */
export const deleteTrackItem = playlistKey => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let deletingTrackList = realm.objectForPrimaryKey(TRACK_SCHEMA, playlistKey);

      // Delete 'playLists' => delete 'playlist' of 'playLists' / 'playLists'の 'playlist'を削除する
      // realm.delete(deletingTrackList.playlist);
      realm.delete(deletingTrackList);
      resolve();
    });
  }).catch((error) => reject(error));
});


/* queryCategoriesFramuAlbum
 * 中間テーブルにプレイリストを追加
 --------------------------------------------- */
export const queryCategoriesFramuAlbum = (playlistDetailId) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存

  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let targetPlayList = realm.objects(PLAYLIST_SCHEMA)
        .filtered('playlist_id == $0', playlistDetailId);

      let targetSong = realm.objects(SONG_SCHEMA)
        .filtered('song_id == $0', 'wert5678cvbn');

      let categorieDate = {
        id: Number(randomNum()),
        owner_song: targetSong,
        owner_playlist: targetPlayList
      };

      realm.create(PLAYLIST_SONG_SCHEMA, categorieDate);
    resolve(targetSong);
    });
  }).catch((error) => {
    reject(error);
  });
});


/* insertPlayListState
 * プレイ詳細リストのstateに送るデータ
 --------------------------------------------- */
 export const insertPlayListState = (playlistDetailId) => new Promise((resolve, reject) => {

  Realm.open(databaseOptions).then(realm => {

    let songs = realm.objects(PLAYLIST_SONG_SCHEMA)
      .filtered('owner_playlist.playlist_id == $0', playlistDetailId);

    let song = '';
    let songDate = [];

    songs.forEach((song, index) => {
      // console.log(index);
      songDate.push(song.owner_song);
      // console.log(songDate);
      resolve(songDate);
    });

  }).catch((error) => reject(error));

});



export default new Realm(databaseOptions);