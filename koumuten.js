// 工務店ページのデモ（文の型を組み合わせるだけ。外部には何も送らない）

const val = (id) => document.getElementById(id).value.trim();

// ---------- 1. 施工事例の紹介文 ----------

const CASE_KIND = {
  bath: { name: '浴室リフォーム', tags: ['#浴室リフォーム', '#お風呂リフォーム', '#ユニットバス'], after: '毎日のお風呂の時間が、あたたかく安心なものになりました。' },
  kitchen: { name: 'キッチンリフォーム', tags: ['#キッチンリフォーム', '#システムキッチン'], after: 'お料理と片づけが、ぐっと楽になりました。' },
  paint: { name: '外壁・屋根塗装', tags: ['#外壁塗装', '#屋根塗装', '#塗り替え'], after: '見た目が新しくなっただけでなく、雨や日差しからお住まいを守る力も戻りました。' },
  whole: { name: '全面リフォーム', tags: ['#全面リフォーム', '#リノベーション'], after: '間取りと設備を見直し、いまの暮らしに合うお住まいになりました。' },
  insul: { name: '内窓・断熱リフォーム', tags: ['#内窓', '#断熱リフォーム', '#結露対策'], after: '冬の寒さと結露が和らぎ、お部屋で過ごしやすくなりました。' },
};

function buildCase() {
  const k = CASE_KIND[val('cs-kind')];
  const area = val('cs-area') || 'みほん市';
  const age = Number(val('cs-age'));
  const period = val('cs-period');
  const worry = val('cs-worry');
  const work = val('cs-work');
  const voice = val('cs-voice');
  const ageText = age > 0 ? `築${age}年の` : '';

  const hp = [
    `【${area}】${ageText}お住まいの${k.name}`,
    '',
    '■ お悩み',
    worry ? `「${worry}」とのご相談をいただきました。` : 'お住まいについてご相談をいただきました。',
    '',
    '■ ご提案と工事の内容',
    work ? `${work}。` : '',
    period ? `工期は${period}です。` : '',
    '',
    '■ 仕上がり',
    k.after,
    ...(voice ? ['', '■ お客様の声', `「${voice}」`] : []),
    '',
    '同じようなお悩みがあれば、お気軽にご相談ください。',
  ].filter((s, i, a) => s !== '' || a[i - 1] !== '').join('\n');

  const insta = [
    `${area}で${k.name}をしました。`,
    '',
    worry ? `ご相談：${worry}` : '',
    work ? `工事：${work}` : '',
    period ? `工期：${period}` : '',
    '',
    voice ? `お客様から「${voice}」とのお言葉をいただきました。` : k.after,
    '',
    'ご相談・お見積もりはプロフィールのリンクからどうぞ。',
    `#${area.replace(/\s/g, '')} ${k.tags.join(' ')} #施工事例`,
  ].filter((s, i, a) => s !== '' || (a[i - 1] !== '' && i !== a.length - 1)).join('\n');

  const gbp = [
    `${area}で、${ageText}お住まいの${k.name}をしました。`,
    '',
    worry ? `「${worry}」とのご相談でした。` : '',
    [work ? `${work}。` : '', period ? `工期は${period}です。` : ''].join(''),
    '',
    `${k.name}のご相談・お見積もりは、お電話またはメッセージからお気軽にどうぞ。`,
  ].filter((s, i, a) => s !== '' || a[i - 1] !== '').join('\n');

  renderOutputs(document.getElementById('caseOut'), [
    { title: 'HP（施工事例ページ）用', text: hp },
    { title: 'Instagram用', text: insta },
    { title: 'Googleマップ投稿用', text: gbp },
  ]);
}

document.getElementById('caseForm').addEventListener('submit', (e) => {
  e.preventDefault();
  buildCase();
});

// ---------- 3. 問い合わせ・現地調査の返信 ----------

const INQ_BODY = {
  estimate: {
    ask: 'のお見積もりのご依頼をいただき',
    main: '正確なお見積もりのため、一度お住まいを拝見したいと考えております。ご都合のよい日時を、第2希望まで教えていただけますか。',
    next: 'あわせて、気になっている箇所のお写真を送っていただけると、当日のご説明がスムーズです。',
    other: 'ご予算の目安や、いつごろまでに工事を終えたいかも伺えると、合ったご提案ができます。',
  },
  survey: {
    ask: 'の現地調査のご希望をいただき',
    main: '現地調査を承ります。ご都合のよい日時を、第2希望まで教えていただけますか。',
    next: '調査は1時間ほどで、お見積もりは後日お届けします。調査だけで費用がかかることはありません。',
    other: '当日は、ご家族で気になっていることをメモしておいていただくと、聞き漏れがありません。',
  },
  urgent: {
    ask: 'についてご連絡いただき',
    main: 'ご不安な状況かと思います。被害が広がらないよう、できるだけ早く伺える日時をお調べします。',
    next: 'それまでの間は、水がかかる場所のコンセントを抜き、バケツやタオルで受けておいてください。お写真を送っていただければ、急ぎの度合いをお伝えします。',
    other: '本格的な工事の前に、まず応急の処置だけ行うこともできます。伺ったときにご相談ください。',
  },
  subsidy: {
    ask: 'の補助金についてご質問いただき',
    main: '補助金は、年度や自治体によって条件と受付期間が変わります。最新の条件を確認して、使えそうなものをご案内いたします。',
    next: 'お住まいの市区町村と、工事のご予定時期を教えていただけますか。',
    other: '補助金によっては、工事の契約や着工の前に申請が必要なものもあります。早めにご相談いただけると安心です。',
  },
};

