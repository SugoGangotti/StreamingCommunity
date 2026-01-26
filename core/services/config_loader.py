# 19.06.24

import os
from typing import Dict, Any

# Internal utilities
from StreamingCommunity.utils import config_manager

class site_constants:
    """Constants and configuration for site management."""
    
    @staticmethod
    def get_site_config(site_name: str) -> Dict[str, Any]:
        """Get configuration for a specific site."""
        return config_manager.config.get_dict('SITES', site_name, {})
    
    @staticmethod
    def get_global_config() -> Dict[str, Any]:
        """Get global site configuration."""
        return config_manager.config.get_dict('SITES', 'global', {})
    
    @staticmethod
    def is_site_enabled(site_name: str) -> bool:
        """Check if a site is enabled."""
        site_config = site_constants.get_site_config(site_name)
        return site_config.get('enabled', True)
    
    @staticmethod
    def get_site_timeout(site_name: str) -> int:
        """Get timeout for a specific site."""
        site_config = site_constants.get_site_config(site_name)
        return site_config.get('timeout', 30)
    
    @staticmethod
    def get_site_headers(site_name: str) -> Dict[str, str]:
        """Get custom headers for a specific site."""
        site_config = site_constants.get_site_config(site_name)
        return site_config.get('headers', {})
    
    @staticmethod
    def get_site_cookies(site_name: str) -> Dict[str, str]:
        """Get custom cookies for a specific site."""
        site_config = site_constants.get_site_config(site_name)
        return site_config.get('cookies', {})
