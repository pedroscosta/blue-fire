import fs from 'fs';
import path from 'path';

export default class Extension {
  public name: string;

  public url: string;

  public folder: string;

  public active: boolean;

  constructor(name: string, folder: string) {
    this.name = name;
    this.folder = folder;
    this.active = true;

    const extPath = path.join(folder, name);

    const manifest = JSON.parse(
      fs.readFileSync(path.join(extPath, 'package.json'), 'utf-8')
    );

    this.url = `bf-extension://${name}/${manifest.main}`;
  }
}
