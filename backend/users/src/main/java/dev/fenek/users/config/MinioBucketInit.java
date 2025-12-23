package dev.fenek.users.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.BucketAlreadyExistsException;
import software.amazon.awssdk.services.s3.model.BucketAlreadyOwnedByYouException;

@Component
@RequiredArgsConstructor
public class MinioBucketInit {

    private final S3Client s3Client;

    @Value("${spring.minio.avatar-bucket}")
    private String bucket;

    @PostConstruct
    public void init() {
        try {
            s3Client.createBucket(b -> b.bucket(bucket));
        } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException e) {
        }
    }
}