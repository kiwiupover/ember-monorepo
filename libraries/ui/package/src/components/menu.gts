import { guidFor } from '@ember/object/internals';

import Component from '@glimmer/component';

import Title from '@repo/ui/components/title';

export interface MenuSignature {
  Element: HTMLDivElement;
  Args: {
    onClick?: (event: MouseEvent) => void;
  };
  Blocks: {
    default: [];
  };
}

export default class MenuComponent extends Component<MenuSignature> {
  menuId = `${guidFor(this)}--menu`;

  <template>
    <Title @title="Menu" />
    <div class="Menu" role="menu" id={{this.menuId}} ...attributes>
      {{yield}}
    </div>
  </template>
}