function buildInquiry({ company, staff, type, work, time, tone }) {
  const b = INQ_BODY[type];
  const soft = tone === 'soft';
  const hello = soft ? `お問い合わせありがとうございます！\n${company}の${staff}です。` : `このたびはお問い合わせいただき、誠にありがとうございます。\n${company}の${staff}と申します。`;
  const closed = time === 'closed'
    ? '本日は営業時間外のため、詳しいご案内は明日の朝以降になります。お待たせして申し訳ありません。'
    : '';
  const thanks = `「${work}」${b.ask}、ありがとうございます。`;
  const end = soft ? 'どうぞよろしくお願いします。' : '何とぞよろしくお願いいたします。';
  const name = '〇〇様';
  const tidy = (lines) => lines.join('\n').replace(/\n{3,}/g, '\n\n');

  const quick = tidy([name, '', hello, thanks, closed || b.main, '', end]);
  const standard = tidy([name, '', hello, '', thanks, ...(closed ? [closed] : []), b.main, '', b.next, '', end]);
  const proposal = tidy([name, '', hello, '', thanks, ...(closed ? [closed] : []), b.main, b.next, '', b.other, '',
    soft ? 'ご都合のよい日時があれば、このまま返信で教えてください。' : 'ご都合のよい日時がございましたら、このままご返信ください。', '', end]);

  return [
    { title: '案1｜まず一報（短め）', text: quick },
    { title: '案2｜標準', text: standard },
    { title: '案3｜ご提案まで', text: proposal },
  ];
}

document.getElementById('inqForm').addEventListener('submit', (e) => {
  e.preventDefault();
  renderOutputs(document.getElementById('inqOut'), buildInquiry({
    company: val('iq-company') || 'みほん工務店',
    staff: val('iq-staff') || '担当 B',
    type: val('iq-type'),
    work: val('iq-work') || 'お問い合わせの工事',
    time: val('iq-time'),
    tone: val('iq-tone'),
  }));
});

// ---------- 写真＋ひとことの工事報告 ----------

const REPORT_STAGE = {
  demolish: { done: '解体が終わりました', photo: '解体後の様子です', next: '下地の補修と配管の工事' },
  base: { done: '下地の補修と配管の工事が終わりました', photo: '新しい配管と下地の様子です', next: '設備の取り付け' },
  install: { done: '設備の取り付けが終わりました', photo: '取り付けた設備の様子です', next: '内装の仕上げ' },
  finish: { done: '内装の仕上げが終わりました', photo: '仕上がりの様子です', next: '最終の確認とお掃除' },
};

function buildReport({ company, kind, stage, voice, tone }) {
  const s = REPORT_STAGE[stage];
  const soft = tone === 'soft';
  const memo = voice ? `\n${voice.replace(/[。]?$/, '。')}` : '';
  const text = [
    '〇〇様',
    soft ? `${company}です。今日の${kind}の様子をお知らせします！` : `${company}でございます。本日の${kind}の進み具合をご報告いたします。`,
    '',
    `本日、${s.done}。`,
    `写真は、${s.photo}。${memo}`,
    '',
    `明日からは、${s.next}に入ります。`,
    soft ? '気になることがあれば、いつでもこのLINEでどうぞ。' : 'ご不明な点がございましたら、このLINEでお気軽にお尋ねください。',
  ].join('\n');
  return [{ title: 'お施主様へのLINE報告（AIが作る下書き）', text }];
}

document.getElementById('repForm').addEventListener('submit', (e) => {
  e.preventDefault();
  renderOutputs(document.getElementById('repOut'), buildReport({
    company: val('rp-company') || 'みほん工務店',
    kind: val('rp-kind') || '工事',
    stage: val('rp-stage'),
    voice: val('rp-voice'),
    tone: val('rp-tone'),
  }));
});

// 最初から結果を見せておく
document.getElementById('caseForm').requestSubmit();
document.getElementById('inqForm').requestSubmit();
document.getElementById('repForm').requestSubmit();
