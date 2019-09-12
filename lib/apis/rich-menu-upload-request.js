import fs from 'fs';
import RichMenuRequest from './rich-menu-request';

export default class RichMenuUploadRequest extends RichMenuRequest {
  constructor(options) {
    super({ ...options, ...{ contentType: 'image/jpeg' } });
  }
  send(richMenuId, imagePath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(imagePath);

      fs.stat(imagePath, (err, stats) => {
        if (err) {
          return reject(err);
        }

        this.axios.defaults.headers.common['content-length'] = stats.size;

        return resolve(
          this.axios.post(
            `https://api.line.me/v2/bot/richmenu/${richMenuId}/content`,
            readStream
          )
        );
      });
    });
  }
}
