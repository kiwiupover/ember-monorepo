import Title from '@repo/docs/components/title';
import RouteTemplate from 'ember-route-template';

export default RouteTemplate(
  <template>
    <h2 class="title">Test app for your new addon</h2>
    <Title @title="Welcome to the test app" />
    {{outlet}}
  </template>,
);
