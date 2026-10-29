// 美容室ページのデモ（文の型を組み合わせるだけ。外部には何も送らない）

const val = (id) => document.getElementById(id).value.trim();

// ---------- 1. 来店後LINE 3通セット ----------

const MENUS = {
  cut: {
    name: 'カット',
    care: '乾かすときは、根元から風を当てると形がまとまりやすくなります。',
    check: '乾かしたときの形やまとまり',
    next: '6〜8週間後',
    nextReason: '形がくずれ始める前に整えると、扱いやすい状態が続きます。',
  },
  color: {
    name: 'カラー',
    care: '洗ったあとはなるべく早く乾かすと、色が長持ちしやすくなります。',
    check: '色の落ち着き具合',
    next: '4〜6週間後',
    nextReason: '根元が伸びてきて、色の差が気になり始めるころです。',
  },
  perm: {
    name: 'パーマ',
    care: '濡れた状態でスタイリング剤をなじませると、カールが出やすくなります。',
    check: 'カールの出方やスタイリングのしやすさ',
    next: '2〜3か月後',
    nextReason: 'カールがゆるんできて、かけ直しや毛先のカットを考えるころです。',
  },
  straight: {
    name: '縮毛矯正',
    care: '寝る前にしっかり乾かしておくと、まっすぐな状態を保ちやすくなります。',
    check: '朝のまとまりやすさ',
    next: '3〜4か月後',
    nextReason: '根元のくせが出てきて、気になり始めるころです。',
  },
  treatment: {
    name: 'トリートメント',
    care: 'ドライヤーの前に洗い流さないトリートメントを使うと、手触りが続きやすくなります。',
    check: '手触りやまとまり',
    next: '3〜4週間後',
    nextReason: '続けていただくと、手触りの良さを保ちやすくなります。',
  },
};

function buildLineMessages({ shop, staff, menuKey, tone }) {
  const m = MENUS[menuKey];
  const p = tone === 'polite';
  const name = '〇〇様';

  const thanks = p
    ? `${name}

昨日は${shop}にお越しいただき、ありがとうございました。
担当の${staff}です。

${m.name}の仕上がりはいかがでしょうか。
ご自宅でのお手入れのポイントを、ひとつお送りします。

${m.care}

気になることがあれば、このLINEにいつでもご連絡ください。`
    : `${name}、昨日はありがとうございました！
${shop}の${staff}です。

${m.name}、お家で扱ってみてどうですか？
お手入れのコツをひとつだけ。

${m.care}

何かあったら、このLINEに気軽に送ってくださいね。`;

  const check = p
    ? `${name}

${shop}の${staff}です。
${m.name}から2週間ほどたちましたが、${m.check}はいかがでしょうか。

「ここが少し気になる」ということがあれば、お気軽にお聞かせください。
次回のご来店のときに、調整のご提案をいたします。`
    : `${name}、こんにちは！
${shop}の${staff}です。

${m.name}から2週間くらいたちましたね。
${m.check}はどうですか？

気になるところがあれば、次に来てもらうときに一緒に調整しましょう。`;

  const next = p
    ? `${name}

${shop}の${staff}です。
前回の${m.name}から、そろそろ次のおすすめの時期になります。

${m.nextReason}

ご都合のよい日があれば、このLINEでご予約いただけます。
またお会いできるのを楽しみにしております。`
    : `${name}、こんにちは！
${shop}の${staff}です。

前回の${m.name}から、そろそろ次のタイミングです。
${m.nextReason}

都合のいい日があれば、このLINEで予約できます。
また会えるのを楽しみにしています！`;

  return [
    { title: '1通目｜来店の翌日に送る「お礼」', text: thanks },
    { title: '2通目｜2週間後に送る「様子伺い」', text: check },
    { title: `3通目｜${m.next}に送る「次回のご案内」`, text: next },
  ];
}

document.getElementById('lineForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const items = buildLineMessages({
    shop: val('lf-shop') || 'ヘアサロン みほん',
    staff: val('lf-staff') || 'スタイリスト A',
    menuKey: val('lf-menu'),
    tone: val('lf-tone'),
  });
  renderOutputs(document.getElementById('lineOut'), items);
});

// ---------- 2. 口コミ返信の下書き ----------

// 口コミの中の言葉と、返信で触れる話題
const TOPICS = [
  { re: /カラー|色味|髪色|ブリーチ/, good: 'カラーの色味', bad: 'カラーの仕上がり' },
  { re: /カット|長さ|前髪|ボブ|ショート/, good: 'カットの仕上がり', bad: 'カットの仕上がり' },
  { re: /パーマ|カール/, good: 'パーマの仕上がり', bad: 'パーマの仕上がり' },
  { re: /縮毛|ストレート|矯正/, good: '縮毛矯正の仕上がり', bad: '縮毛矯正の仕上がり' },
  { re: /トリートメント|手触り|ツヤ/, good: '髪の手触り', bad: 'トリートメントの仕上がり' },
  { re: /相談|カウンセリング|提案|聞いて/, good: 'ご相談の時間', bad: 'カウンセリング' },
  { re: /接客|対応|親切|丁寧|優しい|感じが良/, good: 'スタッフの対応', bad: 'スタッフの対応' },
  { re: /雰囲気|居心地|おしゃれ|清潔|落ち着/, good: 'お店の雰囲気', bad: 'お店の環境' },
];
const WAIT = /待ち|待た|遅れ|時間がかか|押して/;
const PRICE = /値段|料金|高い|高かった|追加料金/;

