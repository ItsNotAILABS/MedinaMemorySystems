"""Cross-platform OS detection."""

from __future__ import annotations

import platform
import sys
from typing import Any


def get_platform_info() -> dict[str, Any]:
    system = platform.system().lower()
    return {
        "system": system,
        "release": platform.release(),
        "version": platform.version(),
        "machine": platform.machine(),
        "python": sys.version.split()[0],
        "is_windows": system == "windows",
        "is_macos": system == "darwin",
        "is_linux": system == "linux",
    }
