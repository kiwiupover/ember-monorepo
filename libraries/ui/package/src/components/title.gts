import type { TOC } from '@ember/component/template-only';
import { service } from '@ember/service';

import { banner } from '@repo/ui/components/banner';

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
