import Realm from 'realm';
export const PLAYLISTS_SCHEMA = 'PlayLists';
export const TRACKS_SCHEMA = 'Track';

// モデルとそのプロパティを定義
export const TrackSchema = {
  name: TRACKS_SCHEMA,
  primaryKey: 'id',
  properties: {
      id: 'int', // Primary key is not auto-increment
      playlistKey: 'string',
      type: 'string', // これがないとエラー
      albumTitle: 'string',
      title: 'string',
      artist: 'string',
      albumArtUrl: 'string',
      audioUrl: 'string',
  }
};

export const TodoListSchema = {
  name: PLAYLISTS_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    creationDate: 'date',
    playlist: { type: 'list', objectType: TRACKS_SCHEMA },
  }
};

const databaseOptions = {
  path: 'musicPlayListApp.realm',
  schema: [TodoListSchema, TrackSchema], // スキーマはここに追加
  schemaVersion: 0, // optional
};







export const insertNewTrack = playlist => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      realm.create(PLAYLISTS_SCHEMA, playlist);
      resolve(playlist);
    });
  }).catch((error) => reject(error));
});







// resolveは「Success」、rejectは「Failed」
export const insertNewTodoList = newTodoList => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      realm.create(PLAYLISTS_SCHEMA, newTodoList);
      resolve(newTodoList);
    });
  }).catch((error) => reject(error));
});



export const updateTodoList = playLists => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let updatingTodoList = realm.objectForPrimaryKey(PLAYLISTS_SCHEMA, playLists.id);

      // 必要に応じて他のフィールドを更新することができます
      updatingTodoList.name = playLists.name;
      resolve();
    });
  }).catch((error) => reject(error));
});



export const deleteTodoList = playlistId => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let deletingTodoList = realm.objectForPrimaryKey(PLAYLISTS_SCHEMA, playlistId);

      // Delete 'playLists' => delete 'todos' of 'playLists' / 'playLists'の 'todos'を削除する
      realm.delete(deletingTodoList.todos);
      realm.delete(deletingTodoList);
      resolve();
    });
  }).catch((error) => reject(error));
});



export const deleteAllTodoLists = () => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {

      // TodoList tableのすべてのレコードを取得
      let allTodoLists = realm.objects(PLAYLISTS_SCHEMA);

      // Delete'playLists' => delete 'todos' of 'playLists'
      for (let index in allTodoLists) {
        let eachTodoLists = allTodoLists[index];
        realm.delete(eachTodoLists.todos);
      }
      realm.delete(allTodoLists);
      resolve();
    });
  }).catch((error) => reject(error));
});



export const queryAllTodoLists = () => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let allTodoLists = realm.objects(PLAYLISTS_SCHEMA);
    resolve(allTodoLists);
  }).catch((error) => reject(error));
});


// プレイリスト詳細ページの選択したリストIDをサーチ
export const queryActiveTrak = (playlistDetailId) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let targetTrak = realm.objects(TRACKS_SCHEMA)
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



// 検索機能
export const filterTodoLists = (searchedText) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let filteredTodoLists = realm.objects(PLAYLISTS_SCHEMA)
      // Like:name like %abc% in 'SQL'
      .filtered(`name CONTAINS[c] "${searchedText}"`);

    resolve(filteredTodoLists);
  }).catch((error) => {
    reject(error);
  });
});



// 既存のTodoListにTodosの配列を追加する / Add array of Todos to an existing TodoList
export const insertTodos2TodoList = (playlistId, newTodos) => new Promise((resolve, reject) => {

  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let playLists = realm.objectForPrimaryKey(PLAYLISTS_SCHEMA, playlistId);
    realm.write(() => {

      // Realmデータベースに「todos」の配列を追加する / Add an array of 'todos to Realm database
      for (let index in newTodos) {
        playLists.todos.push(newTodos[index]);
      }

      resolve(newTodos);
    });
  }).catch((error => {
    reject(error);
  }));
});



// // クリックしたプレイリストIDをわたす
export const getPlaylistsTrack = (playlistId) => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    let playLists = realm.objectForPrimaryKey(PLAYLISTS_SCHEMA, playlistId);
      resolve(playLists.todos);
  }).catch((error) => {
      reject(error);
  });
});



export const setPlaylistsData = playLists => new Promise((resolve, reject) => {
  // Realmオブジェクトを作成してローカルDBに保存
  Realm.open(databaseOptions).then(realm => {
    realm.write(() => {
      let updatingPlayLists = realm.objectForPrimaryKey(PLAYLISTS_SCHEMA, playLists.id);

      // 必要に応じて他のフィールドを更新することができます
      updatingPlayLists.name = playLists.playlist.title;
      resolve();
    });
  }).catch((error) => reject(error));
});





export default new Realm(databaseOptions);