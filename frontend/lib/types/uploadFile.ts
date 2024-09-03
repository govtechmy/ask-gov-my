export interface UploadItem {
  file: File | null; // will be null if it has been uploaded or from database. Will only have value if it is in draft (not yet uploaded) stage
  fileName: string;
  fileSize: number;
  isUploaded: boolean; // will be true if it exists in s3. If it is not yet uploaded, the value will be false
}

export interface ToUploadItem extends UploadItem {
  file: File;
}
