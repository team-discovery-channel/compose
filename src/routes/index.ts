import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import stream from 'stream';

import { compose } from '../api';

const storage = multer.memoryStorage();
const upload: multer.Instance = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const acceptedMimeTypes: string[] = [
      'application/x-zip-compressed',
      'application/zip',
    ];
    cb(null, acceptedMimeTypes.includes(file.mimetype));
  },
});

export const register = (app: express.Application) => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.post('/combine', upload.single('file'), (req: any, res) => {
    if (req.file !== undefined) {
      const zip = new AdmZip(req.file.buffer);
      const files = zip
        .getEntries()
        .filter(entry => !entry.isDirectory)
        .reduce<{ [index: string]: string[] }>((acc, entry) => {
          acc[entry.entryName] = entry
            .getData()
            .toString('utf-8')
            .split('\n');
          return acc;
        }, {});

      // TODO: Implement call to compose functionality.
      const contents = Buffer.from(compose(files), 'utf-8');
      const name = 'files.json';

      // File Download from buffer
      const reader = new stream.PassThrough();
      reader.end(contents);

      res.set('Content-disposition', 'attachment; filename=' + name);

      // TODO: Content-Type should change based on lang.
      res.set('Content-type', 'application/json');

      reader.pipe(res);
    } else {
      res.json({ error: 'Zip files only.' });
    }
  });
};
