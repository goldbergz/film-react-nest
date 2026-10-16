import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument } from './film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDocument[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id }).exec();
  }

  async bookSeat(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<FilmDocument | null> {
    return this.filmModel
      .findOneAndUpdate(
        {
          id: filmId,
          schedule: { $elemMatch: { id: sessionId, taken: { $ne: seat } } },
        },
        { $addToSet: { 'schedule.$.taken': seat } },
        { new: true },
      )
      .exec();
  }
}
