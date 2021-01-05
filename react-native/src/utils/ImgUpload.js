export default class ImgUpload {

    uploadImage = async (images, uploadImgAction, requestId = null) => {

        const chunks = this.chunkImgIn2MB(images);

        chunks.forEach(chunk => {
            let uploadData = new FormData();
            uploadData.append('submit', 'ok');

            chunk.forEach(img => {
                uploadData.append('file[]', img);
            });

            const request = {
                uploadData: uploadData,
                requestId: requestId,
            };
            uploadImgAction(request);
        });
    }

    chunkImgIn2MB(images) {
        let chunkCount = 0;
        let chunkSize = 0;
        let chunks = [];

        images.forEach((value, key) => {
            chunkSize += value.size;
            let size = this.formatBytes(chunkSize);

            //can be 'Bytes', 'KB', 'MB'
            if (size.memoryUnit < 2 || (size.memoryUnit === 2 && size.size < 2)) {
                if (!Array.isArray(chunks[chunkCount])) {
                    chunks[chunkCount] = [];
                }
                chunks[chunkCount].push({ type: value.mimeType, uri: value.uri, name: value.message });
            } else {
                chunkCount++;
                chunkSize = 147688;

                if (!Array.isArray(chunks[chunkCount])) {
                    chunks[chunkCount] = [];
                }
                chunks[chunkCount].push({ type: value.mimeType, uri: value.uri, name: value.message });
            }

        });

        return chunks;
    }

    formatBytes(bytes, decimals) {
        if (bytes === 0) {
            return '0 Bytes';
        }

        let k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            // sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));

        let response = {};
        response.size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
        response.memoryUnit = i;
        // return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        return response;
    }
}
