import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('формат записи', () => {
    it('пишет одну строку валидного JSON с полями level, message, optionalParams', () => {
      logger.log('текст сообщения');

      expect(console.log).toHaveBeenCalledTimes(1);
      const line = (console.log as jest.Mock).mock.calls[0][0] as string;

      expect(() => JSON.parse(line)).not.toThrow();
      expect(JSON.parse(line)).toEqual({
        level: 'log',
        message: 'текст сообщения',
        optionalParams: [],
      });
    });

    it('сериализует объектное сообщение в поле message', () => {
      const message = { code: 42, text: 'boom' };
      logger.error(message);

      const line = (console.error as jest.Mock).mock.calls[0][0] as string;

      expect(JSON.parse(line)).toEqual({
        level: 'error',
        message,
        optionalParams: [],
      });
    });

    it('складывает дополнительные параметры в optionalParams', () => {
      logger.warn('внимание', 'FilmsController', 42);

      const line = (console.warn as jest.Mock).mock.calls[0][0] as string;

      expect(JSON.parse(line)).toEqual({
        level: 'warn',
        message: 'внимание',
        optionalParams: ['FilmsController', 42],
      });
    });
  });

  describe('методы уровней', () => {
    it('log пишет уровень log через console.log', () => {
      logger.log('msg');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"level":"log"'),
      );
    });

    it('error пишет уровень error через console.error', () => {
      logger.error('msg');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('"level":"error"'),
      );
    });

    it('warn пишет уровень warn через console.warn', () => {
      logger.warn('msg');
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('"level":"warn"'),
      );
    });

    it('debug пишет уровень debug через console.debug', () => {
      logger.debug('msg');
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringContaining('"level":"debug"'),
      );
    });

    it('verbose пишет уровень verbose через console.log', () => {
      logger.verbose('msg');
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('"level":"verbose"'),
      );
    });

    it('fatal пишет уровень fatal через console.error', () => {
      logger.fatal('msg');
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('"level":"fatal"'),
      );
    });
  });
});
