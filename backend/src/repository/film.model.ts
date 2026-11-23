export interface ScheduleModel {
  id: string;
  daytime: Date;
  hall: string | number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmModel {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule: ScheduleModel[];
}
