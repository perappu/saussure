import { GitHub } from 'arctic';
import { GH_CLIENT_ID, GH_CLIENT_SECRET, S3_ACCESS_KEY, S3_ENDPOINT, S3_SECRET_KEY } from '$env/static/private';
import * as Minio from 'minio';

export const github = new GitHub(GH_CLIENT_ID, GH_CLIENT_SECRET, null);

export const s3Client = new Minio.Client({
    endPoint: S3_ENDPOINT,
    accessKey: S3_ACCESS_KEY,
    secretKey: S3_SECRET_KEY,
    useSSL: false
  })