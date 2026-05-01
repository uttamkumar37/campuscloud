package com.cloudcampus.academic.service;

import com.cloudcampus.academic.dto.ClassCreateRequest;
import com.cloudcampus.academic.dto.ClassResponse;
import com.cloudcampus.academic.dto.SectionCreateRequest;
import com.cloudcampus.academic.dto.SectionResponse;
import com.cloudcampus.academic.dto.SubjectCreateRequest;
import com.cloudcampus.academic.dto.SubjectResponse;

import java.util.List;

public interface AcademicService {

    ClassResponse createClass(ClassCreateRequest request);

    List<ClassResponse> getClasses();

    SubjectResponse createSubject(SubjectCreateRequest request);

    List<SubjectResponse> getSubjects();

    SectionResponse createSection(SectionCreateRequest request);

    List<SectionResponse> getSections();
}
