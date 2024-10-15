import type { TOC } from '@ember/component/template-only';
import type { HTMLElement } from '@ember/glimmer';

export interface TitleSignature {
  Element: HTMLElement;
  Args: {
    title?: string;
  };
}

export const Title: TOC<TitleSignature> = <template>
  <h2 class="title" ...attributes>
    {{@title}}
  </h2>
  A title
</template>;

export default Title;
