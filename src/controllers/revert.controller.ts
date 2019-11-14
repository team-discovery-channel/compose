import { v1 } from 'uuid';
import { revert } from '../api/revert';
import stream from 'stream';

export const revertFile = (req: any, res: any) => {
  const error: { [index: string]: string } = {
    file: req.file !== undefined ? '' : 'Single source file only',
    language: req.body.language !== undefined ? '' : 'Language must be set',
  };

  if (!(error.file || error.langauge)) {
    const out: { [index: string]: string } = {
      filename: v1({
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: Date.now(),
        nsecs: 5678,
      }),
    };

    if (req.body.out !== '' && req.body.out !== undefined) {
      out.filename = req.body.out;
    }

    const decomposed: Buffer = revert(req.file.buffer, req.body.language);

    const reader = new stream.PassThrough();
    reader.end(decomposed);
    res.set(
      'Content-disposition',
      'attachment; filename=' + out.filename + '.zip'
    );

    res.set('Content-type', 'application/zip');

    reader.pipe(res);
  } else {
    res.json({ errors: error });
  }
};
