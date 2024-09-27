import RouteTemplate from 'ember-route-template';

import Title from '@repo/REPLACE_WITH_PACKAGE_NAME/title';

export default RouteTemplate(
  <template>
    <h2 class="title">Test app for your new addon</h2>
    <Title @title="title component" />
    {{outlet}}
  </template>,
);
