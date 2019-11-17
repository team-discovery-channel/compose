import { compose } from '../api/compose';
import { RESTError } from '../api/error';
import { v1 } from 'uuid';
import stream from 'stream';

export const composeFile = (req: any, res: any) => {
  // Response JSON
  let response: { [index: string]: string } = {};
  // Error Checking
  const error: { [index: string]: string | RESTError } = {
    file:
      req.file !== undefined ? '' : new RESTError('Zip files only', '', '400'),
    language:
      req.body.language !== undefined
        ? ''
        : new RESTError('Language must be set', '', '400'),
    entry: req.body.entry
      ? ''
      : new RESTError('Entry file must be set', '', '400'),
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
    let composed: Buffer = Buffer.from([]);
    try {
      composed = compose(
        req.file.buffer,
        req.body.language,
        out,
        req.body.entry
      );
    } catch (e) {
      response = JSON.parse(e.message);
      res.status(Number(response.status));
      res.json(response);
      return;
    }
    // File Download from buffer
    const reader = new stream.PassThrough();
    reader.end(composed);
    res.status(200);
    res.set('Content-disposition', 'attachment; filename=' + out.filename);

    // TODO: Content-Type should change based on lang.
    res.set('Content-type', 'text/plain');

    reader.pipe(res);
  } else {
    const jsonError: RESTError = (error.file
      ? error.file
      : error.language
      ? error.langauge
      : error.entry) as RESTError;
    res.status(Number(jsonError.status));
    res.json(JSON.stringify(jsonError));
  }
};
