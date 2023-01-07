import {inject, service} from '@loopback/core';
import {
    get, oas, param,
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
} from '@loopback/rest';
import {FileService} from "../services/file.service";
/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {
    /**
     * Constructor
     * @param handler - Inject an express request handler to deal with the request
     */
    constructor(
        @service(FileService) public fileService: FileService,
    ) {}
    @get("/files", {
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                        },
                    },
                },
                description: "A list of files",
            },
        },
    })
    find() {
        return this.fileService.getFiles();
    }

    @get("/files/{filename}")
    @oas.response.file()
    downloadFile(
        @param.path.string("filename") fileName: string,
        @inject(RestBindings.Http.RESPONSE) response: Response,
    ) {
        const file = this.fileService.fileValidator(fileName);
        response.download(file, fileName);
        return response;
    }

    @post("/files", {
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                        },
                    },
                },
            },
        },
    })
    async upload(
        @requestBody.file()
            request: Request,
        @inject(RestBindings.Http.RESPONSE) response: Response,
    ) {
        const files = await this.fileService.fileUploadHandler({
            request,
            response,
        });
        return this.fileService.uploadFiles(files);
    }
}
