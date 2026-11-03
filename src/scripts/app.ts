type Campo = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function abrirDialogo(dlg: HTMLDialogElement, item?: Record<string, unknown>, titulo?: string) {
  const form = dlg.querySelector('form')!;
  form.reset();
  const idCampo = form.elements.namedItem('id') as HTMLInputElement | null;
  if (idCampo) idCampo.value = '';
  if (item) {
    for (const [k, v] of Object.entries(item)) {
      const el = form.elements.namedItem(k) as Campo | null;
      if (el && 'value' in el && !(el instanceof RadioNodeList)) {
        let valor = v == null ? '' : String(v);
        const prefixo = el.dataset.prefixo;
        if (prefixo && valor.startsWith(prefixo)) valor = valor.slice(prefixo.length).trim();
        el.value = valor;
      }
    }
  }
  dlg.querySelector('[data-titulo]')!.textContent = titulo || dlg.dataset.tituloNovo || '';
  dlg.querySelector<HTMLElement>('[data-erro]')!.hidden = true;
  dlg.showModal();
  const primeiro = form.querySelector<Campo>('.dialog-body input:not([type=hidden]), .dialog-body select');
  primeiro?.focus();
}

function initDialogos() {
  document.addEventListener('click', (e) => {
    const alvo = e.target as HTMLElement;
    const abre = alvo.closest<HTMLElement>('[data-abrir]');
    if (abre) {
      const dlg = document.getElementById(abre.dataset.abrir!) as HTMLDialogElement | null;
      if (dlg) abrirDialogo(dlg, abre.dataset.item ? JSON.parse(abre.dataset.item) : undefined, abre.dataset.titulo);
      return;
    }
    if (alvo.closest('[data-fechar]')) {
      alvo.closest('dialog')?.close();
      return;
    }
    if (alvo instanceof HTMLDialogElement && alvo.open) {
      const r = alvo.getBoundingClientRect();
      const ev = e as MouseEvent;
      const fora = ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom;
      if (fora) alvo.close();
    }
  });

  document.querySelectorAll<HTMLFormElement>('dialog form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      const faltando = [...form.querySelectorAll<Campo>('[data-required]')]
        .filter((el) => !el.value.trim())
        .map((el) => el.dataset.label);
      const erro = form.querySelector<HTMLElement>('[data-erro]')!;
      if (faltando.length) {
        e.preventDefault();
        erro.textContent = 'Preencha: ' + faltando.join(', ');
        erro.hidden = false;
      }
    });
  });

  const params = new URLSearchParams(location.search);
  if (params.get('novo')) {
    document.querySelector<HTMLElement>('[data-novo]')?.click();
    params.delete('novo');
    const q = params.toString();
    history.replaceState(null, '', location.pathname + (q ? '?' + q : ''));
  }
}

function initConfirmacoes() {
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const pergunta = form.dataset.confirm;
    if (pergunta && !confirm(pergunta)) e.preventDefault();
  });
}

function initFiltros() {
  document.querySelectorAll<HTMLElement>('[data-filtro]').forEach((box) => {
    const busca = box.querySelector<HTMLInputElement>('[data-busca]');
    const radios = [...box.querySelectorAll<HTMLInputElement>('input[data-grupo]')];
    const itens = [...document.querySelectorAll<HTMLElement>(`[data-lista="${box.dataset.filtro}"] [data-item-texto]`)];
    const vazio = document.querySelector<HTMLElement>(`[data-vazio="${box.dataset.filtro}"]`);
    const aplicar = () => {
      const q = (busca?.value ?? '').trim().toLowerCase();
      const grupo = radios.find((r) => r.checked)?.value ?? 'Todos';
      let visiveis = 0;
      for (const it of itens) {
        const ok =
          (grupo === 'Todos' || it.dataset.itemGrupo === grupo) && (it.dataset.itemTexto ?? '').toLowerCase().includes(q);
        it.hidden = !ok;
        if (ok) visiveis++;
      }
      if (vazio) vazio.hidden = visiveis > 0;
    };
    busca?.addEventListener('input', aplicar);
    radios.forEach((r) => r.addEventListener('change', aplicar));
    aplicar();
  });
}

