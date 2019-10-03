import express from 'express';
import multer from 'multer';
import stream from 'stream';
import { v1 } from 'uuid';
import { languages, compose } from '../api/compose.utils';

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

/**
 * registers routes to the express application
 * @param app  express application object, see src/index.ts
 */
export const register = (app: express.Application) => {
  app.get('/', (req, res) => {
    res.render('index', languages);
  });

  app.post('/compose', upload.single('zip'), (req: any, res) => {
    const error: { [index: string]: string } = {
      file: req.file !== undefined ? '' : 'Zip files only.',
      language: req.body.language !== undefined ? '' : 'Language must be set',
      entry: req.body.entry ? '' : 'Entry file must be set',
    };

    if (!(error.file || error.langauge || error.entry)) {
      const out: { [index: string]: string } = {
        filename: v1({
          node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
          clockseq: 0x1234,
          msecs: Date.now(),
          nsecs: 5678,
        }),
      };

      if (req.body.outfile !== '' && req.body.outfile !== undefined) {
        out.filename = req.body.outfile;
      }
      const composed = compose(
        req.body.language,
        req.file.buffer,
        req.body.entry,
        out
      );
      // File Download from buffer
      const reader = new stream.PassThrough();
      reader.end(composed);

      res.set('Content-disposition', 'attachment; filename=' + out.filename);

      // TODO: Content-Type should change based on lang.
      res.set('Content-type', 'text/plain');

      reader.pipe(res);
    } else {
      res.json({ errors: error });
    }
  });

  app.use('/docs', express.static('dist/src/docs'));
  app.use('/scripts', express.static('dist/src/scripts'));
};
