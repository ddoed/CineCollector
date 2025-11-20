package com.example.cinecollector.common.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Presigner presigner;

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucket;

    public Map<String, String> generatePresignedUrl(String directory, String fileName, String contentType) {

        String key = directory + "/" + UUID.randomUUID() + "-" + fileName;

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putRequest)
                .build();

        PresignedPutObjectRequest presigned = presigner.presignPutObject(presignRequest);

        String uploadUrl = presigned.url().toString();
        String finalUrl = "https://" + bucket + ".s3." + Region.AP_SOUTHEAST_2.id() + ".amazonaws.com/" + key;

        return Map.of(
                "upload_url", uploadUrl,
                "final_url", finalUrl
        );
    }

    public void deleteObject(String key) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        s3Client.deleteObject(deleteObjectRequest);
    }
}
