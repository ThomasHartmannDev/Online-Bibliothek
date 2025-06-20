package com.hartmannsdev.onlinebibliothek.service.school;

import com.hartmannsdev.onlinebibliothek.DTO.school.SchoolRequestDTO;
import com.hartmannsdev.onlinebibliothek.DTO.school.SchoolResponseDTO;
import com.hartmannsdev.onlinebibliothek.model.Modules;
import com.hartmannsdev.onlinebibliothek.model.Resource;
import com.hartmannsdev.onlinebibliothek.model.Schools;
import com.hartmannsdev.onlinebibliothek.model.User;
import com.hartmannsdev.onlinebibliothek.repository.ModulesRepository;
import com.hartmannsdev.onlinebibliothek.repository.ResourceRepository;
import com.hartmannsdev.onlinebibliothek.repository.SchoolRepository;
import com.hartmannsdev.onlinebibliothek.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SchoolService {

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private ModulesRepository modulesRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private UserRepository userRepository;

    // Criar uma nova escola
    @Transactional
    public SchoolResponseDTO createSchool(SchoolRequestDTO data) {
        Schools school = new Schools(data);
        schoolRepository.save(school);
        return new SchoolResponseDTO(school);
    }

    // Listar todas as escolas
    public List<SchoolResponseDTO> getAllSchools() {
        return schoolRepository.findAll().stream().map(SchoolResponseDTO::new).toList();
    }

    // Buscar uma escola por ID
    public SchoolResponseDTO getSchoolById(Long id) {
        Schools school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + id));
        return new SchoolResponseDTO(school);
    }

    // Obter todos os usuários associados a uma determinada escola
    public List<User> getUsersBySchool(Long schoolId) {
        Schools school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + schoolId));
        return userRepository.findBySchools(school);
    }


    // Atualizar uma escola existente
    @Transactional
    public SchoolResponseDTO updateSchool(Long id, SchoolRequestDTO data) {
        Schools school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + id));
        school.setName(data.name());
        school.setAddress(data.address());
        school.setContactEmail(data.contactEmail());
        schoolRepository.save(school);
        return new SchoolResponseDTO(school);
    }

    // Obter todos os módulos associados a uma determinada escola
    public List<Modules> getModulesBySchool(Long schoolId) {
        Schools school = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + schoolId));
        return modulesRepository.findBySchools(school);
    }


    // Excluir uma escola por ID e todos os registros associados
    @Transactional
    public void deleteSchool(Long id) {
        Schools school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + id));

        // Deletar módulos e seus recursos associados
        List<Modules> modules = modulesRepository.findBySchools(school);
        for (Modules module : modules) {
            List<Resource> resources = resourceRepository.findByModule(module);
            resources.forEach(resourceRepository::delete);
            modulesRepository.delete(module);
        }

        // Deletar usuários associados à escola
        List<User> users = userRepository.findBySchools(school);
        users.forEach(userRepository::delete);

        // Deletar a escola
        schoolRepository.delete(school);
    }


}
