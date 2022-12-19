import {BindingKey, BindingScope, injectable} from "@loopback/context";
import {inject, service} from "@loopback/core";
import {AnyObject, repository} from "@loopback/repository";
import {FileRepository} from "../repositories/file.repository";
import {File} from "../models/file.model";
import path from "path";
import fs, { PathOrFileDescriptor } from "fs";
import {HttpErrors, Request, Response} from "@loopback/rest";
    import multer from "multer";
import dayjs from "dayjs";
import {STORAGE_DIRECTORY} from "../keys";

const convertViToEn = (str: string, toUpperCase = false) => {
    const newStr = str.toLowerCase()
        // xóa dấu
        .normalize("NFD") // chuyển chuỗi sang unicode tổ hợp
        .replace(/[\u0300-\u036f]/g, "") // xóa các ký tự dấu sau khi tách tổ hợp
        // Thay ký tự đĐ
        .replace(/[đĐ]/g, "d")
        // Xóa ký tự đặc biệt
        .replace(/([^0-9a-z-.\s])/g, "")
        // Xóa khoảng trắng thay bằng ký tự -
        .replace(/(\s+)/g, "-")
        // Xóa ký tự - liên tiếp
        .replace(/-+/g, "-")
        // xóa phần dư - ở đầu & cuối
        .replace(/^-+|-+$/g, "");
    return toUpperCase ? newStr.toUpperCase() : newStr;
}
    const renameFileUpload = (fileName: string) => {
    const originalName = convertViToEn(fileName);
    return originalName.split(path.extname(originalName))[0] + `_${dayjs().valueOf()}` + path.extname(originalName);
};
const preprocessFile = (file: AnyObject) => {
    // * Need to mutate the file object
    (file as AnyObject).originalName = JSON.parse(
        JSON.stringify(file.originalname),
    );
    file.originalname = renameFileUpload(file.originalname);
};

@injectable({ scope: BindingScope.TRANSIENT })
export class FileService {
    constructor(
        @inject(STORAGE_DIRECTORY) private storageDirectory: string,
        @repository(FileRepository) public fileRepository: FileRepository,
    ) {
    }

    getFiles(): Promise<File[]> {
        return this.fileRepository.find();
    }

    public fileValidator(fileName: string): string {
        const filePath = path.resolve(this.storageDirectory, fileName);
        if (fs.existsSync(filePath)) return filePath;
        throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
    }

    private getFileSystemStorageEngine() {
        return multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload')
            },
            filename: (
                req: AnyObject,
                file: AnyObject,
                cb: (a: null, b: string) => void,
            ) => {
                preprocessFile(file);
                cb(null, file.originalname);
            },
        });
    }

    public async fileUploadHandler({
               request,
               response,
               callback,
           }: {
        request: Request,
        response: Response,
        callback?: (files: AnyObject[]) => Promise<AnyObject[]> | AnyObject[],
    }): Promise<AnyObject[]> {
        const storage = this.getFileSystemStorageEngine();
        const requestHandler = multer({ storage }).any();
        return new Promise((resolve, reject) => {
            requestHandler(request, response, (err: unknown) => {
                if (err) reject(err);
                const files = request.files as AnyObject[];
                if (callback) {
                    resolve(callback(files));
                }
                resolve(files);
            });
        });
    }
    getSystemStorageFileUrl(file: AnyObject) {
        const { originalname } = file;
        // const domainApi = process.env.DOMAIN_API;
        const removePublicStringPath = originalname.split("/").slice(1).join("/");

        return `http://localhost:3000/${removePublicStringPath}`;
    };

    private createFileEntitiesFromUploadedFiles(uploadedFiles: Array<AnyObject>): File[] {
        return uploadedFiles.map((file) => {
            const { originalname, mimetype, size, fieldname } = file;

            return new File({
                name: originalname,
                url: this.getSystemStorageFileUrl(file),
                type: mimetype,
                size,
                fieldname,
                metadata: file,
            });
        });
    }

    async uploadFiles(files: AnyObject[]): Promise<File[]> {
        const uploadedFiles: File[] = this.createFileEntitiesFromUploadedFiles(files);
        const newFiles = await this.fileRepository.createAll(uploadedFiles);
        return newFiles;
    }
}
