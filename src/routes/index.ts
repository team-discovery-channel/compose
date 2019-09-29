import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import stream from 'stream';
import fs from 'fs';
import { javascript } from '../api/compose.javascript';
import { v1 } from 'uuid';
import { compose } from '../api';
import { O_NOFOLLOW } from 'constants';
import { isString } from 'util';
import { filterFiles, uncompose } from '../api/compose.utils';
import { Language } from '../api/compose.language';

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
      'text/plain',
      'text/javascript',
      'application/x-javascript',
    ];
    cb(null, acceptedMimeTypes.includes(file.mimetype));
  },
});

const languageFactory = (name: string): Language => {
  const lang: Language[] = languages.list.filter(
    (lang: Language) => lang.getName() === name
  );
  if (lang.length === 0) {
    throw new Error(
      `languageFactory in routes/index.ts has no instance for ${name}`
    );
  }
  return lang[0];
};

/**
 * registers routes to the express application
 * @param app  express application object, see src/index.ts
 */
export const register = (app: express.Application) => {
  app.get('/', (req, res) => {
    res.render('index', languages);
  });
  app.get('/uncompose', (req, res) => {
    res.render('uncompose', languages);
  });
  app.post('/uncompose/file', upload.single('file'), (req: any, res) => {
    if (req.file !== undefined) {
      const data: string[] = req.file.buffer
        .toString()
        .split('\r')
        .join('')
        .split('\n');
      const languageInstance: Language = languageFactory(
        req.body.selectedLanguage
      );
      const contents: Buffer = uncompose(data, languageInstance);

      const name = 'files.zip';
      // File Download from buffer
      const reader = new stream.PassThrough();
      reader.end(contents);
      res.set('Content-disposition', 'attachment; filename=' + name);

      // TODO: Content-Type should change based on lang.
      res.set('Content-type', 'application/zip');

      reader.pipe(res);
    } else {
      res.json({ error: 'The Server cannot serve.' });
    }
  });
  app.post('/compose/postzip', upload.single('file'), (req: any, res) => {
    if (req.file !== undefined) {
      const zip = new AdmZip(req.file.buffer);

      const fileDirectory = zip
        .getEntries()
        .sort((a: AdmZip.IZipEntry, b: AdmZip.IZipEntry): number => {
          const aDirCount: number = a.entryName.split('/').length;
          const bDirCount: number = b.entryName.split('/').length;
          if (aDirCount < bDirCount) {
            return -1;
          }
          if (aDirCount > bDirCount) {
            return 1;
          }
          return 0;
        })
        .reverse()
        .reduce<string>((acc, entry): string => {
          if (entry.isDirectory) {
            const dirArray = entry.entryName.split('/');
            const dirName: string = dirArray[dirArray.length - 2];
            let defaultToOpen = '';
            if (dirArray.length === 2) {
              defaultToOpen = 'data-jstree=\'{"opened":true}\'';
            }
            acc = `<li ${defaultToOpen}>${dirName}<ul>` + acc + '</ul></li>';
          } else {
            acc += `<li id="${
              entry.name
            }" data-jstree='{"icon":"material-icons tiny"}'><a href="#" onclick="setHiddenElementTo(this, '${entry.entryName
              .split('/')
              .slice(1)
              .join('/')}')">${entry.name}</a></li>`;
          }
          return acc;
        }, '');
      const filenames: string[] = [];
      const files = zip.getEntries().filter(entry => !entry.isDirectory);
      const zid: string = v1({
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: Date.now(),
        nsecs: 5678,
      });

      app.locals[zid] = req.file.buffer;

      files.forEach(f => {
        filenames.push(
          f.entryName
            .split('/')
            .slice(1)
            .join('/')
        );
      });
      res.render('entry', {
        filenames,
        language: req.body.selectedLanguage,
        buffer: zid,
        directoryHTML: fileDirectory,
      });
    } else {
      res.json({ error: 'Zip files only.' });
    }
  });

  app.post('/compose/files', upload.single('file'), (req: any, res) => {
    if (req.body.zipId !== undefined) {
      let entryFilename: string | string[] = req.body.selectedEntry;
      if (entryFilename instanceof Array) {
        entryFilename = entryFilename[0];
      }
      const zid = req.body.zipId;

      const zip = new AdmZip(app.locals[zid.substring(0, zid.length - 1)]);
      const files = zip
        .getEntries()
        .filter(entry => !entry.isDirectory)
        .reduce<{ [index: string]: string[] }>((acc, entry) => {
          acc[
            entry.entryName
              .split('/')
              .slice(1)
              .join('/')
          ] = entry

            .getData()
            .toString('utf-8')
            .split('\n');
          return acc;
        }, {});

      const lang: string = req.body.selectedLanguage.split('/')[0];
      const languageInstance: Language = languageFactory(lang);
      const filenames: string[] = filterFiles(
        files,
        languageInstance,
        entryFilename,
        languageInstance.getRegex()
      );
      const combinedFile: string = languageInstance.compose(
        filenames,
        files
      );

      // TODO: Implement call to compose functionality.
      const contents = Buffer.from(combinedFile, 'utf-8');
      const name = 'files' + languageInstance.getExtensions()[0];

      // File Download from buffer
      const reader = new stream.PassThrough();
      reader.end(contents);

      res.set('Content-disposition', 'attachment; filename=' + name);

      // TODO: Content-Type should change based on lang.
      res.set('Content-type', 'application/' + languageInstance.getName());

      reader.pipe(res);
    } else {
      res.json({ error: 'Zip files only.' });
    }
  });

  app.use('/docs', express.static('dist/src/docs'));
  app.use('/css', express.static('dist/src/css'));
};
