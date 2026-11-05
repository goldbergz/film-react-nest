import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class Schedule {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  daytime: Date;

  @Prop()
  hall: string;

  @Prop()
  rows: number;

  @Prop()
  seats: number;

  @Prop()
  price: number;

  @Prop([String])
  taken: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema({ collection: 'films', versionKey: false })
export class Film {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop()
  rating: number;

  @Prop()
  director: string;

  @Prop([String])
  tags: string[];

  @Prop()
  title: string;

  @Prop()
  about: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  cover: string;

  @Prop({ type: [ScheduleSchema], default: [] })
  schedule: Schedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);

export type FilmDocument = HydratedDocument<Film>;
export type ScheduleDocument = HydratedDocument<Schedule>;
