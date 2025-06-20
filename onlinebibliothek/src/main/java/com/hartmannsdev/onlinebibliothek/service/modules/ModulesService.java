package com.hartmannsdev.onlinebibliothek.service.modules;

import com.hartmannsdev.onlinebibliothek.DTO.modules.ModulesRequestDTO;
import com.hartmannsdev.onlinebibliothek.DTO.modules.ModulesResponseDTO;
import com.hartmannsdev.onlinebibliothek.model.Modules;
import com.hartmannsdev.onlinebibliothek.repository.ModulesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ModulesService {

    @Autowired
    private ModulesRepository modulesRepository;

    // Criar um novo módulo
    @Transactional
    public ModulesResponseDTO createModule(ModulesRequestDTO data) {
        Modules module = new Modules(data);
        modulesRepository.save(module);
        return new ModulesResponseDTO(module);
    }

    // Listar todos os módulos
    public List<ModulesResponseDTO> getAllModules() {
        return modulesRepository.findAll().stream().map(ModulesResponseDTO::new).toList();
    }

    // Buscar um módulo por ID
    public ModulesResponseDTO getModuleById(Long id) {
        Modules module = modulesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with ID: " + id));
        return new ModulesResponseDTO(module);
    }

    // Atualizar um módulo existente
    @Transactional
    public ModulesResponseDTO updateModule(Long id, ModulesRequestDTO data) {
        Modules module = modulesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with ID: " + id));
        module.setName(data.name());
        module.setDescription(data.description());
        module.setSchools(data.school());
        modulesRepository.save(module);
        return new ModulesResponseDTO(module);
    }

    // Excluir um módulo por ID
    @Transactional
    public void deleteModule(Long id) {
        Modules module = modulesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with ID: " + id));
        modulesRepository.delete(module);
    }
}
