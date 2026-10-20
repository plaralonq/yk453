/* ============================================================
   Virtual iPhone: logic
   Characters: Yushi and Riku (fictional). Passcode: 4503
   Everything editable lives in the CONFIG / CONTENT sections.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- CONFIG ---------------- */
  var PASSCODE = '4503';
  var LANGS = ['th', 'en', 'ko', 'ja'];
  var LABEL = { th: 'ไทย', en: 'English', ko: '한국어', ja: '日本語' };
  var LOCALE = { th: 'th-TH', en: 'en-US', ko: 'ko-KR', ja: 'ja-JP' };
  var WALLS = ['images/wallpaper-dusk.svg', 'images/wallpaper-aurora.svg', 'images/wallpaper-blossom.svg'];
  var ARRIVAL_DAYS = 10; // Riku arrives in 10 days (widget + calendar)

  /* ---------------- tiny helpers ---------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var two = function (n) { return n < 10 ? '0' + n : '' + n; };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function sget(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function sset(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function L(ko, th, en, ja) { return { ko: ko, th: th, en: en, ja: ja }; }

  var lang = sget('vip-lang', '');
  if (LANGS.indexOf(lang) < 0) {
    var nav = (navigator.language || 'th').slice(0, 2);
    lang = LANGS.indexOf(nav) >= 0 ? nav : 'th';
  }
  var soundOn = sget('vip-sound', '1') === '1';
  var wallIdx = +sget('vip-wall', '0');
  if (!(wallIdx >= 0 && wallIdx < WALLS.length)) wallIdx = 0;

  function lx(o) { return o[lang] || o.en; }

  /* ---------------- UI strings ---------------- */
  var UI = {
    th: { slide: 'ปัดขึ้นหรือคลิกเพื่อเปิด', enter: 'ใส่รหัสผ่าน', cancel: 'ยกเลิก', del: 'ลบ', emergency: 'ฉุกเฉิน', wrong: 'รหัสผ่านไม่ถูกต้อง ลองอีกครั้ง',
      wLabel: 'ริคุมาถึงในอีก', wUnit: 'วัน', now: 'ตอนนี้',
      kakao: 'KakaoTalk', photos: 'รูปภาพ', notes: 'โน้ต', instagram: 'Instagram', calendar: 'ปฏิทิน', safari: 'Safari', settings: 'ตั้งค่า', clock: 'นาฬิกา',
      chats: 'แชท', type: 'พิมพ์ข้อความ', send: 'ส่ง', today: 'วันนี้', yesterday: 'เมื่อวาน', fromKo: 'แปลจากภาษาเกาหลี', back: 'กลับ',
      allNotes: 'โน้ตทั้งหมด', original: 'ต้นฉบับภาษาเกาหลี', history: 'ประวัติการค้นหา', search: 'ค้นหาหรือป้อนเว็บไซต์',
      posts: 'โพสต์', followers: 'ผู้ติดตาม', following: 'กำลังติดตาม', likes: 'ถูกใจ', items: 'รายการ',
      noEvents: 'ไม่มีกิจกรรม', events: 'กิจกรรม', world: 'นาฬิกาโลก',
      language: 'ภาษา', sound: 'เสียงคลิก', wallpaper: 'วอลล์เปเปอร์', fullscreen: 'เต็มจอ', about: 'เกี่ยวกับ', version: 'เวอร์ชัน', passRow: 'รหัสผ่าน', on: 'เปิด', off: 'ปิด', fsHint: 'บน iPhone ให้กด แชร์ แล้วเลือก เพิ่มที่หน้าจอโฮม', tbSound: 'เสียง', tbFull: 'เต็มจอ' },
    en: { slide: 'Swipe up or click to open', enter: 'Enter Passcode', cancel: 'Cancel', del: 'Delete', emergency: 'Emergency', wrong: 'Wrong passcode. Try again.',
      wLabel: 'Riku arrives in', wUnit: 'days', now: 'now',
      kakao: 'KakaoTalk', photos: 'Photos', notes: 'Notes', instagram: 'Instagram', calendar: 'Calendar', safari: 'Safari', settings: 'Settings', clock: 'Clock',
      chats: 'Chats', type: 'Type a message', send: 'Send', today: 'Today', yesterday: 'Yesterday', fromKo: 'Translated from Korean', back: 'Back',
      allNotes: 'All Notes', original: 'Korean original', history: 'History', search: 'Search or enter website',
      posts: 'posts', followers: 'followers', following: 'following', likes: 'likes', items: 'items',
      noEvents: 'No events', events: 'Events', world: 'World Clock',
      language: 'Language', sound: 'Click sound', wallpaper: 'Wallpaper', fullscreen: 'Fullscreen', about: 'About', version: 'Version', passRow: 'Passcode', on: 'On', off: 'Off', fsHint: 'On iPhone, tap Share, then Add to Home Screen', tbSound: 'Sound', tbFull: 'Fullscreen' },
    ko: { slide: '위로 쓸어올리거나 클릭해서 열기', enter: '암호 입력', cancel: '취소', del: '삭제', emergency: '긴급', wrong: '암호가 틀렸습니다. 다시 시도하세요.',
      wLabel: '리쿠가 도착하기까지', wUnit: '일', now: '지금',
      kakao: 'KakaoTalk', photos: '사진', notes: '메모', instagram: 'Instagram', calendar: '캘린더', safari: 'Safari', settings: '설정', clock: '시계',
      chats: '채팅', type: '메시지 입력', send: '전송', today: '오늘', yesterday: '어제', fromKo: '', back: '뒤로',
      allNotes: '모든 메모', original: '', history: '방문 기록', search: '검색 또는 웹사이트 이름 입력',
      posts: '게시물', followers: '팔로워', following: '팔로잉', likes: '좋아요', items: '개',
      noEvents: '일정 없음', events: '일정', world: '세계 시계',
      language: '언어', sound: '클릭 소리', wallpaper: '배경화면', fullscreen: '전체 화면', about: '정보', version: '버전', passRow: '암호', on: '켬', off: '끔', fsHint: 'iPhone에서는 공유 버튼에서 홈 화면에 추가를 선택하세요', tbSound: '소리', tbFull: '전체 화면' },
    ja: { slide: '上にスワイプまたはクリックで開く', enter: 'パスコードを入力', cancel: 'キャンセル', del: '削除', emergency: '緊急', wrong: 'パスコードが違います。もう一度お試しください。',
      wLabel: 'リクが着くまで', wUnit: '日', now: 'いま',
      kakao: 'KakaoTalk', photos: '写真', notes: 'メモ', instagram: 'Instagram', calendar: 'カレンダー', safari: 'Safari', settings: '設定', clock: '時計',
      chats: 'トーク', type: 'メッセージを入力', send: '送信', today: '今日', yesterday: '昨日', fromKo: '韓国語から翻訳', back: '戻る',
      allNotes: 'すべてのメモ', original: '韓国語の原文', history: '履歴', search: '検索またはWebサイト名を入力',
      posts: '投稿', followers: 'フォロワー', following: 'フォロー中', likes: 'いいね', items: '件',
      noEvents: '予定なし', events: '予定', world: '世界時計',
      language: '言語', sound: 'クリック音', wallpaper: '壁紙', fullscreen: 'フルスクリーン', about: '情報', version: 'バージョン', passRow: 'パスコード', on: 'オン', off: 'オフ', fsHint: 'iPhoneでは共有からホーム画面に追加を選んでください', tbSound: '音', tbFull: 'フルスクリーン' }
  };
  function st(k) { return (UI[lang] && UI[lang][k] !== undefined) ? UI[lang][k] : UI.en[k]; }

  /* ---------------- CONTENT (fictional) ---------------- */
  var NAME_RIKU = L('리쿠', 'ริคุ', 'Riku', 'リク');
  var NAME_YUSHI = L('유시', 'ยูชิ', 'Yushi', 'ユウシ');

  var LOVE_NOTE = L(
    '리쿠짱~ 보고 싶어~\n리쿠가 있어서 나는 힘을 낼 수 있었던 것 같애\n그래서 나는 리쿠가 필요해~\n나는 기다릴게~\n리쿠 사랑해~',
    'ริคุจัง~ คิดถึงจังเลย~\nเพราะมีริคุอยู่ ฉันถึงมีแรงสู้ต่อได้นะ\nก็เลยต้องการริคุมากเลย~\nฉันจะรอนะ~\nรักริคุนะ~',
    'Riku-chan~ I miss you~\nI think I could keep going because Riku was there\nSo I need you, Riku~\nI\'ll be waiting~\nI love you, Riku~',
    'リクちゃん～ 会いたいよ～\nリクがいたから、僕は頑張れたんだと思う\nだから僕にはリクが必要なんだ～\n待ってるね～\nリク、大好きだよ～');

  var MSG_RIKU = [
    { s: 'them', tm: '21:02', t: L('유시야~ 아직 안 자?', 'ยูชิ~ ยังไม่นอนเหรอ?', 'Yushi~ still awake?', 'ユウシ～まだ起きてる？') },
    { s: 'me', tm: '21:03', t: L('리쿠짱~ 보고 싶어~', 'ริคุจัง~ คิดถึงจังเลย~', 'Riku-chan~ I miss you~', 'リクちゃん～ 会いたいよ～') },
    { s: 'me', tm: '21:03', t: L('리쿠가 있어서 나는 힘을 낼 수 있었던 것 같애', 'เพราะมีริคุอยู่ ฉันถึงมีแรงสู้ต่อได้นะ', 'I think I could keep going because Riku was there', 'リクがいたから、僕は頑張れたんだと思う') },
    { s: 'me', tm: '21:04', t: L('그래서 나는 리쿠가 필요해~', 'ก็เลยต้องการริคุมากเลย~', 'So I need you, Riku~', 'だから僕にはリクが必要なんだ～') },
    { s: 'me', tm: '21:04', t: L('나는 기다릴게~', 'ฉันจะรอนะ~', 'I\'ll be waiting~', '待ってるね～') },
    { s: 'me', tm: '21:05', t: L('리쿠 사랑해~', 'รักริคุนะ~', 'I love you, Riku~', 'リク、大好きだよ～') },
    { s: 'them', tm: '21:09', t: L('나도 보고 싶어, 유시야', 'ฉันก็คิดถึงยูชินะ', 'I miss you too, Yushi', '僕も会いたいよ、ユウシ') },
    { s: 'them', tm: '21:09', t: L('10일만 더 기다려줘. 곧 갈게', 'รออีก 10 วันนะ เดี๋ยวไปหาแล้ว', 'Just wait 10 more days. I\'m coming soon', 'あと10日だけ待ってて。もうすぐ行くから') },
    { s: 'me', tm: '21:10', t: L('응! 공항에서 기다릴게', 'อื่ม! จะไปรอที่สนามบินนะ', 'Okay! I\'ll wait for you at the airport', 'うん！空港で待ってるね') }
  ];

  var CHATS = [
    { id: 'riku', name: NAME_RIKU, color: '#ff7a8a', tm: '21:09', unread: 0, last: MSG_RIKU[7].t, msgs: MSG_RIKU, day: 'today' },
    { id: 'mom', name: L('엄마', 'แม่', 'Mom', 'お母さん'), color: '#7aa7ff', tm: '18:20', unread: 0, last: L('밥 잘 챙겨 먹어', 'กินข้าวให้ดีนะ', 'Make sure you eat well', 'ご飯ちゃんと食べてね'), day: 'today' },
    { id: 'crew', name: L('댄스 크루', 'กลุ่มเต้น', 'Dance Crew', 'ダンスクルー'), color: '#8f7aff', tm: '17:05', unread: 3, last: L('내일 연습 7시!', 'พรุ่งนี้ซ้อม 7 โมงเย็น!', 'Practice tomorrow at 7!', '明日の練習は7時！'), day: 'today' },
    { id: 'cafe', name: L('카페 모리', 'คาเฟ่ โมริ', 'Cafe Mori', 'カフェ もり'), color: '#4cc3a1', tm: '23:12', unread: 0, last: L('예약 확인되었습니다', 'ยืนยันการจองแล้ว', 'Your reservation is confirmed', 'ご予約を承りました'), day: 'yesterday' }
  ];
  for (var ci = 1; ci < CHATS.length; ci++) CHATS[ci].msgs = [{ s: 'them', tm: CHATS[ci].tm, t: CHATS[ci].last }];

  var NOTES = [
    { id: 'n1', ago: 1, title: L('리쿠에게', 'ถึงริคุ', 'To Riku', 'リクへ'), body: LOVE_NOTE },
    { id: 'n2', ago: 2, title: L('공항 가기 전에', 'ก่อนไปสนามบิน', 'Before the airport', '空港に行く前に'),
      body: L('꽃 사기\n리쿠가 좋아하는 간식 챙기기\n플랫폼 번호 확인\n보고 싶었다고 말하기',
              'ซื้อดอกไม้\nเตรียมขนมที่ริคุชอบ\nเช็กหมายเลขชานชาลา\nบอกว่าคิดถึงมาก',
              'Buy flowers\nBring the snacks Riku likes\nCheck the platform number\nSay I missed him',
              '花を買う\nリクが好きなおやつを用意\nホーム番号を確認\n会いたかったと伝える') },
    { id: 'n3', ago: 5, title: L('리쿠랑 듣고 싶은 노래', 'เพลงที่อยากฟังกับริคุ', 'Songs to hear with Riku', 'リクと聴きたい曲'),
      body: L('밤하늘의 편지\n기다림의 계절\nMidnight Drive\n창가의 오후', 'จดหมายแห่งท้องฟ้ายามค่ำ\nฤดูแห่งการรอคอย\nMidnight Drive\nบ่ายริมหน้าต่าง', 'Letter from the Night Sky\nSeason of Waiting\nMidnight Drive\nAfternoon by the Window', '夜空からの手紙\n待つ季節\nMidnight Drive\n窓辺の午後') }
  ];

  var HISTORY = [
    { day: 'today', tm: '20:41', t: L('리쿠 생일 선물 추천', 'ไอเดียของขวัญวันเกิดให้ริคุ', 'Birthday gift ideas for Riku', 'リクの誕生日プレゼント おすすめ') },
    { day: 'today', tm: '20:12', t: L('도쿄 서울 항공권 가격', 'ราคาตั๋วเครื่องบิน โตเกียว–โซล', 'Tokyo–Seoul flight prices', '東京 ソウル 航空券 価格') },
    { day: 'today', tm: '19:30', t: L('기다리는 마음 달래는 법', 'วิธีปลอบใจตอนต้องรอใครสักคน', 'How to ease a waiting heart', '待つ気持ちを落ち着かせる方法') },
    { day: 'yesterday', tm: '23:08', t: L('리쿠가 좋아하는 카페 근처 맛집', 'ร้านอร่อยใกล้คาเฟ่ที่ริคุชอบ', 'Restaurants near the cafe Riku likes', 'リクが好きなカフェの近くのお店') },
    { day: 'yesterday', tm: '22:51', t: L('사랑한다는 한국어 표현 모음', 'รวมคำบอกรักภาษาเกาหลี', 'Ways to say I love you in Korean', '韓国語の愛情表現まとめ') },
    { day: 'yesterday', tm: '21:15', t: L('공항 도착 게이트 확인', 'เช็กเกตขาเข้าที่สนามบิน', 'Check the airport arrival gate', '空港 到着ゲート 確認') }
  ];

  var POSTS = [
    { img: 'images/photos/photo1.svg', likes: 128, t: L('리쿠가 보내준 노을', 'ริคุส่งพระอาทิตย์ตกมาให้', 'The sunset Riku sent me', 'リクが送ってくれた夕焼け') },
    { img: 'images/photos/photo2.svg', likes: 203, t: L('오늘 밤 달이 예뻐서', 'คืนนี้ดวงจันทร์สวยจัง', 'The moon is pretty tonight', '今夜は月がきれい') },
    { img: 'images/photos/photo3.svg', likes: 96, t: L('바다 보러 가고 싶다', 'อยากไปดูทะเล', 'Want to go see the sea', '海を見に行きたい') },
    { img: 'images/photos/photo4.svg', likes: 174, t: L('리쿠랑 앉았던 창가 자리', 'ที่นั่งริมหน้าต่างที่เคยนั่งกับริคุ', 'The window seat we sat at', 'リクと座った窓際の席') },
    { img: 'images/photos/photo5.svg', likes: 151, t: L('기다리는 중', 'กำลังรออยู่', 'Waiting', '待ってる') },
    { img: 'images/photos/photo6.svg', likes: 88, t: L('초록빛 오후', 'บ่ายสีเขียว', 'A green afternoon', '緑の午後') }
  ];
  var STORIES = [
    { n: NAME_RIKU, img: 'images/photos/photo7.svg' }, { n: L('카페', 'คาเฟ่', 'Cafe', 'カフェ'), img: 'images/photos/photo4.svg' },
    { n: L('여행', 'ทริป', 'Trip', '旅'), img: 'images/photos/photo3.svg' }, { n: L('밤', 'กลางคืน', 'Night', '夜'), img: 'images/photos/photo5.svg' }
  ];

  var PHOTOS = [
    { img: 'images/photos/photo1.svg', ago: 1, t: POSTS[0].t }, { img: 'images/photos/photo2.svg', ago: 3, t: POSTS[1].t },
    { img: 'images/photos/photo3.svg', ago: 6, t: POSTS[2].t }, { img: 'images/photos/photo4.svg', ago: 9, t: POSTS[3].t },
    { img: 'images/photos/photo5.svg', ago: 12, t: POSTS[4].t }, { img: 'images/photos/photo6.svg', ago: 18, t: POSTS[5].t },
    { img: 'images/photos/photo7.svg', ago: 25, t: L('네온 간판 아래에서', 'ใต้ป้ายนีออน', 'Under the neon sign', 'ネオンの下で') },
    { img: 'images/photos/photo8.svg', ago: 31, t: L('따뜻한 커피 한 잔', 'กาแฟอุ่น ๆ หนึ่งแก้ว', 'A warm cup of coffee', '温かいコーヒー') }
  ];

  var EVENTS = [
    { d: -2, tm: '22:00', t: L('리쿠에게 편지 쓰기', 'เขียนจดหมายถึงริคุ', 'Write a letter to Riku', 'リクに手紙を書く') },
    { d: 3, tm: '21:00', t: L('리쿠와 영상통화', 'วิดีโอคอลกับริคุ', 'Video call with Riku', 'リクとビデオ通話') },
    { d: 7, tm: '15:00', t: L('선물 사러 가기', 'ไปซื้อของขวัญ', 'Go gift shopping', 'プレゼントを買いに行く') },
    { d: ARRIVAL_DAYS, tm: '18:40', t: L('리쿠 도착', 'ริคุมาถึง', 'Riku arrives', 'リク到着') },
    { d: ARRIVAL_DAYS, tm: '20:00', t: L('함께 저녁 먹기', 'กินมื้อค่ำด้วยกัน', 'Dinner together', '一緒に夕食') }
  ];

  var CITIES = [
    { n: L('도쿄', 'โตเกียว', 'Tokyo', '東京'), tz: 'Asia/Tokyo' }, { n: L('서울', 'โซล', 'Seoul', 'ソウル'), tz: 'Asia/Seoul' },
    { n: L('방콕', 'กรุงเทพฯ', 'Bangkok', 'バンコク'), tz: 'Asia/Bangkok' }, { n: L('로스앤젤레스', 'ลอสแอนเจลิส', 'Los Angeles', 'ロサンゼルス'), tz: 'America/Los_Angeles' }
  ];

  /* ---------------- DOM ---------------- */
  var root = document.documentElement;
  var phone = $('#phone'), device = $('#device'), screen = $('#screen');
  var lock = $('#lock'), home = $('#home'), pass = $('#pass'), appEl = $('#app'), appBody = $('#appBody'), indicator = $('#indicator');
  var scale = 1, state = 'lock', current = null, cleanup = null;

  /* ---------------- fit ---------------- */
  var mq = window.matchMedia('(max-width: 520px), (pointer: coarse) and (max-width: 900px)');
  function fit() {
    var mobile = mq.matches;
    root.classList.toggle('mobile', mobile);
    if (mobile) { device.style.width = ''; device.style.height = ''; phone.style.transform = ''; scale = 1; return; }
    var tbH = $('#toolbar').offsetHeight + 12;
    var aw = $('#stage').clientWidth - 32, ah = window.innerHeight - 32 - tbH;
    scale = Math.max(.3, Math.min(1, aw / 390, ah / 844));
    device.style.width = (390 * scale) + 'px';
    device.style.height = (844 * scale) + 'px';
    phone.style.transform = 'scale(' + scale + ')';
  }
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);

  /* ---------------- sound ---------------- */
  var ac = null;
  function tick(freq, dur) {
    if (!soundOn) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
      o.type = 'sine'; o.frequency.value = freq || 1300;
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(.05, t + .005);
      g.gain.exponentialRampToValueAtTime(.0001, t + (dur || .045));
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + (dur || .045) + .02);
    } catch (e) { /* audio unavailable */ }
  }
  phone.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button, [data-act], #lock, #indicator')) tick(1300, .04);
  });

  /* ---------------- clock text ---------------- */
  function updateTime() {
    var d = new Date(), t = two(d.getHours()) + ':' + two(d.getMinutes());
    $$('.tclock').forEach(function (e) { e.textContent = t; });
    $('#lkTime').textContent = t;
    $('#lkDate').textContent = d.toLocaleDateString(LOCALE[lang], { weekday: 'long', day: 'numeric', month: 'long' });
  }

  /* ---------------- wallpaper ---------------- */
  function applyWall(i) {
    wallIdx = i; sset('vip-wall', String(i));
    screen.style.setProperty('--wall-img', 'url("' + WALLS[i] + '")');
    $$('#screen .wall').forEach(function (w) { w.style.setProperty('--wall-img', 'url("' + WALLS[i] + '")'); });
  }

  /* ---------------- home / lock static parts ---------------- */
  var ICONS = ['photos', 'notes', 'instagram', 'calendar', 'clock'];
  var DOCK = ['kakao', 'safari', 'settings'];
  function iconHtml(id, label) {
    return '<button class="app-ic" type="button" data-app="' + id + '" aria-label="' + esc(st(id)) + '"><img src="images/icons/' + id + '.svg" alt="" draggable="false">' + (label ? '<span>' + esc(st(id)) + '</span>' : '<span></span>') + '</button>';
  }
  function buildHome() {
    $('#grid').innerHTML = ICONS.map(function (i) { return iconHtml(i, true); }).join('');
    $('#dock').innerHTML = DOCK.map(function (i) { return iconHtml(i, false); }).join('');
    var d = new Date();
    $('#widget').innerHTML = '<div class="wl"><div class="wd">' + esc(d.toLocaleDateString(LOCALE[lang], { weekday: 'long' })) + '</div><div class="wn">' + d.getDate() + '</div><div class="wm">' + esc(d.toLocaleDateString(LOCALE[lang], { month: 'long', year: 'numeric' })) + '</div></div>' +
      '<div class="wr"><small>' + esc(st('wLabel')) + '</small><b>' + ARRIVAL_DAYS + '</b><small>' + esc(st('wUnit')) + '</small></div>';
  }
  function buildLockNotif() {
    $('#lkNotif').innerHTML = '<img src="images/icons/kakao.svg" alt=""><div class="nt"><b>' + esc(lx(NAME_RIKU)) + '</b><span>' + esc(lx(MSG_RIKU[7].t)) + '</span></div><time>' + esc(st('now')) + '</time>';
  }
  var KEYS = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']];
  var entered = '', busy = false;
  function buildKeypad() {
    var h = KEYS.map(function (k) { return '<button class="key" type="button" data-key="' + k[0] + '" aria-label="' + k[0] + '"><b>' + k[0] + '</b><small>' + k[1] + '</small></button>'; }).join('');
    h += '<button class="key txt" type="button" data-key="emergency" tabindex="-1">' + esc(st('emergency')) + '</button>';
    h += '<button class="key" type="button" data-key="0" aria-label="0"><b>0</b><small></small></button>';
    h += '<button class="key txt" type="button" data-key="' + (entered.length ? 'del' : 'cancel') + '">' + esc(entered.length ? st('del') : st('cancel')) + '</button>';
    $('#keypad').innerHTML = h;
  }
  function updateDots() {
    $$('#dots i').forEach(function (d, i) { d.classList.toggle('on', i < entered.length); });
    var last = $('#keypad .key.txt:last-child');
    if (last) { last.setAttribute('data-key', entered.length ? 'del' : 'cancel'); last.textContent = entered.length ? st('del') : st('cancel'); }
  }

  function applyI18n() {
    root.lang = lang;
    $$('[data-i18n]').forEach(function (e) { e.textContent = st(e.getAttribute('data-i18n')); });
    $('#lock').setAttribute('aria-label', st('slide'));
    buildHome(); buildLockNotif(); buildKeypad(); updateDots(); updateTime();
    $('#langSeg').innerHTML = LANGS.map(function (l) { return '<button type="button" data-lang="' + l + '" class="' + (l === lang ? 'on' : '') + '">' + LABEL[l] + '</button>'; }).join('');
    $('#tbSound').textContent = st('tbSound') + ': ' + (soundOn ? st('on') : st('off'));
    $('#tbSound').setAttribute('aria-pressed', String(soundOn));
    $('#tbFull').textContent = st('tbFull');
    document.title = 'Virtual iPhone';
    if (current) renderApp();
  }
  function setLang(l) { lang = l; sset('vip-lang', l); applyI18n(); }
  function setSound(on) { soundOn = on; sset('vip-sound', on ? '1' : '0'); applyI18n(); if (on) tick(1500, .06); }
  function fullscreen() {
    var el = document.documentElement;
    try {
      if (document.fullscreenElement) { document.exitFullscreen(); }
      else if (el.requestFullscreen) { el.requestFullscreen().catch(function () {}); }
      else if (el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); }
    } catch (e) { /* not supported */ }
  }

  $('#langSeg').addEventListener('click', function (e) { var b = e.target.closest('[data-lang]'); if (b) setLang(b.getAttribute('data-lang')); });
  $('#tbSound').addEventListener('click', function () { setSound(!soundOn); });
  $('#tbFull').addEventListener('click', fullscreen);

  /* ---------------- lock, passcode, unlock ---------------- */
  var sy = 0, drag = false, moved = false, dyNow = 0;
  lock.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.qbtn')) return;
    drag = true; moved = false; sy = e.clientY; dyNow = 0; lock.style.transition = 'none';
    try { lock.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  });
  lock.addEventListener('pointermove', function (e) {
    if (!drag) return;
    dyNow = Math.min(0, (e.clientY - sy) / scale);
    if (dyNow < -4) moved = true;
    lock.style.transform = 'translateY(' + (dyNow * .5) + 'px)';
  });
  function endDrag(cancel) {
    if (!drag) return; drag = false; lock.style.transition = ''; lock.style.transform = '';
    if (cancel) return;
    if (!moved || -dyNow > 120) openPass();
  }
  lock.addEventListener('pointerup', function () { endDrag(false); });
  lock.addEventListener('pointercancel', function () { endDrag(true); });
  lock.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); openPass(); } });

  var torchBtn = $('#torchBtn');
  torchBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var on = !lock.classList.contains('torch');
    lock.classList.toggle('torch', on); torchBtn.classList.toggle('on', on); torchBtn.setAttribute('aria-pressed', String(on));
  });
  var wantCamera = false;
  $('#camBtn').addEventListener('click', function (e) { e.stopPropagation(); wantCamera = true; openPass(); });
  $$('.qbtn').forEach(function (b) { ['pointerdown', 'pointerup'].forEach(function (ev) { b.addEventListener(ev, function (e) { e.stopPropagation(); }); }); });

  function openPass() {
    if (state !== 'lock') return;
    state = 'pass'; entered = ''; busy = false;
    buildKeypad(); updateDots(); $('#passMsg').classList.remove('on');
    pass.inert = false; pass.removeAttribute('aria-hidden'); pass.classList.add('show');
  }
  function closePass() {
    state = 'lock'; wantCamera = false;
    pass.classList.remove('show'); pass.inert = true; pass.setAttribute('aria-hidden', 'true');
    entered = ''; updateDots();
  }
  function passKey(k) {
    if (busy) return;
    if (k === 'emergency') return;
    if (k === 'cancel') { closePass(); return; }
    if (k === 'del') { entered = entered.slice(0, -1); updateDots(); return; }
    if (!/^[0-9]$/.test(k) || entered.length >= 4) return;
    entered += k; updateDots(); $('#passMsg').classList.remove('on');
    if (entered.length === 4) { busy = true; setTimeout(checkPass, 160); }
  }
  function checkPass() {
    if (entered === PASSCODE) {
      tick(1700, .09);
      unlock();
    } else {
      var dots = $('#dots'), msg = $('#passMsg');
      msg.textContent = st('wrong'); msg.classList.add('on');
      dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
      try { if (navigator.vibrate) navigator.vibrate(180); } catch (e) { /* ignore */ }
      tick(220, .16);
      setTimeout(function () { entered = ''; updateDots(); dots.classList.remove('shake'); busy = false; }, 480);
    }
  }
  $('#keypad').addEventListener('click', function (e) { var b = e.target.closest('[data-key]'); if (b) passKey(b.getAttribute('data-key')); });
  document.addEventListener('keydown', function (e) {
    if (state === 'pass') {
      if (/^[0-9]$/.test(e.key)) passKey(e.key);
      else if (e.key === 'Backspace') passKey('del');
      else if (e.key === 'Escape') passKey('cancel');
    } else if (e.key === 'Escape' && current) { closeApp(); }
  });

  function unlock() {
    var cam = wantCamera; wantCamera = false;
    state = 'home';
    pass.classList.remove('show'); pass.inert = true; pass.setAttribute('aria-hidden', 'true');
    lock.classList.add('gone'); lock.inert = true; home.inert = false;
    entered = ''; busy = false; updateDots();
    if (cam) { /* camera app is not part of this phone; return to home */ }
  }
  function relock() {
    if (current) closeApp(true);
    state = 'lock'; lock.classList.remove('gone'); lock.inert = false; home.inert = true;
    pass.classList.remove('show'); entered = ''; updateDots(); buildHome();
  }
  $('#power').addEventListener('click', function () { if (state === 'home') relock(); else if (state === 'lock') openPass(); });

  /* ---------------- app open / close ---------------- */
  var THEME = { kakao: 'dark', photos: 'dark', notes: 'dark', instagram: 'dark', calendar: 'dark', safari: 'dark', settings: 'dark', clock: 'light' };
  home.addEventListener('click', function (e) { var b = e.target.closest('[data-app]'); if (b) openApp(b.getAttribute('data-app'), b); });

  var S = { kChat: null, nOpen: null, iOpen: null, pOpen: null, cSel: null, cMonth: 0, liked: {}, sent: [] };

  function openApp(id, from) {
    if (current || !RENDER[id]) return;
    current = id;
    S.kChat = null; S.nOpen = null; S.iOpen = null; S.pOpen = null; S.cSel = dayKey(new Date()); S.cMonth = 0;
    var sr = screen.getBoundingClientRect(), fr = from.getBoundingClientRect();
    appEl.style.transformOrigin = ((fr.left + fr.width / 2 - sr.left) / scale) + 'px ' + ((fr.top + fr.height / 2 - sr.top) / scale) + 'px';
    renderApp();
    screen.classList.toggle('st-dark', THEME[id] === 'dark');
    void appEl.offsetWidth;
    appEl.classList.add('open'); indicator.classList.add('live');
  }
  function closeApp(instant) {
    if (!current) return;
    var cl = cleanup; cleanup = null; current = null;
    appEl.classList.remove('open'); indicator.classList.remove('live'); screen.classList.remove('st-dark');
    var done = function () { if (cl) cl(); if (!current) appBody.innerHTML = ''; };
    if (instant) done(); else setTimeout(done, 430);
  }
  indicator.addEventListener('pointerdown', function (e) { try { indicator.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } });
  indicator.addEventListener('pointerup', function () { closeApp(); });

  function renderApp() {
    if (!current) return;
    if (cleanup) { cleanup(); cleanup = null; }
    var keepScroll = {};
    $$('.scroll,.chat-body', appBody).forEach(function (el, i) { keepScroll[i] = el.scrollTop; });
    var res = RENDER[current]();
    appBody.innerHTML = res.html;
    $$('.scroll,.chat-body', appBody).forEach(function (el, i) { if (keepScroll[i]) el.scrollTop = keepScroll[i]; });
    var cb = $('.chat-body', appBody); if (cb) cb.scrollTop = cb.scrollHeight;
    if (res.init) cleanup = res.init(appBody) || null;
    screen.classList.toggle('st-dark', THEME[current] === 'dark');
  }

  /* ---------------- shared render helpers ---------------- */
  var BACK_SVG = '<svg viewBox="0 0 12 20"><path d="M10 2L2 10l8 8"/></svg>';
  function dual(o) { return esc(o.ko) + (lang !== 'ko' ? '<span class="tr">' + esc(lx(o)) + '</span>' : ''); }
  function dayKey(d) { return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }
  function addDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return d; }
  function fmtDate(d, o) { return d.toLocaleDateString(LOCALE[lang], o); }
  function dayLabel(k) { return k === 'today' ? st('today') : st('yesterday'); }

  var RENDER = {};

  /* KakaoTalk */
  RENDER.kakao = function () {
    var h;
    if (S.kChat === null) {
      h = '<div class="view kakao"><div class="navbar"><h1>' + esc(st('chats')) + '</h1></div><div class="scroll">' +
        CHATS.map(function (c) {
          var tm = c.id === 'cafe' ? st('yesterday') : c.tm;
          return '<button class="k-row" type="button" data-act="k-open" data-v="' + c.id + '"><div class="avatar" style="background:' + c.color + '">' + esc(lx(c.name).charAt(0)) + '</div><div class="k-main"><b>' + esc(lx(c.name)) + '</b><span>' + esc(c.last.ko) + '</span></div><div class="k-meta"><span>' + esc(tm) + '</span>' + (c.unread ? '<i class="badge">' + c.unread + '</i>' : '') + '</div></button>';
        }).join('') + '</div></div>';
      return { html: h };
    }
    var chat = CHATS.filter(function (c) { return c.id === S.kChat; })[0];
    var msgs = chat.msgs.concat(chat.id === 'riku' ? S.sent : []);
    h = '<div class="view chat"><div class="navbar small"><button class="back" type="button" data-act="k-back">' + BACK_SVG + esc(st('chats')) + '</button><h2>' + esc(lx(chat.name)) + '</h2><span style="min-width:70px"></span></div><div class="chat-body">' +
      '<div class="day">' + esc(dayLabel(chat.day)) + '</div>' +
      msgs.map(function (m) {
        var body = m.raw !== undefined ? esc(m.raw) : dual(m.t);
        var av = m.s === 'them' ? '<div class="avatar" style="background:' + chat.color + '">' + esc(lx(chat.name).charAt(0)) + '</div>' : '';
        return '<div class="msg ' + m.s + '">' + av + '<div class="bub">' + body + '</div><time>' + esc(m.tm) + '</time></div>';
      }).join('') + '</div>' +
      '<div class="composer"><input id="kIn" type="text" autocomplete="off" placeholder="' + esc(st('type')) + '"><button type="button" data-act="k-send">' + esc(st('send')) + '</button></div></div>';
    return { html: h, init: function (r) {
      var inp = $('#kIn', r);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); sendMsg(); } });
    } };
  };
  function sendMsg() {
    var inp = $('#kIn', appBody); if (!inp) return;
    var v = inp.value.trim(); if (!v) return;
    var d = new Date();
    S.sent.push({ s: 'me', tm: two(d.getHours()) + ':' + two(d.getMinutes()), raw: v });
    renderApp();
    var i2 = $('#kIn', appBody); if (i2) i2.focus();
    tick(1100, .06);
  }

  /* Notes */
  RENDER.notes = function () {
    if (S.nOpen === null) {
      return { html: '<div class="view notes"><div class="navbar"><h1>' + esc(st('notes')) + '</h1></div><div class="scroll"><div class="card-list">' +
        NOTES.map(function (n) {
          var first = lx(n.body).split('\n')[0];
          return '<button class="n-row" type="button" data-act="n-open" data-v="' + n.id + '"><b>' + esc(lx(n.title)) + '</b><span>' + esc(fmtDate(addDays(-n.ago), { month: 'short', day: 'numeric' })) + '  ' + esc(first) + '</span></button>';
        }).join('') + '</div></div></div>' };
    }
    var n = NOTES.filter(function (x) { return x.id === S.nOpen; })[0];
    var orig = lang !== 'ko' ? '<div class="n-orig"><h4>' + esc(st('original')) + '</h4><p>' + esc(n.body.ko) + '</p></div>' : '';
    return { html: '<div class="view notes"><div class="navbar small"><button class="back" type="button" data-act="n-back">' + BACK_SVG + esc(st('allNotes')) + '</button><h2></h2><span style="min-width:70px"></span></div><div class="scroll"><div class="n-body"><h2>' + esc(lx(n.title)) + '</h2><div class="n-date">' + esc(fmtDate(addDays(-n.ago), { year: 'numeric', month: 'long', day: 'numeric' })) + '</div><p>' + esc(lx(n.body)) + '</p>' + orig + '</div></div></div>' };
  };

  /* Safari (search history) */
  RENDER.safari = function () {
    var groups = ['today', 'yesterday'].map(function (d) {
      var rows = HISTORY.filter(function (x) { return x.day === d; });
      return '<div class="h-day">' + esc(dayLabel(d)) + '</div><div class="card-list" style="margin-top:0">' +
        rows.map(function (x) { return '<div class="h-row"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><div>' + dual(x.t) + '</div><time>' + esc(x.tm) + '</time></div>'; }).join('') + '</div>';
    }).join('');
    return { html: '<div class="view safari"><div class="navbar"><h1>' + esc(st('history')) + '</h1></div><div class="searchbar">' + esc(st('search')) + '</div><div class="scroll">' + groups + '</div></div>' };
  };

  /* Instagram */
  var HEART = '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.6 3.8 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.2 0 5.4 3.1 4.2 6.7-1.7 4.7-9.2 9.3-9.2 9.3z"/></svg>';
  RENDER.instagram = function () {
    if (S.iOpen === null) {
      return { html: '<div class="view"><div class="ig-head"><b>yushi.days</b></div><div class="scroll">' +
        '<div class="prof"><img class="pf" src="images/photos/photo2.svg" alt=""><div class="stats"><div><b>' + POSTS.length + '</b><span>' + esc(st('posts')) + '</span></div><div><b>1,284</b><span>' + esc(st('followers')) + '</span></div><div><b>312</b><span>' + esc(st('following')) + '</span></div></div></div>' +
        '<div class="prof-name"><b>' + esc(lx(NAME_YUSHI)) + '</b><br>' + dual(L('리쿠를 기다리는 중', 'กำลังรอริคุอยู่', 'Waiting for Riku', 'リクを待っている')) + '</div>' +
        '<div class="stories">' + STORIES.map(function (s) { return '<div class="story"><i><img src="' + s.img + '" alt=""></i><span>' + esc(lx(s.n)) + '</span></div>'; }).join('') + '</div>' +
        '<div class="igrid">' + POSTS.map(function (p, i) { return '<button type="button" data-act="i-open" data-v="' + i + '" aria-label="' + esc(lx(p.t)) + '"><img src="' + p.img + '" alt=""></button>'; }).join('') + '</div></div></div>' };
    }
    var p = POSTS[S.iOpen], liked = !!S.liked[S.iOpen];
    return { html: '<div class="view"><div class="navbar small"><button class="back" type="button" data-act="i-back">' + BACK_SVG + esc(st('posts')) + '</button><h2>yushi.days</h2><span style="min-width:70px"></span></div><div class="scroll">' +
      '<img class="post-img" src="' + p.img + '" alt="">' +
      '<div class="post-acts"><button type="button" data-act="i-like" class="' + (liked ? 'liked' : '') + '" aria-label="' + esc(st('likes')) + '" aria-pressed="' + liked + '">' + HEART + '</button></div>' +
      '<div class="post-meta"><b>' + (p.likes + (liked ? 1 : 0)) + ' ' + esc(st('likes')) + '</b><br><b>yushi.days</b> ' + dual(p.t) + '</div></div></div>' };
  };

  /* Photos */
  RENDER.photos = function () {
    if (S.pOpen === null) {
      return { html: '<div class="view"><div class="navbar"><h1>' + esc(st('photos')) + '</h1></div><div class="sub">' + PHOTOS.length + ' ' + esc(st('items')) + '</div><div class="scroll"><div class="pgrid">' +
        PHOTOS.map(function (p, i) { return '<button type="button" data-act="p-open" data-v="' + i + '" aria-label="' + esc(lx(p.t)) + '"><img src="' + p.img + '" alt=""></button>'; }).join('') + '</div></div></div>' };
    }
    var p = PHOTOS[S.pOpen];
    return { html: '<div class="view viewer"><div class="navbar small"><button class="back" type="button" data-act="p-back">' + BACK_SVG + esc(st('photos')) + '</button><h2>' + esc(fmtDate(addDays(-p.ago), { month: 'long', day: 'numeric' })) + '</h2><span style="min-width:70px"></span></div><div class="viewer-img"><img src="' + p.img + '" alt="' + esc(lx(p.t)) + '"></div><div class="viewer-cap">' + esc(p.t.ko) + (lang !== 'ko' ? '<span class="tr" style="color:#aaa">' + esc(lx(p.t)) + '</span>' : '') + '</div></div>' };
  };

  /* Calendar */
  RENDER.calendar = function () {
    var base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + S.cMonth);
    var y = base.getFullYear(), m = base.getMonth(), first = base.getDay(), dim = new Date(y, m + 1, 0).getDate();
    var todayK = dayKey(new Date());
    var evMap = {};
    EVENTS.forEach(function (e) { var k = dayKey(addDays(e.d)); (evMap[k] = evMap[k] || []).push(e); });
    var dow = '';
    for (var i = 0; i < 7; i++) dow += '<span class="dw">' + esc(new Date(2023, 0, 1 + i).toLocaleDateString(LOCALE[lang], { weekday: 'narrow' })) + '</span>';
    var cells = '';
    for (var b = 0; b < first; b++) cells += '<span></span>';
    for (var d = 1; d <= dim; d++) {
      var k = y + '-' + m + '-' + d;
      cells += '<button type="button" data-act="c-sel" data-v="' + k + '" class="' + (k === todayK ? 'today ' : '') + (evMap[k] ? 'has ' : '') + (k === S.cSel ? 'sel' : '') + '"><span>' + d + '</span><i></i></button>';
    }
    var evs = evMap[S.cSel] || [];
    var parts = S.cSel.split('-');
    var selDate = new Date(+parts[0], +parts[1], +parts[2]);
    var list = evs.length ? evs.map(function (e) { return '<div class="ev"><time>' + esc(e.tm) + '</time><div>' + dual(e.t) + '</div></div>'; }).join('') : '<div class="empty">' + esc(st('noEvents')) + '</div>';
    return { html: '<div class="view"><div class="cal-head"><h1>' + esc(fmtDate(base, { month: 'long', year: 'numeric' })) + '</h1><div class="cal-nav"><button type="button" data-act="c-prev" aria-label="prev">&#8249;</button><button type="button" data-act="c-next" aria-label="next">&#8250;</button></div></div><div class="scroll"><div class="cal-grid">' + dow + cells + '</div><div class="ev-list"><div class="ev-title">' + esc(fmtDate(selDate, { weekday: 'long', day: 'numeric', month: 'long' })) + '</div>' + list + '</div></div></div>' };
  };

  /* Clock */
  RENDER.clock = function () {
    function rows() {
      var now = new Date();
      return CITIES.map(function (c) {
        var t = now.toLocaleTimeString('en-GB', { timeZone: c.tz, hour: '2-digit', minute: '2-digit' });
        var d = now.toLocaleDateString(LOCALE[lang], { timeZone: c.tz, weekday: 'short', day: 'numeric', month: 'short' });
        return '<div class="c-row"><div><b>' + esc(lx(c.n)) + '</b><small>' + esc(d) + '</small></div><div class="ct">' + t + '</div></div>';
      }).join('');
    }
    return { html: '<div class="view clock"><div class="navbar"><h1>' + esc(st('world')) + '</h1></div><div class="scroll" id="cRows">' + rows() + '</div></div>',
      init: function (r) { var iv = setInterval(function () { var el = $('#cRows', r); if (el) el.innerHTML = rows(); }, 1000); return function () { clearInterval(iv); }; } };
  };

  /* Settings */
  RENDER.settings = function () {
    return { html: '<div class="view settings"><div class="navbar"><h1>' + esc(st('settings')) + '</h1></div><div class="scroll">' +
      '<div class="s-label">' + esc(st('language')) + '</div><div class="s-card"><div class="langs">' + LANGS.map(function (l) { return '<button type="button" data-act="s-lang" data-v="' + l + '" class="' + (l === lang ? 'on' : '') + '">' + LABEL[l] + '</button>'; }).join('') + '</div></div>' +
      '<div class="s-label">' + esc(st('wallpaper')) + '</div><div class="s-card"><div class="walls">' + WALLS.map(function (w, i) { return '<button type="button" data-act="s-wall" data-v="' + i + '" class="' + (i === wallIdx ? 'on' : '') + '" style="background-image:url(' + w + ')" aria-label="' + (i + 1) + '"></button>'; }).join('') + '</div></div>' +
      '<div class="s-label"></div><div class="s-card">' +
      '<div class="s-row"><span>' + esc(st('sound')) + '</span><button class="switch" type="button" role="switch" data-act="s-sound" aria-checked="' + soundOn + '" aria-label="' + esc(st('sound')) + '"></button></div>' +
      '<div class="s-row"><span>' + esc(st('fullscreen')) + '</span><button class="pill" type="button" data-act="s-full">' + esc(st('fullscreen')) + '</button></div>' +
      '<div class="s-row"><span>' + esc(st('passRow')) + '</span><span class="v">&bull;&bull;&bull;&bull;</span></div></div>' +
      '<div class="s-label">' + esc(st('about')) + '</div><div class="s-card"><div class="s-row"><span>' + esc(st('version')) + '</span><span class="v">1.0</span></div><div class="s-row"><span class="v" style="font-size:13px">' + esc(st('fsHint')) + '</span></div></div></div></div>' };
  };

  /* ---------------- app event delegation ---------------- */
  appBody.addEventListener('click', function (e) {
    var a = e.target.closest('[data-act]'); if (!a) return;
    var act = a.getAttribute('data-act'), v = a.getAttribute('data-v');
    switch (act) {
      case 'k-open': S.kChat = v; break;
      case 'k-back': S.kChat = null; break;
      case 'k-send': sendMsg(); return;
      case 'n-open': S.nOpen = v; break;
      case 'n-back': S.nOpen = null; break;
      case 'i-open': S.iOpen = +v; break;
      case 'i-back': S.iOpen = null; break;
      case 'i-like': S.liked[S.iOpen] = !S.liked[S.iOpen]; break;
      case 'p-open': S.pOpen = +v; break;
      case 'p-back': S.pOpen = null; break;
      case 'c-sel': S.cSel = v; break;
      case 'c-prev': S.cMonth--; break;
      case 'c-next': S.cMonth++; break;
      case 's-lang': setLang(v); return;
      case 's-wall': applyWall(+v); break;
      case 's-sound': setSound(!soundOn); return;
      case 's-full': fullscreen(); return;
      default: return;
    }
    renderApp();
  });

  /* ---------------- boot ---------------- */
  applyWall(wallIdx);
  fit();
  applyI18n();
  setInterval(updateTime, 1000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) updateTime(); });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* offline cache is optional */ }); });
  }
})();
