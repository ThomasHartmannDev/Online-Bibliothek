package com.hartmannsdev.onlinebibliothek.utils;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public enum UserRole {
    STUDENT(List.of("PERM_VIEW_BOOKS", "PERM_VIEW_MODULES")),
    ITSUPPORT(List.of(
            //Perms Module
            "PERM_ADD_MODULES",
            "PERM_VIEW_MODULES",
            "PERM_EDIT_MODULES",
            "PERM_DELETE_MODULES",
            //Perms Books
            "PERM_ADD_BOOKS",
            "PERM_VIEW_BOOKS",
            "PERM_EDIT_BOOKS",
            "PERM_DELETE_BOOKS",
            //Perm Student
            "PERM_ADD_STUDENT",
            "PERM_VIEW_STUDENT",
            "PERM_EDIT_STUDENT",
            "PERM_DELETE_STUDENT"
    )),
    ADMIN(List.of("ROLE_ADMIN"));

    private final List<String> permissions;

    UserRole(List<String> permissions) {
        this.permissions = permissions;
    }

    public List<SimpleGrantedAuthority> getGrantedAuthorities() {
        return permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }
}
