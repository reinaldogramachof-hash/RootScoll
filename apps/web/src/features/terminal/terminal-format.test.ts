import { describe, expect, it } from 'vitest';
import { promptLabel, splitLines } from './terminal-format';

describe('promptLabel', () => {
  it('abrevia o diretorio pessoal para ~', () => {
    expect(promptLabel('/home/aluno')).toBe('aluno@plena:~$');
  });

  it('abrevia subdiretorios do diretorio pessoal para ~/<resto>', () => {
    expect(promptLabel('/home/aluno/projetos')).toBe('aluno@plena:~/projetos$');
  });

  it('mantem caminhos fora do diretorio pessoal por extenso', () => {
    expect(promptLabel('/etc')).toBe('aluno@plena:/etc$');
    expect(promptLabel('/')).toBe('aluno@plena:/$');
  });
});

describe('splitLines', () => {
  it('remove apenas o \\n final de uma saida de uma linha', () => {
    expect(splitLines('/home/aluno\n')).toEqual(['/home/aluno']);
  });

  it('preserva múltiplas linhas, removendo só o \\n final', () => {
    expect(splitLines('abacaxi\nzebra\n')).toEqual(['abacaxi', 'zebra']);
  });

  it('retorna array vazio para string vazia', () => {
    expect(splitLines('')).toEqual([]);
  });

  it('preserva uma linha em branco no meio do conteudo', () => {
    expect(splitLines('a\n\nb\n')).toEqual(['a', '', 'b']);
  });

  it('não adiciona linha vazia extra quando o texto não termina com \\n', () => {
    expect(splitLines('sem-quebra-final')).toEqual(['sem-quebra-final']);
  });

  it('uma unica quebra de linha vira uma linha vazia (echo sem argumentos)', () => {
    expect(splitLines('\n')).toEqual(['']);
  });
});
