import { Collection } from 'discord.js';

// hack from https://stackoverflow.com/questions/69500556/discord-js-guide-property-commands-does-not-exist-on-type-clientboolean

declare module 'discord.js' {
  export interface Client {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commands: Collection<any, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events: Collection<any, any>;
  }
}
