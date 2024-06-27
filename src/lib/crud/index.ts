import { Metadata } from '@lib/metadata';
import { EventBus } from '@lib/modules/cqrs/event-bus';
import { List, ListRepositoryOptions } from '@lib/modules/database/interfaces';
import { PostgresRepository } from '@lib/modules/database/repositories';
import { OmitDefaultParameters } from '@lib/modules/database/types';
import { Event } from '@lib/modules/cqrs/event';
import { Nullable } from '@lib/types';
import { diff } from '@lib/utils';

export interface CRUDOptions<R> {
  events: {
    created?: new (record: R, metadata: Metadata) => Event;
    updated?: new (
      record: R,
      previousAttributes: Partial<R>,
      metadata: Metadata,
    ) => Event;
    deleted?: new (record: R, metadata: Metadata) => Event;
  };
}

export class CRUDService<R> {
  constructor(
    private readonly options: CRUDOptions<R>,
    private readonly repository: PostgresRepository<R, R>,
    private readonly eventBus: EventBus,
  ) {}
  public async list(options: ListRepositoryOptions<R>): Promise<List<R>> {
    return this.repository.list(options);
  }
  public async create(
    payload: OmitDefaultParameters<R>,
    metadata: Metadata,
  ): Promise<R> {
    const record = await this.repository.create(payload);
    if (this.options.events.created) {
      await this.eventBus.publish(
        new this.options.events.created(record, metadata),
      );
    }

    return record;
  }
  public async retrieve(id: string): Promise<Nullable<R>> {
    return this.repository.retrieve(id);
  }
  public async update(
    id: string,
    payload: Partial<OmitDefaultParameters<R>>,
    metadata: Metadata,
  ): Promise<Nullable<R>> {
    const record = await this.retrieve(id);
    if (!record) {
      return null;
    }
    const updatedRecord = await this.repository.update(id, payload);
    if (!updatedRecord) {
      return null;
    }
    if (this.options.events.updated) {
      await this.eventBus.publish(
        new this.options.events.updated(
          record,
          diff(updatedRecord, record),
          metadata,
        ),
      );
    }
    return updatedRecord;
  }
  public async delete(id: string, metadata: Metadata): Promise<Nullable<R>> {
    const record = await this.repository.delete(id);
    if (!record) {
      return null;
    }
    if (this.options.events.deleted) {
      await this.eventBus.publish(
        new this.options.events.deleted(record, metadata),
      );
    }
    return record;
  }
}
