/**
 * TextAlive App API basic example
 * https://github.com/TextAliveJp/textalive-app-basic
 *
 * API チュートリアル「1. 開発の始め方」のサンプルコードです。
 * 発声中の歌詞を単語単位で表示します。
 * また、このアプリが TextAlive ホストと接続されていなければ再生コントロールを表示します。
 * https://developer.textalive.jp/app/
 */

// import { Player } from "textalive-app-api";

// 単語が発声されていたら #text に表示する
// Show words being vocalized in #text
const animateWord = function (now, unit) {
  if (unit.contains(now)) {
    document.querySelector("#text").textContent = unit.text;
  }
};

// TextAlive Player を作る
// Instantiate a TextAlive Player instance
const player = new Player({
  app: {
    token: "1HJzpsZ11CfoUPrr",
  },
  mediaElement: document.querySelector("#media"),
});

// TextAlive Player のイベントリスナを登録する
// Register event listeners
player.addListener({
  onAppReady,
  onVideoReady,
  onTimerReady,
  onThrottledTimeUpdate,
  onPlay,
  onPause,
  onStop,
  onTimeUpdate
});

const playBtns = document.querySelectorAll(".play");
const jumpBtn = document.querySelector("#jump");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");
const positionEl = document.querySelector("#position strong");
const artistSpan = document.querySelector(".artist span");
const songSpan = document.querySelector(".song span");

// ソングセレクト
$(".songSelect").on("click",function(){
  changeSongurl();
})

/**
 * TextAlive App が初期化されたときに呼ばれる
 *
 * @param {IPlayerApp} app - https://developer.textalive.jp/packages/textalive-app-api/interfaces/iplayerapp.html
 */
function onAppReady(app) {
  // TextAlive ホストと接続されていなければ再生コントロールを表示する
  // Show control if this app is launched standalone (not connected to a TextAlive host)
  if (!app.managed) {
    document.querySelector("#control").style.display = "block";

    // 再生ボタン / Start music playback
    playBtns.forEach((playBtn) =>
      playBtn.addEventListener("click", () => {
        player.video && player.requestPlay();
      })
    );

    // 歌詞頭出しボタン / Seek to the first character in lyrics text
    jumpBtn.addEventListener(
      "click",
      () =>
        player.video &&
        player.requestMediaSeek(player.video.firstChar.startTime)
    );

    // 一時停止ボタン / Pause music playback
    pauseBtn.addEventListener(
      "click",
      () => player.video && player.requestPause()
    );

    // 巻き戻しボタン / Rewind music playback
    rewindBtn.addEventListener(
      "click",
      () => player.video && player.requestMediaSeek(0)
    );

    document
      .querySelector("#header a")
      .setAttribute(
        "href",
        "https://developer.textalive.jp/app/run/?ta_app_url=https%3A%2F%2Ftextalivejp.github.io%2Ftextalive-app-basic%2F&ta_song_url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DygY2qObZv24"
      );
  } else {
    document
      .querySelector("#header a")
      .setAttribute(
        "href",
        "https://textalivejp.github.io/textalive-app-basic/"
      );
  }

  // 楽曲URLが指定されていなければ マジカルミライ 2020テーマ曲を読み込む
  // Load a song when a song URL is not specified
  
  if (!app.songUrl) {
    // player.createFromSongUrl("http://www.youtube.com/watch?v=ygY2qObZv24");
    player.createFromSongUrl("https://piapro.jp/t/RoPB/20220122172830");
  }
}
// function

/**
 * 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる
 *
 * @param {IVideo} v - https://developer.textalive.jp/packages/textalive-app-api/interfaces/ivideo.html
 */
function onVideoReady(v) {
  // メタデータを表示する
  // Show meta data
  artistSpan.textContent = player.data.song.artist.name;
  songSpan.textContent = player.data.song.name;
  // 定期的に呼ばれる各単語の "animate" 関数をセットする
  // Set "animate" function
  let w = player.video.firstPhrase;
  while (w) {
    w.animate = animateWord;
    w = w.next;
  }
}

/**
 * 音源の再生準備が完了した時に呼ばれる
 *
 * @param {Timer} t - https://developer.textalive.jp/packages/textalive-app-api/interfaces/timer.html
 */
function onTimerReady(t) {
  // ボタンを有効化する
  // Enable buttons
  if (!player.app.managed) {
    document
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = false));
  };
  player.requestPlay();
  // 歌詞がなければ歌詞頭出しボタンを無効にする
  // Disable jump button if no lyrics is available
  jumpBtn.disabled = !player.video.firstChar;
}

/**
 * 動画の再生位置が変更されたときに呼ばれる（あまりに頻繁な発火を防ぐため一定間隔に間引かれる）
 *
 * @param {number} position - https://developer.textalive.jp/packages/textalive-app-api/interfaces/playereventlistener.html#onthrottledtimeupdate
 */
