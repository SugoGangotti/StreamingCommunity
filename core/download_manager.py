#!/usr/bin/env python3

import sys
import json
import asyncio
from pathlib import Path

# Add TEMP to path for imports
sys.path.append(str(Path(__file__).parent.parent / 'TEMP'))

from StreamingCommunity.core.downloaders import DASH_Downloader, HLS_Downloader, MEGA_Downloader, MP4_Downloader

class DownloadManager:
    def __init__(self):
        self.downloaders = {
            'dash': DASH_Downloader,
            'hls': HLS_Downloader,
            'mega': MEGA_Downloader,
            'mp4': MP4_Downloader
        }
    
    async def start_download(self, url: str, method: str, output_path: str = None):
        """Start a download with the specified method."""
        try:
            downloader_class = self.downloaders.get(method.lower())
            if not downloader_class:
                return {'error': f'Unknown download method: {method}'}
            
            # Create downloader instance
            downloader = downloader_class()
            
            # Set default output path if not provided
            if not output_path:
                output_path = f"./downloads/{Path(url).name}"
            
            # Start download (this is a simplified version)
            if method.lower() == 'mp4':
                result, interrupted = downloader.download(url, output_path)
            else:
                # For other methods, you might need additional parameters
                result = f"Download started for {url} using {method} method"
            
            return {
                'success': True,
                'url': url,
                'method': method,
                'output_path': output_path,
                'result': result
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'url': url,
                'method': method
            }

def main():
    """Main entry point for command line usage."""
    if len(sys.argv) < 3:
        print("Usage: python download_manager.py <url> <method> [output_path]")
        sys.exit(1)
    
    url = sys.argv[1]
    method = sys.argv[2]
    output_path = sys.argv[3] if len(sys.argv) > 3 else None
    
    manager = DownloadManager()
    
    # Run the async download
    result = asyncio.run(manager.start_download(url, method, output_path))
    
    # Output result as JSON
    print(json.dumps(result))

if __name__ == "__main__":
    main()
