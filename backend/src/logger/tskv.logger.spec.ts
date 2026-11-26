import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const readRecord = (mock: jest.Mock): string[] => {
    expect(mock).toHaveBeenCalledTimes(1);
    const line = mock.mock.calls[0][0] as string;
    expect(line).not.toContain('\n');
    return line.split('\t');
  };

  describe('формат записи', () => {
    it('не содержит переносов строки внутри записи: разделитель дописывает console.log', () => {
      logger.log('msg');

      const line = (console.log as jest.Mock).mock.calls[0][0] as string;

      expect(line).not.toContain('\n');
      expect(line).not.toContain('\r');
    });

    it('разделяет поля табуляцией в формате ключ=значение', () => {
      logger.log('текст сообщения');

      const fields = readRecord(console.log as jest.Mock);

      expect(fields).toHaveLength(3);
      fields.forEach((field) => {
        expect(field).toMatch(/^[a-z]+=/);
      });
      expect(fields).toContain('level=log');
      expect(fields).toContain('message=текст сообщения');
    });

    it('добавляет поле time с ISO-меткой времени', () => {
      logger.log('msg');

      const fields = readRecord(console.log as jest.Mock);

      const time = fields.find((field) => field.startsWith('time='));
      expect(time).toMatch(/^time=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('пишет каждый дополнительный параметр отдельным полем param', () => {
      logger.warn('внимание', 'FilmsController', 42);

      const fields = readRecord(console.warn as jest.Mock);

      expect(fields).toContain('param=FilmsController');
      expect(fields).toContain('param=42');
    });

    it('приводит значения к строкам: число остаётся строкой', () => {
      logger.log(10);

      const fields = readRecord(console.log as jest.Mock);

      expect(fields).toContain('message=10');
    });

    it('сериализует объектное сообщение', () => {
      logger.error({ code: 42, text: 'boom' });

      const fields = readRecord(console.error as jest.Mock);

      expect(fields).toContain('message={"code":42,"text":"boom"}');
    });
  });

  describe('экранирование значений', () => {
    it('экранирует табуляцию и перенос строки внутри значения', () => {
      logger.log('a\tb\nc');

      const fields = readRecord(console.log as jest.Mock);

      expect(fields).toHaveLength(3);
      expect(fields).toContain('message=a\\tb\\nc');
    });

    it('экранирует обратный слэш внутри значения', () => {
      logger.log('path\\to\\file');

      const fields = readRecord(console.log as jest.Mock);

      expect(fields).toContain('message=path\\\\to\\\\file');
    });
  });

  describe('методы уровней', () => {
    it('error пишет уровень error через console.error', () => {
      logger.error('msg');

      expect(readRecord(console.error as jest.Mock)).toContain('level=error');
    });

    it('warn пишет уровень warn через console.warn', () => {
      logger.warn('msg');

      expect(readRecord(console.warn as jest.Mock)).toContain('level=warn');
    });

    it('debug пишет уровень debug через console.debug', () => {
      logger.debug('msg');

      expect(readRecord(console.debug as jest.Mock)).toContain('level=debug');
    });

    it('verbose пишет уровень verbose через console.log', () => {
      logger.verbose('msg');

      expect(readRecord(console.log as jest.Mock)).toContain('level=verbose');
    });

    it('fatal пишет уровень fatal через console.error', () => {
      logger.fatal('msg');

      expect(readRecord(console.error as jest.Mock)).toContain('level=fatal');
    });
  });
});
