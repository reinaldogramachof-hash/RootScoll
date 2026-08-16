import { useState } from 'react';
import type { MentorHint } from './types';

export interface MentorWidgetProps {
  readonly hint: MentorHint | undefined;
  readonly visible: boolean;
}

/**
 * Mentor flutuante discreto: mostra a dica deterministica atual
 * (`../learning-flow/mentor.ts`, `selectHint` — sem IA real, regra local por
 * numero de tentativas). Pequeno, no canto, sem parecer um chat principal —
 * so aparece durante a pratica (`visible`) e some quando nao ha dica
 * desbloqueada ainda.
 *
 * Dispensar a dica atual (`dismissedHintText`) esconde so aquele texto — uma
 * dica NOVA (tier mais alto, liberada por mais tentativas) volta a aparecer
 * normalmente, ja que `dismissedHintText` so bate com o texto exato ja
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