function analyzeReview(text) {
  const goods = [];
  const bads = [];
  for (const t of TOPICS) {
    if (t.re.test(text)) {
      goods.push(t.good);
      bads.push(t.bad);
    }
  }
  return {
    goods: [...new Set(goods)].slice(0, 2),
    bads: [...new Set(bads)].slice(0, 1),
    wait: WAIT.test(text),
    price: PRICE.test(text),
    first: /初めて|はじめて|初来店/.test(text),
    again: /また(行|来|伺|お願い)|リピート|次回も/.test(text),
  };
}

function joinTopics(list) {
  return list.length === 2 ? `${list[0]}や${list[1]}` : list[0];
}

function buildReviewReplies({ shop, text, star }) {
  const a = analyzeReview(text);
  const greet = a.first ? 'このたびは初めてのご来店、ありがとうございました。' : 'このたびはご来店いただき、ありがとうございました。';
  const sign = `${shop} スタッフ一同`;

  // 気になった点への一言
  const concerns = [];
  if (a.wait) concerns.push('お待たせしてしまい、申し訳ございませんでした。予約の間隔を見直し、お時間どおりにご案内できるよう努めます。');
  if (a.price) concerns.push('料金について、事前のご説明が足りなかったかもしれません。施術の前に、お見積もりをはっきりお伝えするようにいたします。');

  if (star >= 4) {
    const praise = a.goods.length
      ? `${joinTopics(a.goods)}について、うれしいお言葉をいただき励みになります。`
      : 'あたたかいお言葉をいただき、スタッフ一同とても励みになります。';
    const closing = a.again ? 'またお会いできる日を、楽しみにお待ちしております。' : 'またのご来店を、心よりお待ちしております。';
    return [
      { title: '案1｜短め', text: `${greet}\n${praise}\n${closing}\n${sign}` },
      { title: '案2｜標準', text: [greet, praise, ...concerns, '次回も、ご希望をじっくり伺いながら仕上げてまいります。', closing, sign].join('\n') },
      { title: '案3｜ていねい', text: [`${greet}\nお忙しいなか、口コミまでお寄せいただき本当にありがとうございます。`, praise, ...concerns, '髪のことで気になることがあれば、次回のご来店時でも、お電話でも、お気軽にご相談ください。', closing, sign].join('\n\n') },
    ];
  }

  if (star === 3) {
    const praise = a.goods.length ? `${joinTopics(a.goods)}について触れていただき、ありがとうございます。` : '率直なご感想をいただき、ありがとうございます。';
    const fix = concerns.length ? concerns : ['ご満足いただけなかった点があれば、ぜひ次回のご来店時にお聞かせください。'];
    return [
      { title: '案1｜短め', text: `${greet}\n${praise}\n${fix[0]}\n${sign}` },
      { title: '案2｜標準', text: [greet, praise, ...fix, '次回はより満足いただけるよう、仕上がりのご希望を丁寧に確認いたします。', sign].join('\n') },
      { title: '案3｜ていねい', text: [greet, `${praise}\nいただいたご意見は、スタッフ全員で共有いたしました。`, ...fix, 'またお越しいただける機会がありましたら、ご希望を最初に伺ったうえで施術いたします。', sign].join('\n\n') },
    ];
  }

  // 星1〜2：言い訳をせず、まず謝る。詳しくは個別に伺う
  const about = a.bads.length ? `${a.bads[0]}について、ご期待に沿えず` : 'ご期待に沿えず';
  const apology = `${about}申し訳ございませんでした。`;
  const fix = concerns.length ? concerns : ['いただいたご意見は、スタッフ全員で共有し、改善に努めてまいります。'];
  const contact = 'もしよろしければ、お店まで直接ご連絡ください。詳しくお話を伺い、できる限りの対応をいたします。';
  return [
    { title: '案1｜短め', text: `${greet}\n${apology}\n${fix[0]}\n${sign}` },
    { title: '案2｜標準', text: [greet, apology, ...fix, contact, sign].join('\n') },
    { title: '案3｜ていねい', text: [`${greet}\nまた、率直なご意見をお寄せいただき、ありがとうございます。`, apology, ...fix, contact, sign].join('\n\n') },
  ];
}

document.getElementById('reviewForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const items = buildReviewReplies({
    shop: val('rf-shop') || 'ヘアサロン みほん',
    text: val('rf-text'),
    star: Number(val('rf-star')),
  });
  renderOutputs(document.getElementById('reviewOut'), items);
});

// 最初から結果を見せておく
document.getElementById('lineForm').requestSubmit();
document.getElementById('reviewForm').requestSubmit();
