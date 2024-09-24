import { pageTitle } from 'ember-page-title';

import RouteTemplate from 'ember-route-template';

// prettier-ignore
export default RouteTemplate(
  <template>
    {{pageTitle "EApp"}}
    <h1 class="from-neutral-800 text-3xl">Embroider App</h1>
    {{outlet}}

  </template>
);
