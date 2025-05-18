import { 
  FileText, 
  FileImage, 
  FileArchive,
  FileAudio,
  FileVideo,
  FilePen,
  FileCode,
  FileJson,
  File as FileIcon,
  FilePieChart,
  FileSpreadsheet,
  FileType2
} from "lucide-react";

export function getFileTypeIcon(mime: string) {
  // Map MIME types to their corresponding icons
  if (mime.startsWith('image/')) {
    return FileImage;
  } else if (mime.startsWith('audio/')) {
    return FileAudio;
  } else if (mime.startsWith('video/')) {
    return FileVideo;
  } else if (mime === 'application/pdf') {
    return FilePen;
  } else if (mime === 'application/zip' || 
             mime === 'application/x-rar-compressed' || 
             mime === 'application/x-tar' ||
             mime === 'application/x-7z-compressed') {
    return FileArchive;
  } else if (mime === 'application/json') {
    return FileJson;
  } else if (mime === 'text/html' || 
             mime === 'text/css' || 
             mime === 'application/javascript' ||
             mime === 'text/x-python' ||
             mime === 'text/x-java-source') {
    return FileCode;
  } else if (mime === 'application/vnd.ms-excel' || 
             mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return FileSpreadsheet;
  } else if (mime === 'application/vnd.ms-powerpoint' || 
             mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    return FilePieChart;
  } else if (mime === 'application/msword' || 
             mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
             mime.startsWith('text/')) {
    return FileText;
  } else if (mime === 'application/x-font-ttf' || 
             mime === 'application/x-font-otf' || 
             mime === 'font/woff' || 
             mime === 'font/woff2') {
    return FileType2;
  } else {
    return FileIcon;
  }
}
