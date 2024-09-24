import type { TOC } from '@ember/component/template-only';
import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { or } from 'ember-truth-helpers';

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
  {{#let (uniqueId) as |bannerID|}}
    <aside
      class='Banner'
      data-test-component-type='Tui::Banner'
      aria-labelledby={{bannerID}}
      data-stacked={{boolWithDefault @stacked true}}
      ...attributes
    >
      <div
        class='layout'
        data-body={{has-block 'body'}}
        data-actions={{has-block 'actions'}}
      >
        <div class='content-wrapper' data-test-content-wrapper>
          <h2>Heading</h2>

          {{#if (or @description (has-block 'description'))}}
            <p>description</p>
          {{/if}}
        </div>

        {{#if (has-block 'body')}}
          <div class='body-wrapper' data-test-banner-body>
            {{yield to='body'}}
          </div>
        {{/if}}

        {{#if (has-block 'actions')}}
          <div class='actions-wrapper' data-test-banner-actions>
            {{yield to='actions'}}
          </div>
        {{/if}}
      </div>
    </aside>
  {{/let}}
</template>;

export default Banner;
