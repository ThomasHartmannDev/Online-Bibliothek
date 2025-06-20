package com.hartmannsdev.onlinebibliothek.repository;

import com.hartmannsdev.onlinebibliothek.model.Modules;
import com.hartmannsdev.onlinebibliothek.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByUserOwnerId(Long userId);
    List<Resource> findByModule(Modules module);
    List<Resource> findByModuleSchoolsId(Long schoolId);
}
