import { filesApi } from './api';

/**
 * S3에 이미지 파일을 업로드하는 유틸리티 함수
 * @param file 업로드할 파일
 * @param directory S3 디렉토리 경로 (예: 'events', 'profiles', 'movies')
 * @returns 업로드된 이미지의 최종 URL
 */
export async function uploadImageToS3(
  file: File,
  directory: string
): Promise<string> {
  // 파일 확장자와 MIME 타입 확인
  const fileName = file.name;
  const contentType = file.type || 'image/jpeg';

  // Presigned URL 요청
  const { final_url, upload_url } = await filesApi.getPresignedUrl({
    directory,
    file_name: fileName,
    content_type: contentType,
  });

  // Presigned URL로 파일 업로드
  const uploadResponse = await fetch(upload_url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': contentType,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }

  return final_url;
}

