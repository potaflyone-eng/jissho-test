// 不動産ページのデモ（文の型を組み合わせるだけ。外部には何も送らない）

const val = (id) => document.getElementById(id).value.trim();

// ---------- 1. 反響への返信 ----------

const REPLY_BODY = {
  vacancy: {
    ask: 'の空き状況についてお問い合わせいただき',
    main: 'ただいま、最新の空き状況を確認しております。確認でき次第、あらためてご連絡いたします。',
    next: 'もしご覧になりたい日がお決まりでしたら、あわせてお知らせください。空いていた場合に、すぐ内見のご予約をお取りできます。',
    other: '万一ご紹介できなかった場合も、近い条件のお部屋をお探ししてご案内いたします。',
  },
  viewing: {
    ask: 'の内見をご希望いただき',
    main: '内見のご予約を承ります。ご都合のよい日時を、第2希望まで教えていただけますか。',
    next: '当日は、現地での待ち合わせも、店舗からご一緒することもできます。',
    other: 'あわせて近い条件のお部屋もご覧になりたい場合は、まとめてご案内できます。',
  },
  consult: {
    ask: 'についてお問い合わせいただき',
    main: 'ご希望に近いお部屋をお探しいたします。エリア、広さ、ご予算、入居の時期を教えていただけますか。',
    next: '条件をいただければ、本日中に候補をお送りします。',
    other: '「駅からの距離」と「広さ」のどちらを優先されるかも伺えると、より合うお部屋をお選びできます。',
  },
  document: {
    ask: 'の資料をご請求いただき',
    main: '物件の資料（間取り図・設備・費用の内訳）をお送りいたします。',
    next: 'メールとこのメッセージ、どちらでお送りするのがよろしいでしょうか。',
    other: '資料をご覧になって気になる点があれば、お気軽にお聞きください。',
  },
  sell: {
    ask: 'の査定をご依頼いただき',
    main: 'いただいた内容をもとに、査定額の目安をお出しします。あわせて、その金額になる理由（近くで売れた物件の例など）もご説明します。',
    next: 'より正確な金額をお出しするには、一度お住まいを拝見できると安心です。ご都合のよい日時があればお知らせください。',
    other: '「いつごろまでに売りたいか」「住み替え先はお決まりか」も伺えると、売り出し方のご提案までできます。',
    close: [
      'ご売却を決める前の、ご相談だけでも大丈夫です。',
      'ご売却を決める前の、ご相談だけでもかまいません。',
    ],
  },
};

function buildReplies({ company, staff, type, property, time, tone }) {
  const b = REPLY_BODY[type];
  const soft = tone === 'soft';
  const hello = soft ? `お問い合わせありがとうございます！\n${company}の${staff}です。` : `このたびはお問い合わせいただき、誠にありがとうございます。\n${company}の${staff}と申します。`;
  const closed = time === 'closed'
    ? '本日は営業時間外のため、詳しいご案内は明日10時以降になります。お待たせして申し訳ありません。'
    : '';
  const thanks = `「${property}」${b.ask}、ありがとうございます。`;
  const end = soft ? 'どうぞよろしくお願いします。' : '何とぞよろしくお願いいたします。';
  const name = '〇〇様';

  const quick = [name, '', hello, thanks, closed || b.main, '', end].filter((s, i, a) => s !== '' || a[i - 1] !== '').join('\n');
  const standard = [name, '', hello, '', thanks, ...(closed ? [closed] : []), b.main, '', b.next, '', end].filter((s) => s !== null).join('\n').replace(/\n{3,}/g, '\n\n');
  const proposal = [name, '', hello, '', thanks, ...(closed ? [closed] : []), b.main, b.other, '',
    b.close ? b.close[soft ? 0 : 1] : (soft ? '内見は、平日の夕方や土日も対応しています。' : '内見は、平日の夕方や土日も承っております。'),
    soft ? 'ご都合のよい日時があれば、このまま返信で教えてください。' : 'ご都合のよい日時がございましたら、このままご返信ください。', '', end]
    .join('\n').replace(/\n{3,}/g, '\n\n');

  return [
    { title: '案1｜まず一報（短め）', text: quick },
    { title: '案2｜標準', text: standard },
    { title: type === 'sell' ? '案3｜訪問査定・ご提案まで' : '案3｜内見・ご提案まで', text: proposal },
  ];
}

document.getElementById('replyForm').addEventListener('submit', (e) => {
  e.preventDefault();
  renderOutputs(document.getElementById('replyOut'), buildReplies({
    company: val('rp-company') || 'みほん不動産',
    staff: val('rp-staff') || '担当 B',
    type: val('rp-type'),
    property: val('rp-property') || 'お問い合わせの物件',
    time: val('rp-time'),
    tone: val('rp-tone'),
  }));
});

// ---------- 2. 物件紹介文 ----------

// 根拠がないと使えない言葉の例（不動産の表示に関する公正競争規約 18条の特定用語）
const RISKY_WORDS = [
  '完全', '完ぺき', '完璧', '絶対', '万全',
  '日本一', '日本初', '業界一', '当社だけ', '他に類を見ない', '抜群',
  '特選', '厳選', '最高', '最高級', '最上', '一級',
  '買得', 'お買い得', '掘出', '掘り出し', '土地値', '格安', '投売り', '破格', '特安', '激安', 'バーゲン',
];

const KIND = {
  rent: { name: '賃貸マンション', who: 'お部屋' },
  mansion: { name: '中古マンション', who: 'お住まい' },
  house: { name: '中古戸建て', who: 'お住まい' },
  land: { name: '土地', who: '土地' },
};