function onThrottledTimeUpdate(position) {
  // 再生位置を表示する
  // Update current position
  positionEl.textContent = String(Math.floor(position));

  // さらに精確な情報が必要な場合は `player.timer.position` でいつでも取得できます
  // More precise timing information can be retrieved by `player.timer.position` at any time
}

// 再生が始まったら #overlay を非表示に
// Hide #overlay when music playback started
function onPlay() {
  document.querySelector("#overlay").style.display = "none";
}

// 再生が一時停止・停止したら歌詞表示をリセット
// Reset lyrics text field when music playback is paused or stopped
function onPause() {
  document.querySelector("#text").textContent = "-";
}
function onStop() {
  document.querySelector("#text").textContent = "-";
}

// 曲を変えるよ！！！！

//クリックされた回数
let num = 1;
$('.songSelect').on('click', function(){
  num++;
  if (num == 6) {
    num = 0;
  } 
});
function changeSongurl(){
  if(num == 0){
    $('.nowS').text('Loading Memories');
    $('.nowA').text('せきこみごはん feat. 初音ミク');
    player.createFromSongUrl("https://piapro.jp/t/RoPB/20220122172830", {
      video: {
        // 音楽地図訂正履歴: https://songle.jp/songs/2243651/history
        beatId: 4086301,
        chordId: 2221797,
        repetitiveSegmentId: 2247682,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FRoPB%2F20220122172830
        lyricId: 53718,
        lyricDiffId: 7076
      },
    });
  }else if(num == 1){ 
    $('.nowS').text('青に溶けた風船');
    $('.nowA').text('シアン・キノ feat. 初音ミク');
      player.createFromSongUrl("https://piapro.jp/t/9cSd/20220205030039", {
        video: {
          // 音楽地図訂正履歴: https://songle.jp/songs/2245015/history
          beatId: 4083452,
          chordId: 2221996,
          repetitiveSegmentId: 2247861,
          // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2F9cSd%2F20220205030039
          lyricId: 53745,
          lyricDiffId: 7080
        },
      });
  }else if(num == 2){ 
    $('.nowS').text('歌の欠片と');
    $('.nowA').text('imo feat. MEIKO');
      player.createFromSongUrl("https://piapro.jp/t/Yvi-/20220207132910", {
        video: {
          // 音楽地図訂正履歴: https://songle.jp/songs/2245016/history
          beatId: 4086832,
          chordId: 2222074,
          repetitiveSegmentId: 2247935,
          // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FYvi-%2F20220207132910
          lyricId: 53746,
          lyricDiffId: 7082
        },
      });
  }else if(num == 3){ 
    $('.nowS').text('未完のストーリー');
    $('.nowA').text('加賀（ネギシャワーP） feat. 初音ミク');
      player.createFromSongUrl("https://piapro.jp/t/ehtN/20220207101534", {
        video: {
          // 音楽地図訂正履歴: https://songle.jp/songs/2245017/history
          beatId: 4083459,
          chordId: 2222147,
          repetitiveSegmentId: 2248008,
          // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FehtN%2F20220207101534
          lyricId: 53747,
          lyricDiffId: 7083
        },
      });
  }else if(num == 4){ 
    $('.nowS').text('みはるかす');
    $('.nowA').text('ねこむら（cat nap） feat. 初音ミク');
      player.createFromSongUrl("https://piapro.jp/t/QtjE/20220207164031", {
        video: {
          // 音楽地図訂正履歴: https://songle.jp/songs/2245018/history
          beatId: 4083470,
          chordId: 2222187,
          repetitiveSegmentId: 2248075,
          // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FQtjE%2F20220207164031
          lyricId: 53748,
          lyricDiffId: 7084
        },
      });
  }else if(num == 5){   
    $('.nowS').text('fear');
    $('.nowA').text('201 feat. 初音ミク');
      player.createFromSongUrl("https://piapro.jp/t/GqT2/20220129182012", {
        video: {
          // 音楽地図訂正履歴: https://songle.jp/songs/2245019/history
          beatId: 4083475,
          chordId: 2222294,
          repetitiveSegmentId: 2248170,
          // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FGqT2%2F20220129182012
          lyricId: 53749,
          lyricDiffId: 7085
        },
      });
  }
}
function onTimeUpdate(up){
  let sabi = player.findChorusBetween(up).index;
  if(sabi == 0){
    $(".miku2").css("opacity",1),
    $(".hair1").css( "zIndex", 14),
    $(".hair2").css( "zIndex", 14),
    $(".hair3").css( "zIndex", 14),
    $(".hair4").css( "zIndex", 14),
    $(".hair5").css( "zIndex", 14),
    $(".miku1").css("opacity",0),
    $(".hairN1").css("opacity",0),
    $(".hairN2").css("opacity",0),
    $(".hairN3").css("opacity",0),
    $(".hairN4").css("opacity",0),
    $(".hairN5").css("opacity",0)
  }
}