export class Language {
  protected name: string;
  protected exts: string[];

  constructor(name: string, exts: string[]) {
    this.name = name;
    this.exts = exts;
  }
}

export interface Composable {
  compose(config: {}): string;
}
