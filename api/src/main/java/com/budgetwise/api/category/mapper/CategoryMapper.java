package com.budgetwise.api.category.mapper;

import com.budgetwise.api.category.Category;
import com.budgetwise.api.category.dto.CategoryRequest;
import com.budgetwise.api.category.dto.CategoryResponse;
import org.mapstruct.*;

import java.util.List;

import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING)
public interface CategoryMapper {

    @Mapping(target = "categoryType", source = "categoryType.name")
    CategoryResponse toDto(Category category);

    List<CategoryResponse> toDtoList(List<Category> categories);

}