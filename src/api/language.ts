class Language {
  private name: string;
  private img: string;
  private ext: string[];

  constructor(name: string, img: string, ext: string[]) {
    this.name = name;
    this.img = img;
    this.ext = ext;
  }

  getName(): string {
    return Object.assign('', this.name);
  }

  getImg(): string {
    return Object.assign('', this.img);
  }

  getExt(): string[] {
    //TODO deep copy
    return this.ext;
  }
}

export const languages = {
  list: [
    new Language('Javascript', '', ['js']),
    new Language('Ruby', '', ['rb']),
    new Language('Python3', '', ['py']),
  ],
};
