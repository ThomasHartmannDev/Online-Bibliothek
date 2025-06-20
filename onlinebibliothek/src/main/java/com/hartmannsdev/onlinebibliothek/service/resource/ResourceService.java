package com.hartmannsdev.onlinebibliothek.service.resource;

import com.hartmannsdev.onlinebibliothek.DTO.modules.ModuleSimplifiedDTO;
import com.hartmannsdev.onlinebibliothek.DTO.resource.ResourceRequestDTO;
import com.hartmannsdev.onlinebibliothek.DTO.resource.ResourceResponseDTO;
import com.hartmannsdev.onlinebibliothek.DTO.resource.ResourceSimplifiedDTO;
import com.hartmannsdev.onlinebibliothek.DTO.user.UserSimplifiedDTO;
import com.hartmannsdev.onlinebibliothek.model.Modules;
import com.hartmannsdev.onlinebibliothek.model.Resource;
import com.hartmannsdev.onlinebibliothek.model.User;
import com.hartmannsdev.onlinebibliothek.repository.ModulesRepository;
import com.hartmannsdev.onlinebibliothek.repository.ResourceRepository;
import com.hartmannsdev.onlinebibliothek.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private ModulesRepository modulesRepository;

    @Autowired
    private UserRepository userRepository;

    // Criar um novo recurso
    @Transactional
    public ResourceSimplifiedDTO createResource(ResourceRequestDTO data) {
        Modules module = modulesRepository.findById(data.module().getId())
                .orElseThrow(() -> new RuntimeException("Module not found with ID: " + data.module().getId()));
        User uploadedBy = userRepository.findById(data.uploadedBy().getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + data.uploadedBy().getId()));
        User userOwner = userRepository.findById(data.UserOwner().getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + data.UserOwner().getId()));

        Resource resource = new Resource(data);
        resource.setModule(module);
        resource.setUploadedBy(uploadedBy);
        resource.setUserOwner(userOwner);
        resourceRepository.save(resource);

        return new ResourceSimplifiedDTO(
                resource.getId(),
                resource.getTitle(),
                resource.getURL(),
                new ModuleSimplifiedDTO(
                        resource.getModule().getId(),
                        resource.getModule().getName()
                ),
                new UserSimplifiedDTO(
                        resource.getUploadedBy().getId(),
                        resource.getUploadedBy().getName()
                ),
                new UserSimplifiedDTO(
                        resource.getUserOwner().getId(),
                        resource.getUserOwner().getName()
                ),
                resource.getCreatedAt()
        );
    }



    public List<ResourceSimplifiedDTO> getResourcesBySchool(Long schoolId) {
        List<Resource> resources = resourceRepository.findByModuleSchoolsId(schoolId);
        return resources.stream()
                .map(resource -> new ResourceSimplifiedDTO(
                        resource.getId(),
                        resource.getTitle(),
                        resource.getURL(),
                        new ModuleSimplifiedDTO(
                                resource.getModule().getId(),
                                resource.getModule().getName()
                        ),
                        new UserSimplifiedDTO(
                                resource.getUploadedBy().getId(),
                                resource.getUploadedBy().getName()
                        ),
                        new UserSimplifiedDTO(
                                resource.getUserOwner().getId(),
                                resource.getUserOwner().getName()
                        ),
                        resource.getCreatedAt()
                ))
                .toList();
    }


    public List<ResourceSimplifiedDTO> getBooksByUserId(Long userId) {
        List<Resource> resources = resourceRepository.findByUserOwnerId(userId);
        return resources.stream().map(resource -> new ResourceSimplifiedDTO(
                resource.getId(),
                resource.getTitle(),
                resource.getURL(),
                new ModuleSimplifiedDTO(
                        resource.getModule().getId(),
                        resource.getModule().getName()
                ),
                new UserSimplifiedDTO(
                        resource.getUploadedBy().getId(),
                        resource.getUploadedBy().getName()
                ),
                new UserSimplifiedDTO(
                        resource.getUserOwner().getId(),
                        resource.getUserOwner().getName()
                ),
                resource.getCreatedAt()
        )).toList();
    }


    // Listar todos os recursos
    public List<ResourceResponseDTO> getAllResources() {
        return resourceRepository.findAll().stream().map(ResourceResponseDTO::new).toList();
    }

    // Buscar um recurso por ID
    public ResourceResponseDTO getResourceById(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));
        return new ResourceResponseDTO(resource);
    }

    // Atualizar um recurso existente
    @Transactional
    public ResourceResponseDTO updateResource(Long id, ResourceRequestDTO data) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));
        Modules module = modulesRepository.findById(data.module().getId())
                .orElseThrow(() -> new RuntimeException("Module not found with ID: " + data.module().getId()));
        User uploadedBy = userRepository.findById(data.uploadedBy().getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + data.uploadedBy().getId()));
        User userOwner = userRepository.findById(data.UserOwner().getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + data.UserOwner().getId()));

        resource.setTitle(data.Title());
        resource.setURL(data.URL());
        resource.setModule(module);
        resource.setUploadedBy(uploadedBy);
        resource.setUserOwner(userOwner);
        resourceRepository.save(resource);

        return new ResourceResponseDTO(resource);
    }

    // Excluir um recurso por ID
    @Transactional
    public void deleteResource(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));
        resourceRepository.delete(resource);
    }
}
