import { useState } from 'react';
import type { MentorHint } from './types';

export interface MentorWidgetProps {
  readonly hint: MentorHint | undefined;
  readonly visible: boolean;
}

/**
 * Mentor flutuante discreto: mostra a dica determinística atual
 * (`../learning-flow/mentor.ts`, `selectHint` — sem IA real, regra local por
 * número de tentativas). Pequeno, no canto, sem parecer um chat principal —
 * só aparece durante a prática (`visible`) e some quando não há dica
 * desbloqueada ainda.
 *
 * Dispensar a dica atual (`dismissedHintText`) esconde só aquele texto — uma
 * nova tentativa falha com uma nova dica (ex: Hint 1 -> Hint 2) fará a nova dica aparecer
 * normalmente, já que `dismissedHintText` só bate com o texto exato já
 * dispensado.
 */
function MentorWidget({ hint, visible }: MentorWidgetProps) {
  const [dismissedHintText, setDismissedHintText] = useState<string | null>(null);

  if (!visible || hint === undefined || dismissedHintText === hint.text) {
    return null;
  }

  return (
    <div className="mentor" role="status" aria-label="Dica do mentor">
      <span className="mentor__badge" aria-hidden="true">
        ?
      </span>
      <p className="mentor__text">{hint.text}</p>
      <button
        type="button"
        className="mentor__dismiss"
        onClick={() => setDismissedHintText(hint.text)}
        aria-label="Dispensar dica"
      >
        x
      </button>
    </div>
  );
}

export default MentorWidget;
