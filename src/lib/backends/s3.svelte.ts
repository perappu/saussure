import { S3_BUCKET } from '$env/static/private';
import { s3Client } from '$lib/config/auth';
import type { ItemBucketMetadata } from 'minio';

/**
 * Puts a file via S3
 *
 * @param filename The combined path and filename to write to
 * @param blob The object to write in base64
 * @param size The byte size of the object
 * @param type The Content-Type of the object
 * @returns A bool indicating success or not
 */
export const putObjectS3 = async (
    filename: string,
    blob: string,
    size: number,
    type: string
) => {
    var buf = Buffer.from(blob.replace(/^data:.+;base64,/, ''), 'base64');

    var metadata = {
        'Content-Type': type
    } as ItemBucketMetadata;

    try {
        //ignore any errors regarding parameters on the callback function
        s3Client.putObject(
            S3_BUCKET,
            filename,
            buf,
            size,
            metadata,
            function (err: any, etag: any) {
                return console.log(err, etag);
            }
        );

        return true;
    } catch (ex: any) {
        throw new Error('S3 put request failed', { cause: ex });
    }
};

/**
 * Deletes an object from S3
 *
 * @param filename The combined path and filename to delete
 * @returns A bool indicating success or not
 */
export const deleteObjectS3 = async (filename: string) => {
    try {
        s3Client.removeObject(S3_BUCKET, filename);
        return true;
    } catch (ex: any) {
        throw new Error('S3 delete request failed', { cause: ex });
    }
};
