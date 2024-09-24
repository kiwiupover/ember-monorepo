import type { TOC } from '@ember/component/template-only';
import { assert } from '@ember/debug';

export interface BannerSignature {
  Element: HTMLElement;
  Args: {
    heading?: string;
    description?: string;
    stacked?: boolean;
    onClose?: () => void;
  };
  Blocks: {
    heading?: [];
    description?: [];
    body?: [];
    actions: [];
  };
}

// remove when we upgrade to ember-source@5.2, and replace with built-in uniqueId
let bannerCount = 0;
function uniqueId(): string {
  return `banner-${bannerCount++}`;
}

function boolWithDefault(
  value: boolean | undefined,
  defaultValue: boolean,
): string {
  return (value ?? defaultValue).toString();
}

export const Banner: TOC<BannerSignature> = <template>
  Jaco
</template>;

export default Banner;
