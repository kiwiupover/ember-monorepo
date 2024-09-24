import Route from '@ember/routing/route';
import { service } from '@ember/service';

// @ts-expect-error ember-simple-auth missing types
import type Session from 'ember-simple-auth/services/session';

export default class ApplicationRoute extends Route {
  @service declare session: Session;

  beforeModel() {
    return this.session.setup();
  }
}
