import { ReprintLettersModule } from './reprint-letters.module';

fdescribe('ReprintLettersModule', () => {
  let reprintLettersModule: ReprintLettersModule;

  beforeEach(() => {
    reprintLettersModule = new ReprintLettersModule();
  });

  it('should create an instance', () => {
    expect(reprintLettersModule).toBeTruthy();
  });
});
