import { s3Client } from "$lib/config/auth";

export const s3Test = () => {
    const stream = s3Client.listObjects('perappu-public', '', true);
    stream.on('data', function (obj) {
        console.log(obj)
      });
}