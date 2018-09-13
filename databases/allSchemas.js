import Realm from 'realm';
export const CATEGORIES_FRAMUALBUM_SCHEMA = 'CategoriesFramuAlbum';
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
      update_at: 'string' // 更新日
  }
};

// 中間テーブル
export const CategoriesFramuAlbumSchema = {
  name: CATEGORIES_FRAMUALBUM_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    song_id: { type: 'list', objectType: SONG_SCHEMA },
    playlist_id: { type: 'list', objectType: PLAYLIST_SCHEMA },
  }
};


export const SongSchema = {
  name : SONG_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
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
  }
};


export const PlaylistListSchema = {
  name: PLAYLIST_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int', // プレイリストID
    type: 'string', // これがないとエラー
    playlist_title: 'string', // プレイリストタイトル
    created_at: 'date', // 作成日
    update_at: 'date', // 更新日
  }
};


const databaseOptions = {
  path: 'musicPlayListApp.realm',
  schema: [PlaylistListSchema, SongSchema, CategoriesFramuAlbumSchema], // スキーマはここに追加
  schemaVersion: 0, // optional
};


/* =================================================================
* ダウンロードしたアルバムデータをRealmへ保存
================================================================= /*

/* saveNewSong
 --------------------------------------------- */
//  export const saveNewSong = track => new Promise((resolve, reject) => {
//   // Realmオブジェクトを作成してローカルDBに保存
//   Realm.open(databaseOptions).then(realm => {

//     realm.write(() => {
//       realm.create(SONG_SCHEMA, track);
//       resolve(track);
//     });
//   }).catch((error) => reject(error));
// });



export const saveNewSong = (track) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {

    realm.write(() => {
      realm.create(SONG_SCHEMA, track)
      resolve();
    });

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


/* insertNewTodoList
 * resolveは「Success」、rejectは「Failed」
 --------------------------------------------- */
export const insertNewTodoList = newTodoList => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      realm.create(PLAYLIST_SCHEMA, newTodoList);
      resolve(newTodoList);
    });
  }).catch((error) => reject(error));
});


/* updateTodoList
 --------------------------------------------- */
export const updateTodoList = playLists => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let updatingTodoList = realm.objectForPrimaryKey(PLAYLIST_SCHEMA, playLists.id);

      // 必要に応じて他のフィールドを更新することができます
      updatingTodoList.name = playLists.name;
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


/* queryActiveTrak
 * プレイリスト詳細ページの選択したリストIDをサーチ
 --------------------------------------------- */
export const queryActiveTrak = (playlistDetailId) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let targetTrak = realm.objects(TRACK_SCHEMA)
      // Like:name like %abc% in 'SQL'
      // .filtered('id = 1536139059');
      // .filtered(`id = ${playlistDetailId}`);
      // .filtered('id == $0', playlistDetailId);

      .filtered('playlistKey == $0', playlistDetailId);

    resolve(targetTrak);
  }).catch((error) => {
    reject(error);
  });
});




export default new Realm(databaseOptions);