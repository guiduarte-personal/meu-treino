// ═══════════════════════════════════════════════════════════
// GUI PERSONAL — Google Apps Script API
// Cole este código em: Google Sheets → Extensões → Apps Script
// ═══════════════════════════════════════════════════════════

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const action = (e.parameter.action || '').toLowerCase();
  let result;

  try {
    switch (action) {
      case 'students':
        result = getStudents(ss);
        break;
      case 'exercises':
        result = getExercises(ss);
        break;
      case 'history':
        result = getHistory(ss, e.parameter.aluno, e.parameter.from, e.parameter.to);
        break;
      case 'today':
        result = getToday(ss, e.parameter.aluno);
        break;
      default:
        result = { error: 'Ação inválida. Use: students, exercises, history, today' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let data;

  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return _json({ error: 'JSON inválido' });
  }

  try {
    switch (data.action) {
      case 'add':
        addEntry(ss, data);
        return _json({ success: true });
      case 'delete':
        deleteEntry(ss, data.rowIndex);
        return _json({ success: true });
      case 'update':
        updateEntry(ss, data.rowIndex, data);
        return _json({ success: true });
      case 'addStudent':
        addStudent(ss, data);
        return _json({ success: true });
      case 'updateStudent':
        updateStudent(ss, data.rowIndex, data);
        return _json({ success: true });
      case 'deleteStudent':
        deleteStudent(ss, data.rowIndex);
        return _json({ success: true });
      case 'addExercise':
        addExercise(ss, data);
        return _json({ success: true });
      case 'updateExercise':
        updateExercise(ss, data.rowIndex, data);
        return _json({ success: true });
      case 'deleteExercise':
        deleteExercise(ss, data.rowIndex);
        return _json({ success: true });
      default:
        return _json({ error: 'Ação inválida' });
    }
  } catch (err) {
    return _json({ error: err.message });
  }
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Leitura ──

function getStudents(ss) {
  const sheet = ss.getSheetByName('Alunos');
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1)
    .map((r, i) => ({ r, rowIndex: i + 2 }))
    .filter(({ r }) => r[0])
    .map(({ r, rowIndex }) => {
      const nome = r[0].toString().trim();
      const telefone = (r[1] || '').toString().replace(/\D/g, '');
      const firstName = nome.split(' ')[0];
      const last4 = telefone.slice(-4);
      const id = firstName + last4;
      return {
        rowIndex,
        nome,
        id,
        telefone: r[1] || '',
        email: r[2] || '',
        objetivo: r[3] || '',
        dataInicio: _fmtDate(r[4]),
        obs: r[5] || '',
      };
    });
}

function getExercises(ss) {
  const sheet = ss.getSheetByName('Exercícios');
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1)
    .map((r, i) => ({ r, rowIndex: i + 2 }))
    .filter(({ r }) => r[0])
    .map(({ r, rowIndex }) => ({
      rowIndex,
      nome: r[0].toString().trim(),
      grupo: r[1] || '',
      equipamento: r[2] || '',
    }));
}

function getHistory(ss, aluno, from, to) {
  const sheet = ss.getSheetByName('Treinos');
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  let results = rows.slice(1).map((r, i) => ({
    rowIndex: i + 2,
    data: _fmtDate(r[0]),
    aluno: r[1]?.toString().trim() || '',
    treino: r[2] || '',
    exercicio: r[3] || '',
    series: r[4] || 0,
    reps: r[5] || 0,
    carga: r[6] || 0,
    descanso: r[7] || 0,
    rpe: r[8] || 0,
    duracao: r[9] || 0,
    obs: r[10] || '',
  }));

  if (aluno) {
    // Match by name OR by id (Nome+4dig) for backwards compatibility
    const students = getStudents(ss);
    const aliases = new Set();
    const target = aluno.toLowerCase();
    aliases.add(target);
    for (const s of students) {
      if (s.nome.toLowerCase() === target || s.id.toLowerCase() === target) {
        aliases.add(s.nome.toLowerCase());
        aliases.add(s.id.toLowerCase());
      }
    }
    results = results.filter(r => aliases.has(r.aluno.toLowerCase()));
  }
  if (from) results = results.filter(r => r.data >= from);
  if (to) results = results.filter(r => r.data <= to);

  return results;
}

function getToday(ss, aluno) {
  const today = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd');
  return getHistory(ss, aluno, today, today);
}

// ── Escrita ──

