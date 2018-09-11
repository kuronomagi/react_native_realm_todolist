
import AVFoundation
import MediaPlayer
import UIKit

@objc(Mp3GetAll)
class Mp3GetAll: UIViewController {
  @objc(getFile)
  func getFile() {
    print("GET ALL!!!")
    
  }
  
  @objc(viewDidLoad)
  override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view, typically from a nib.
    
    
    let albumsQuery = MPMediaQuery.albums()
//    guard let albums: [MPMediaItemCollection] = albumsQuery.collections else {
//      print("error")
//      return
//    }
    print(albumsQuery)
    if let albums = albumsQuery.collections {
      for album in albums {
        for song in album.items {

          // メディアアイテムの永続的な識別子
          guard let mediaId = song.value(forProperty:MPMediaItemPropertyPersistentID) else {
            continue
          }
          print("識別ID: \(mediaId)")
          

          
          // 楽曲のタイトル（メディアアイテムのタイトル）
          guard let title = song.value(forProperty:MPMediaItemPropertyTitle) else {
            continue
          }
          print("楽曲のタイトル: \(title)")
          
          
          // 『Live On Mars』などのアルバムのタイトルです。
          guard let alumTitle = song.value(forProperty:MPMediaItemPropertyAlbumTitle) else {
            continue
          }
          print("アルバムタイトル: \(alumTitle)")
          
          
          
          // メディアアイテムの演奏するアーティストです。
          // メディアアイテムに属する名前なので、アルバムの主要なアーティストと異なる場合があります。
          // 例えばアルバムのアーティストが『Joseph Fable featuring Thomas Smithson』で、アルバムのその内の一曲のアーティストは『Joseph Fable,』という場合です。
          guard let artist = song.value(forProperty:MPMediaItemPropertyArtist) else {
            continue
          }
          print("artist: \(artist)")
          
          
          
          // アルバムで主に演奏するアーティストです。
          guard let albumArtist = song.value(forProperty:MPMediaItemPropertyAlbumArtist) else {
            continue
          }
          print("アルバムアーティスト: \(albumArtist)")
          
          
          //ジャンル
          guard let genre = song.value(forProperty:MPMediaItemPropertyGenre) else {
            continue
          }
          print("ジャンル: \(genre)")
          
          
          //メディアアイテムのミュージカルの作曲家です。
          guard let composer = song.value(forProperty:MPMediaItemPropertyComposer) else {
            continue
          }
          print("作曲家: \(composer)")
          
          

          // アートワーク
          if let artwork = song.value(forProperty:MPMediaItemPropertyArtwork) as? MPMediaItemArtwork {
            
            // 画像を読み込んで表示させる
            // imageView.image = artwork.imageWithSize(artwork.bounds.size)
            
            print("アートワーク: \(artwork)")
            print("画像パス: \(artwork.imageWithSize(artwork.bounds.size))")
          }
          
          
          //メディアアイテムの最初のリリース日
          guard let releaseDate = song.value(forProperty:MPMediaItemPropertyReleaseDate) else {
            continue
          }
          print("最初のリリース日: \(releaseDate)")
          
          
          
          print("=======")
        }
      }
    }
    print("--------- 完了1 ---------")
  }
  
  @objc(didReceiveMemoryWarning)
  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
      print("--------- 完了2 ---------")
  }
}
