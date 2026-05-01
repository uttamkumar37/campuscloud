package com.cloudcampus.bulk.service;

import com.cloudcampus.bulk.dto.BulkUploadResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface BulkUploadService {

    BulkUploadResponse uploadWorkbook(MultipartFile file);

    Resource generateSampleWorkbook();
}