function initAutosave() {
  document.querySelectorAll<HTMLTextAreaElement>('textarea[data-autosave]').forEach((ta) => {
    const status = document.querySelector<HTMLElement>(`[data-status-de="${ta.id}"]`);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pendente: Promise<void> = Promise.resolve();
    const salvar = () => {
      const texto = ta.value;
      pendente = pendente.then(async () => {
        try {
          const r = await fetch(ta.dataset.autosave!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notas: texto }),
          });
          if (status) status.textContent = r.ok ? 'Salvo' : 'Não foi possível salvar';
        } catch {
          if (status) status.textContent = 'Sem conexão — não salvo';
        }
      });
    };
    ta.addEventListener('input', () => {
      if (status) status.textContent = 'Salvando…';
      clearTimeout(timer);
      timer = setTimeout(salvar, 600);
    });
    ta.addEventListener('blur', () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
        salvar();
      }
    });
  });
}

function initQuadro() {
  const quadro = document.querySelector<HTMLElement>('[data-quadro]');
  if (!quadro) return;
  const api = quadro.dataset.quadro!;
  const colunas = [...quadro.querySelectorAll<HTMLElement>('[data-col]')];
  const feitas = document.querySelector<HTMLElement>('[data-feitas]');

  const colunaDe = (t: HTMLElement) => t.closest<HTMLElement>('[data-col]')!;

  const atualizarContagens = () => {
    for (const c of colunas) c.querySelector('[data-contagem]')!.textContent = String(c.querySelectorAll('[data-tarefa]').length);
    if (feitas) feitas.textContent = String(colunas[2]?.querySelectorAll('[data-tarefa]').length ?? 0);
  };

  const colocar = (t: HTMLElement, col: HTMLElement) => {
    const lista = col.querySelector('[data-lista-col]')!;
    const ordem = Number(t.dataset.ordem);
    const depois = [...lista.querySelectorAll<HTMLElement>('[data-tarefa]')].find(
      (x) => x !== t && Number(x.dataset.ordem) > ordem,
    );
    lista.insertBefore(t, depois ?? null);
    atualizarContagens();
  };

  const mover = async (t: HTMLElement, destino: HTMLElement) => {
    const origem = colunaDe(t);
    if (origem === destino) return;
    colocar(t, destino);
    t.classList.add('salvando');
    try {
      const r = await fetch(api + encodeURIComponent(t.dataset.tarefa!), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ col: Number(destino.dataset.col) }),
      });
      if (!r.ok) throw new Error(String(r.status));
    } catch {
      colocar(t, origem);
      alert('Não foi possível mover a tarefa. Verifique a conexão e tente de novo.');
    } finally {
      t.classList.remove('salvando');
    }
  };

  quadro.addEventListener('click', (e) => {
    const botao = (e.target as HTMLElement).closest<HTMLElement>('[data-mover]');
    if (!botao) return;
    const t = botao.closest<HTMLElement>('[data-tarefa]')!;
    const destino = colunas[colunas.indexOf(colunaDe(t)) + Number(botao.dataset.mover)];
    if (destino) mover(t, destino);
  });

  let arrastada: HTMLElement | null = null;
  quadro.addEventListener('dragstart', (e) => {
    arrastada = (e.target as HTMLElement).closest<HTMLElement>('[data-tarefa]');
    if (!arrastada) return;
    e.dataTransfer!.effectAllowed = 'move';
    e.dataTransfer!.setData('text/plain', arrastada.dataset.tarefa!);
    arrastada.classList.add('arrastando');
  });
  quadro.addEventListener('dragend', () => {
    arrastada?.classList.remove('arrastando');
    arrastada = null;
    colunas.forEach((c) => c.classList.remove('soltar-aqui'));
  });
  for (const col of colunas) {
    col.addEventListener('dragover', (e) => {
      if (!arrastada) return;
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'move';
      colunas.forEach((c) => c.classList.toggle('soltar-aqui', c === col && c !== colunaDe(arrastada!)));
    });
    col.addEventListener('dragleave', (e) => {
      if (!col.contains(e.relatedTarget as Node | null)) col.classList.remove('soltar-aqui');
    });
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('soltar-aqui');
      if (arrastada) mover(arrastada, col);
    });
  }
}

function initDiversos() {
  document.querySelectorAll<HTMLSelectElement>('select[data-ir]').forEach((s) =>
    s.addEventListener('change', () => (location.href = s.value)),
  );
  document.querySelectorAll<HTMLElement>('[data-some]').forEach((el) => {
    setTimeout(() => (el.hidden = true), Number(el.dataset.some) || 2500);
  });
  const params = new URLSearchParams(location.search);
  if (params.has('erro') || params.has('salvo')) {
    params.delete('erro');
    params.delete('salvo');
    const q = params.toString();
    history.replaceState(null, '', location.pathname + (q ? '?' + q : ''));
  }
}

export function initApp() {
  initDialogos();
  initConfirmacoes();
  initFiltros();
  initAutosave();
  initQuadro();
  initDiversos();
}
