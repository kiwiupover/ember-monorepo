import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import EngineInstance from '@ember/engine/instance';
import Service from '@ember/service';

import config from '@repo/docs/config/environment';

export default class AppConfigService extends Service {
  /**
   * Application config
   */
  get config() {
    const owner = getOwner(this);
    assert('Expected an owner', owner instanceof EngineInstance);

    return config;
  }
}