function addEntry(ss, data) {
  const sheet = ss.getSheetByName('Treinos');
  if (!sheet) throw new Error('Aba "Treinos" não encontrada');
  const tz = ss.getSpreadsheetTimeZone();
  const date = data.data || Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  sheet.appendRow([
    date,
    data.aluno || '',
    data.treino || '',
    data.exercicio || '',
    data.series || '',
    data.reps || '',
    data.carga || '',
    data.descanso || '',
    data.rpe || '',
    data.duracao || '',
    data.obs || '',
  ]);
}

function deleteEntry(ss, rowIndex) {
  const sheet = ss.getSheetByName('Treinos');
  if (!sheet) throw new Error('Aba "Treinos" não encontrada');
  if (rowIndex < 2) throw new Error('Não é possível deletar o cabeçalho');
  sheet.deleteRow(rowIndex);
}

function updateEntry(ss, rowIndex, data) {
  const sheet = ss.getSheetByName('Treinos');
  if (!sheet) throw new Error('Aba "Treinos" não encontrada');
  if (rowIndex < 2) throw new Error('Não é possível editar o cabeçalho');
  const vals = [
    data.data, data.aluno, data.treino, data.exercicio,
    data.series, data.reps, data.carga, data.descanso,
    data.rpe, data.duracao, data.obs,
  ];
  const range = sheet.getRange(rowIndex, 1, 1, 11);
  range.setValues([vals]);
}

// ── Alunos CRUD ──

function addStudent(ss, data) {
  const sheet = ss.getSheetByName('Alunos');
  if (!sheet) throw new Error('Aba "Alunos" não encontrada');
  if (!data.nome) throw new Error('Nome é obrigatório');
  sheet.appendRow([
    data.nome || '',
    data.telefone || '',
    data.email || '',
    data.objetivo || '',
    data.dataInicio || Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd'),
    data.obs || '',
  ]);
}

function updateStudent(ss, rowIndex, data) {
  const sheet = ss.getSheetByName('Alunos');
  if (!sheet) throw new Error('Aba "Alunos" não encontrada');
  if (rowIndex < 2) throw new Error('Não é possível editar o cabeçalho');
  const vals = [
    data.nome || '',
    data.telefone || '',
    data.email || '',
    data.objetivo || '',
    data.dataInicio || '',
    data.obs || '',
  ];
  sheet.getRange(rowIndex, 1, 1, 6).setValues([vals]);
}

function deleteStudent(ss, rowIndex) {
  const sheet = ss.getSheetByName('Alunos');
  if (!sheet) throw new Error('Aba "Alunos" não encontrada');
  if (rowIndex < 2) throw new Error('Não é possível deletar o cabeçalho');
  sheet.deleteRow(rowIndex);
}

// ── Exercícios CRUD ──

function addExercise(ss, data) {
  const sheet = ss.getSheetByName('Exercícios');
  if (!sheet) throw new Error('Aba "Exercícios" não encontrada');
  if (!data.nome) throw new Error('Nome é obrigatório');
  sheet.appendRow([
    data.nome || '',
    data.grupo || '',
    data.equipamento || '',
  ]);
}

function updateExercise(ss, rowIndex, data) {
  const sheet = ss.getSheetByName('Exercícios');
  if (!sheet) throw new Error('Aba "Exercícios" não encontrada');
  if (rowIndex < 2) throw new Error('Não é possível editar o cabeçalho');
  sheet.getRange(rowIndex, 1, 1, 3).setValues([[
    data.nome || '',
    data.grupo || '',
    data.equipamento || '',
  ]]);
}

function deleteExercise(ss, rowIndex) {
  const sheet = ss.getSheetByName('Exercícios');
  if (!sheet) throw new Error('Aba "Exercícios" não encontrada');
  if (rowIndex < 2) throw new Error('Não é possível deletar o cabeçalho');
  sheet.deleteRow(rowIndex);
}

// ── Helpers ──

function _fmtDate(d) {
  if (d instanceof Date) {
    try {
      return Utilities.formatDate(d, SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), 'yyyy-MM-dd');
    } catch (e) {
      return '';
    }
  }
  if (typeof d === 'string' && d.includes('/')) {
    const p = d.split('/');
    if (p.length === 3) {
      if (p[2].length === 4) return `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`;
      return `${p[0]}-${p[1].padStart(2,'0')}-${p[2].padStart(2,'0')}`;
    }
  }
  return d?.toString() || '';
}
