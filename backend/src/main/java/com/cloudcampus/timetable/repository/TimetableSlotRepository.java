package com.cloudcampus.timetable.repository;

import com.cloudcampus.timetable.entity.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, UUID> {

    List<TimetableSlot> findByClassIdAndSectionIdOrderByDayOfWeekAscStartTimeAsc(UUID classId, UUID sectionId);

    // Teacher dashboard
    List<TimetableSlot> findByTeacherIdOrderByDayOfWeekAscStartTimeAsc(UUID teacherId);
}
