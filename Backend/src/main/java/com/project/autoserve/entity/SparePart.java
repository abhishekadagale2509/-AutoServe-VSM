package com.project.autoserve.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "spare_parts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long partId;

    @NotBlank(message = "Part name is required")
    @Column(nullable = false)
    private String partName;

    @DecimalMin(value = "0.0")
    @Column(nullable = false)
    private BigDecimal unitPrice;

    @OneToMany(mappedBy = "sparePart")
    @Builder.Default
    private List<JobCardPart> jobCardParts = new ArrayList<>();

}