const walkMin = (m) => (m > 0 ? Math.ceil(m / 80) : 0);

function updateWalk() {
  const m = Number(val('pp-dist'));
  document.getElementById('pp-walk').textContent = m > 0 ? `→ 徒歩${walkMin(m)}分と表示（80m＝1分・切り上げ）` : '';
}

function toggleLandFields() {
  const land = val('pp-kind') === 'land';
  document.getElementById('pp-layout-wrap').style.display = land ? 'none' : '';
  document.getElementById('pp-year-wrap').style.display = land ? 'none' : '';
}

function checkWords(texts) {
  const found = new Set();
  for (const t of texts) for (const w of RISKY_WORDS) if (t.includes(w)) found.add(w);
  return [...found];
}

function buildProperty() {
  const kindKey = val('pp-kind');
  const k = KIND[kindKey];
  const land = kindKey === 'land';
  const station = val('pp-station') || 'みほん駅';
  const walk = walkMin(Number(val('pp-dist')));
  const layout = land ? '' : val('pp-layout');
  const area = val('pp-area');
  const year = Number(val('pp-year'));
  const now = new Date().getFullYear();
  const age = land || !year ? null : now - year;
  const price = val('pp-price');
  const free = val('pp-free');
  // 土地では建物の特徴は使わない
  const BUILDING_ONLY = ['角部屋', '2階以上', 'ペット相談可', 'リフォーム済み'];
  const feats = [...document.querySelectorAll('#pp-features input:checked')].map((c) => c.value)
    .filter((f) => !(land && BUILDING_ONLY.includes(f)));

  const access = walk ? `${station} 徒歩${walk}分` : station;
  const spec = [layout, area ? `${area}㎡` : '', age === null ? '' : age <= 0 ? '築1年未満' : `築${age}年`].filter(Boolean).join('・');
  const featText = feats.length ? feats.join('・') : '';
  const lead = feats.slice(0, 2).join('・');

  const portal = [
    `【${access}】${lead ? lead + 'の' : ''}${land ? '土地' : layout}`,
    '',
    `${access}、${spec || k.name}の${k.name}です。`,
    featText ? `${featText}。` : '',
    land ? '建てたいお住まいのイメージに合わせて、建築の条件もご説明します。' : '暮らしやすさを重視したい方におすすめです。',
    price ? price : '',
    free ? `\n${free}` : '',
  ].filter((s) => s !== '').join('\n');

  const sns = [
    `新着の${k.who}をご紹介します。`,
    '',
    `📍 ${access}`,
    spec ? `🏠 ${spec}` : '',
    featText ? `✨ ${featText}` : '',
    price ? `💴 ${price}` : '',
    '',
    '内見のご予約は、プロフィールのリンクからどうぞ。',
    `#${station.replace(/\s/g, '')} #${k.name} ${feats.includes('ペット相談可') ? '#ペット可物件 ' : ''}${land ? '#土地探し' : kindKey === 'rent' ? '#お部屋探し' : '#住まい探し'}`,
  ].filter((s, i, a) => s !== '' || (a[i - 1] !== '' && i !== a.length - 1)).join('\n');

  const flyer = [
    `見出し：${access}｜${lead || k.name}の${land ? '土地' : layout || k.name}`,
    '',
    '本文：',
    `・${access}`,
    spec ? `・${spec}` : '',
    ...feats.map((f) => `・${f}`),
    price ? `・${price}` : '',
    '',
    '締め：ご見学はお気軽にお問い合わせください。',
  ].filter((s, i, a) => s !== '' || a[i - 1] !== '').join('\n');

  const items = [
    { title: 'ポータル・自社HP用', text: portal },
    { title: 'SNS用', text: sns },
    { title: 'チラシ用（見出し・本文）', text: flyer },
  ];

  const out = document.getElementById('propOut');
  renderOutputs(out, items);

  // 表示ルールのチェック結果
  const warns = [];
  const words = checkWords([free]);
  if (words.length) warns.push(`「${words.join('」「')}」は、根拠となる事実がないと使えない言葉です（公正競争規約の特定用語）。紹介文から外すか、根拠を書き添えてください。`);
  if (age !== null && age <= 0) warns.push('「新築」と書けるのは、建築後1年未満で、まだ誰も住んでいない物件だけです。');
  const box = document.createElement('div');
  box.className = 'check-box ' + (warns.length ? 'warn' : 'ok');
  box.innerHTML = warns.length ? '<b>表示ルールの注意</b>' : '<b>表示ルールのチェック</b>：よく問題になる言葉は見つかりませんでした。';
  if (warns.length) {
    const ul = document.createElement('ul');
    for (const w of warns) {
      const li = document.createElement('li');
      li.textContent = w;
      ul.appendChild(li);
    }
    box.appendChild(ul);
  }
  out.prepend(box);

  // 注意の出た言葉は、紹介文からは外しておく
  if (words.length) {
    for (const pre of out.querySelectorAll('pre')) {
      let t = pre.textContent;
      if (free && t.includes(free)) t = t.replace(`\n\n${free}`, '').replace(free, '').trimEnd();
      pre.textContent = t;
    }
  }
}

document.getElementById('pp-dist').addEventListener('input', updateWalk);
document.getElementById('pp-kind').addEventListener('change', toggleLandFields);
document.getElementById('propForm').addEventListener('submit', (e) => {
  e.preventDefault();
  buildProperty();
});

// 最初から結果を見せておく
updateWalk();
toggleLandFields();
document.getElementById('replyForm').requestSubmit();
document.getElementById('propForm').requestSubmit();
