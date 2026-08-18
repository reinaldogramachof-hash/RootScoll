import type { ExecutionResult, ValidationRule, ValidationOutcome } from '@codechat/types';

/**
 * Avalia uma única regra de validação (ValidationRule) contra um ExecutionResult.
 * Retorna um ValidationOutcome ('success' ou 'failure' com mensagem descritiva).
 */
export function evaluateRule(rule: ValidationRule, result: ExecutionResult): ValidationOutcome {
  switch (rule.kind) {
    case 'exit-code': {
      const pass = result.exitCode === rule.value;
      return {
        verdict: pass ? 'success' : 'failure',
        message: pass
          ? `Código de saída ${rule.value} confirmado.`
          : `Esperado código de saída ${rule.value}, mas recebeu ${result.exitCode}.`,
      };
    }

    case 'cwd': {
      const pass = result.filesystem.cwd === rule.path;
      return {
        verdict: pass ? 'success' : 'failure',
        message: pass
          ? `Diretório atual correto: ${rule.path}`
          : `Diretório esperado ${rule.path}, mas está em ${result.filesystem.cwd}`,
      };
    }

    case 'file-exists': {
      const entry = result.filesystem.entries.find((e) => e.path === rule.path);
      const pass = entry !== undefined && entry.kind === rule.as;
      return {
        verdict: pass ? 'success' : 'failure',
        message: pass
          ? `Item ${rule.path} existe como ${rule.as}.`
          : `Item ${rule.path} (${rule.as}) não foi encontrado no sistema de arquivos.`,
      };
    }

    case 'file-not-exists': {
      const entry = result.filesystem.entries.find((e) => e.path === rule.path);
      const pass = entry === undefined;
      return {
        verdict: pass ? 'success' : 'failure',
        message: pass
          ? `Item ${rule.path} foi removido com sucesso.`
          : `O item ${rule.path} ainda existe no sistema de arquivos.`,
      };
    }

    case 'file-content': {
      const entry = result.filesystem.entries.find((e) => e.path === rule.path);
      if (!entry || entry.content === undefined) {
        return {
          verdict: 'failure',
          message: `Arquivo ${rule.path} não existe para validação de conteúdo.`,
        };
      }

      let pass = false;
      if (rule.match === 'contains') {
        pass = entry.content.includes(rule.value);
      } else if (rule.match === 'equals') {
        pass = entry.content.trim() === rule.value.trim();
      } else if (rule.match === 'regex') {
        pass = new RegExp(rule.pattern).test(entry.content);
      }

      return {
        verdict: pass ? 'success' : 'failure',
        message: pass
          ? `Conteúdo do arquivo ${rule.path} atende ao critério de validação.`
          : `Conteúdo de ${rule.path} não contém a mensagem esperada.`,
      };
    }

    case 'output-contains': {
      const combinedOutput = `${result.stdout}\n${result.stderr}`;
      const pass = combinedOutput.includes(rule.text);
      return {
        verdict: pass ? 'success' : 'failure',
        message: pass
          ? `Saída do terminal contém o texto esperado.`
          : `A saída do terminal não contém "${rule.text}".`,
      };
    }

    case 'command-executed': {
      const regex = new RegExp(rule.pattern, 'i');
      const pass = regex.test(result.command);
      return {
        verdict: pass ? 'success' : 'failure',
        message: pass
          ? `Comando atende ao padrão esperado.`
          : `O comando executado "${result.command}" não corresponde ao padrão esperado.`,
      };
    }

    case 'any': {
      const outcomes = rule.rules.map((r) => evaluateRule(r, result));
      const anySuccess = outcomes.some((o) => o.verdict === 'success');
      return {
        verdict: anySuccess ? 'success' : 'failure',
        message: anySuccess
          ? 'Pelo menos uma regra de validação alternável passou.'
          : 'Nenhuma das regras de validação alternativas foi satisfeita.',
      };
    }

    case 'none': {
      const outcomes = rule.rules.map((r) => evaluateRule(r, result));
      const noneFailed = outcomes.every((o) => o.verdict !== 'success');
      return {
        verdict: noneFailed ? 'success' : 'failure',
        message: noneFailed
          ? 'Nenhuma regra proibida foi violada.'
          : 'Uma regra proibida foi violada.',
      };
    }

    default:
      return { verdict: 'success', message: 'Regra genérica aprovada.' };
  }
}

/**
 * Avalia uma lista de regras de validação (E lógico).
 * Retorna sucesso somente se TODAS as regras passarem.
 */
export function evaluateRules(
  rules: readonly ValidationRule[],
  result: ExecutionResult
): ValidationOutcome {
  if (rules.length === 0) {
    return { verdict: 'success', message: 'Nenhuma regra configurada.' };
  }

  for (const rule of rules) {
    const outcome = evaluateRule(rule, result);
    if (outcome.verdict === 'failure') {
      return outcome;
    }
  }

  return {
    verdict: 'success',
    message: 'Todas as verificações de objetivo da lição foram concluídas com sucesso!',
  };
}
