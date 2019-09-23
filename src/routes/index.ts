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
import { filterFiles } from '../api/compose.utils';

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
              defaultToOpen = 'checked disabled';
            }
            acc =
              `<li><label for="${dirName}">${dirName}</label> <input type="checkbox" ${defaultToOpen} id="${dirName}" /><ol>` +
              acc +
              '</ol></li>';
          } else {
            acc += `<li class="file"><a href="#" onclick="setHiddenElementTo(this)">${entry.name}</a></li>`;
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
        filenames.push(f.name);
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

  app.post('/combine', upload.single('file'), (req: any, res) => {
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
          acc[entry.entryName] = entry
            .getData()
            .toString('utf-8')
            .split('\n');
          return acc;
        }, {});

      const lang: string = req.body.selectedLanguage;
      const filenames: string[] = filterFiles(
        files,
        javascript,
        entryFilename,
        javascript.getRegex()
      );
      const combinedFile: string = javascript.compose(
        filenames,
        files
      );

      // TODO: Implement call to compose functionality.
      const contents = Buffer.from(combinedFile, 'utf-8');
      const name = 'files' + javascript.getExtensions()[0];

      // File Download from buffer
      const reader = new stream.PassThrough();
      reader.end(contents);

      res.set('Content-disposition', 'attachment; filename=' + name);

      // TODO: Content-Type should change based on lang.
      res.set('Content-type', 'application/' + javascript.getName());

      reader.pipe(res);
    } else {
      res.json({ error: 'Zip files only.' });
    }
  });

  app.use('/docs', express.static('dist/src/docs'));
  app.use('/css', express.static('dist/src/css'));
};
