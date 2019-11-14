import express from 'express';
import multer from 'multer';
import stream from 'stream';
import fs from 'fs';
import { javascript } from '../api/javascript';
import { python } from '../api/python';
import { v1 } from 'uuid';
import { O_NOFOLLOW } from 'constants';
import { isString } from 'util';
import { Language } from '../api/language';
import { languages, compose, revert } from '../api/javascript.utils';
import { composeFile } from '../controllers/compose.controller';
import { revertFile } from '../controllers/revert.controller';

const storage = multer.memoryStorage();

const upload: multer.Instance = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const acceptedLanguages: string[] = [];
    const values = Object.keys(languages);

    Object.keys(languages).forEach(language => {
      acceptedLanguages.push('application/' + languages[language].getName());
      acceptedLanguages.push('application/x-' + languages[language].getName());
      acceptedLanguages.push('text/' + languages[language].getName());
    });

    const acceptedMimeTypes: string[] = [
      'application/x-zip-compressed',
      'application/zip',
    ];
    acceptedMimeTypes.push(...acceptedLanguages);
    cb(null, acceptedMimeTypes.includes(file.mimetype));
  },
});

/**
 * registers routes to the express application
 * @param app  express application object, see src/index.ts
 */
export const register = (app: express.Application) => {
  app.get('/', (req, res) => {
    const langs = Object.keys(languages);
    res.render('index', { list: langs });
  });
  app.get('/undo', (req, res) => {
    const langs = Object.keys(languages);
    res.render('undo', { list: langs });
  });
  app.post('/api/v1/revert', upload.single('file'), (req: any, res) => {
    revertFile(req, res);
  });
  app.post('/api/v1/compose', upload.single('file'), (req: any, res) => {
    composeFile(req, res);
  });

  app.use('/docs', express.static('dist/src/docs'));
  app.use('/js', express.static('dist/src/public/js'));
};
