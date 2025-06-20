package com.hartmannsdev.onlinebibliothek.utils;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UserRoleConverter implements AttributeConverter<UserRole, String> {

    @Override
    public String convertToDatabaseColumn(UserRole attribute) {
        // Envia o valor do enum diretamente como string
        return attribute == null ? null : attribute.name();
    }

    @Override
    public UserRole convertToEntityAttribute(String dbData) {
        // Converte a string do banco para o enum correspondente
        return dbData == null ? null : UserRole.valueOf(dbData);
    }
}

