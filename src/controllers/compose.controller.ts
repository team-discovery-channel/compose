import { compose } from '../api/compose';
import { v1 } from 'uuid';
import stream from 'stream';

export const composeFile = (req: any, res: any) => {
  // Error Checking
  const error: { [index: string]: string } = {
    file: req.file !== undefined ? '' : 'Zip files only.',
    language: req.body.language !== undefined ? '' : 'Language must be set',
    entry: req.body.entry ? '' : 'Entry file must be set',
  };

  // Error Checking
  if (!(error.file || error.langauge || error.entry)) {
    const out: { [index: string]: string } = {
      filename: v1({
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: Date.now(),
        nsecs: 5678,
      }),
    };

    // Error Checking
    if (req.body.out !== '' && req.body.out !== undefined) {
      out.filename = req.body.out;
    }

    const composed = compose(
      req.file.buffer,
      req.body.language,
      out,
      req.body.entry
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
};
