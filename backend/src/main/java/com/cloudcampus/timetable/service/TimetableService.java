package com.cloudcampus.timetable.service;

import com.cloudcampus.timetable.dto.TimetableSlotRequest;
import com.cloudcampus.timetable.dto.TimetableSlotResponse;

import java.util.List;
import java.util.UUID;

public interface TimetableService {

    TimetableSlotResponse create(TimetableSlotRequest request);

    List<TimetableSlotResponse> list(UUID classId, UUID sectionId);
}
