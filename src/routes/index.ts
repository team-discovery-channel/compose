import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import stream from 'stream';
import fs from 'fs';
import { javascript } from '../api/compose.javascript';
import { v1 } from 'uuid';
import { compose } from '../api';
import { O_NOFOLLOW } from 'constants';

const storage = multer.memoryStorage();

const languages = {
  list: [javascript],
};

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

/**
 * registers routes to the express application
 * @param app  express application object, see src/index.ts
 */
export const register = (app: express.Application) => {
  app.get('/', (req, res) => {
    res.render('index', languages);
  });

  app.post('/entry', upload.single('file'), (req: any, res) => {
    if (req.file !== undefined) {
      const zip = new AdmZip(req.file.buffer);
      const files = zip.getEntries().filter(entry => !entry.isDirectory);
      const filenames: string[] = [];
      const zid: string = v1({
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: Date.now(),
        nsecs: 5678,
      });

      app.locals[zid] = req.file.buffer;

      files.forEach(f => {
        filenames.push(f.name);
      });
      res.render('entry', {
        filenames,
        language: req.body.selectLanguage,
        buffer: zid,
      });
    } else {
      res.json({ error: 'Zip files only.' });
    }
  });

  app.post('/combine', upload.single('file'), (req: any, res) => {
    if (req.body.zipId !== undefined) {
      const zid = req.body.zipId;
      const zip = new AdmZip(app.locals[zid.substring(0, zid.length - 1)]);
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

  app.use('/docs', express.static('dist/src/docs'));
};
