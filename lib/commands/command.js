
import { version } from '../../package.json';

export default class Command {
  static get versionText() {
    return `LINE API CLIs v${version}`;
  }
}
