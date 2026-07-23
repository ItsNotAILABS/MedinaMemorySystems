"""Base backend interface."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class DeviceBackend(ABC):
    name: str = "base"

    @abstractmethod
    def available(self) -> bool:
        ...

    @abstractmethod
    def status(self) -> dict[str, Any]:
        ...

    @abstractmethod
    def list_devices(self) -> list[dict[str, Any]]:
        ...
