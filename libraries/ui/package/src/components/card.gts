import { guidFor } from '@ember/object/internals';

import Component from '@glimmer/component';

import Title from '@repo/ui/components/title';

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
    <Title @title="Menu" />
    <div class="Card" id={{this.cardId}} ...attributes>
      {{yield}}
    </div>
  </template>
}
