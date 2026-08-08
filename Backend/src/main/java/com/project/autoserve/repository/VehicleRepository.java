package com.project.autoserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.autoserve.entity.User;
import com.project.autoserve.entity.Vehicle;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByUser(User user);

    boolean existsByVehicleNumber(String vehicleNumber);
    
    long countByUser(User user);
    
    long count();
    
    @Query("""
    	    SELECT v
    	    FROM Vehicle v
    	    WHERE v.user = :user
    	    AND (
    	        LOWER(v.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	        OR LOWER(v.model) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	        OR LOWER(v.vehicleNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	        OR LOWER(v.vehicleType) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	        OR LOWER(v.fuelType) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	    )
    	    """)
    	List<Vehicle> searchMyVehicles(
    	        @Param("user") User user,
    	        @Param("keyword") String keyword);

    	@Query("""
    	    SELECT v
    	    FROM Vehicle v
    	    WHERE
    	        LOWER(v.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	        OR LOWER(v.model) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	        OR LOWER(v.vehicleNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	        OR LOWER(v.vehicleType) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	        OR LOWER(v.fuelType) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	    """)
    	List<Vehicle> searchAllVehicles(
    	        @Param("keyword") String keyword);

}