import { s3Client } from "$lib/config/auth";

export const s3Test = () => {
    let objs: any[] = [];
    const stream = s3Client.listObjects('perappu-public', '', true);
    stream.on('data', function (obj) {
        objs.push(obj)
      });
    return objs;
}