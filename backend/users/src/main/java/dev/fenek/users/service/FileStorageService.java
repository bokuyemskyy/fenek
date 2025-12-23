package dev.fenek.users.service;

import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${spring.minio.avatar-bucket}")
    private String avatarBucket;

    public void uploadAvatar(UUID userId, Integer version, byte[] data) {
        upload(avatarBucket, new AvatarObjectKey(userId, version).value(), data);
    }

    public String getAvatarUrl(UUID userId, Integer version) {
        if (version == null)
            return null;
        return getPresignedUrl(avatarBucket, new AvatarObjectKey(userId, version).value(), Duration.ofMinutes(10));
    }

    private void upload(String bucket, String key, byte[] data) {
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .build(),
                RequestBody.fromBytes(data));
    }

    private String getPresignedUrl(String bucket, String key, Duration duration) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(duration)
                .getObjectRequest(getObjectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest).url().toString();
    }

    public record AvatarObjectKey(UUID userId, int version) {

        public String value() {
            return userId + "/v" + version + ".png";
        }
    }
}