// 共通：コピーボタンと出力欄の表示（どの業種ページでも使う）

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove('show'), 1400);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // file:// などで clipboard API が使えないとき
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  showToast('コピーしました');
}

// .out-item の中の「コピー」ボタンは、同じ枠の pre をコピーする
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button.copy');
  if (!btn) return;
  const pre = btn.closest('.out-item')?.querySelector('pre');
  if (pre) copyText(pre.textContent);
});

// items: [{title, text}] を出力欄に並べる
function renderOutputs(container, items) {
  container.innerHTML = '';
  for (const it of items) {
    const box = document.createElement('div');
    box.className = 'out-item';
    const head = document.createElement('header');
    head.textContent = it.title;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'コピー';
    head.appendChild(btn);
    const pre = document.createElement('pre');
    pre.textContent = it.text;
    box.append(head, pre);
    container.appendChild(box);
  }
}
