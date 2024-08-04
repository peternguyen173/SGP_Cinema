package com.example.SGP.Cinema.entities.enumModel;

import java.util.Set;
import java.util.stream.Collectors;

import com.example.SGP.Cinema.permission.Permission;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;

import static com.example.SGP.Cinema.permission.Permission.*;

public enum ERole {
	ROLE_SUPER_ADMIN(
			Set.of(
					ADMIN_READ,
					ADMIN_UPDATE,
					ADMIN_DELETE,
					ADMIN_CREATE,
					MANAGER_READ,
					MANAGER_UPDATE,
					MANAGER_DELETE,
					MANAGER_CREATE
			)
	),
	ROLE_ADMIN(
			Set.of(
					ADMIN_READ,
					ADMIN_UPDATE,
					ADMIN_DELETE,
					ADMIN_CREATE,
					MANAGER_READ,
					MANAGER_UPDATE,
					MANAGER_DELETE,
					MANAGER_CREATE
			)
	),
	ROLE_USER(Collections.emptySet());

	private final Set<Permission> permissions;

	ERole(Set<Permission> permissions) {
		this.permissions = permissions;
	}

	public Set<Permission> getPermissions() {
		return this.permissions;
	}

	public List<SimpleGrantedAuthority> getAuthorities() {
		var authorities = getPermissions()
				.stream()
				.map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
				.collect(Collectors.toList());
		authorities.add(new SimpleGrantedAuthority(this.name()));
		return authorities;
	}
}
