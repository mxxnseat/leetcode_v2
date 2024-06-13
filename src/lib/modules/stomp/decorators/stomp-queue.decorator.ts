import { STOMP_QUEUE, STOMP_QUEUE_OPTIONS } from '../constants';
import { StompQueueOptions } from '../interfaces';

export const StompQueue =
  (options: StompQueueOptions): ClassDecorator =>
  (target: any): any => {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        let match = '';
        let destination = options.destination;
        for (const ch of options.destination) {
          if (match.length) {
            match += ch;
          }
          if (ch === '{') {
            match += '{';
          }
          if (ch === '}') {
            const regexp = match.match(/\{(.+)\}/) as RegExpMatchArray;
            destination = options.destination.replace(
              match,
              this.metadata[regexp[1]],
            );
            match = '';
          }
        }
        Reflect.defineMetadata(STOMP_QUEUE, true, this);
        Reflect.defineMetadata(
          STOMP_QUEUE_OPTIONS,
          { ...options, destination },
          this,
        );
      }
    };
  };
