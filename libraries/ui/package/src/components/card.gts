import { guidFor } from '@ember/object/internals';

import Component from '@glimmer/component';

export interface CardSignature {
  Element: HTMLDivElement;
  Args: {
    onClick?: (event: MouseEvent) => void;
  };
  Blocks: {
    default: [];
  };
}

export default class CardComponent extends Component<CardSignature> {
  cardId = `${guidFor(this)}--card`;

  <template>
    <div class="Card" id={{this.cardId}} ...attributes>
      {{yield}}
    </div>
  </template>
}
