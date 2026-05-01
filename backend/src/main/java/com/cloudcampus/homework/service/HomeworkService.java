package com.cloudcampus.homework.service;

import com.cloudcampus.homework.dto.HomeworkCreateRequest;
import com.cloudcampus.homework.dto.HomeworkResponse;

import java.util.List;
import java.util.UUID;

public interface HomeworkService {

    HomeworkResponse create(HomeworkCreateRequest request);

    List<HomeworkResponse> listForClass(UUID classId);
}
