import hashlib
import json
import math
import struct
from typing import Annotated, Any, Callable
from fastapi import Depends, Request
from redis import Redis


class BloomFilter:
    """
    基于 Redis 的布隆过滤器实现，用于缓存穿透防护。

    通过位数组 + 多个哈希函数判断元素是否"可能存在"，
    误判率由 error_rate 控制，但不会漏判（false positive only）。
    """

    def __init__(
        self,
        redis_conn: Redis,
        key: str = "bloom:default",
        capacity: int = 1_000_000,
        error_rate: float = 0.01,
    ) -> None:
        self.conn = redis_conn
        self.key = key
        self.capacity = capacity
        self.error_rate = error_rate
        self.memory_size = self._get_memory_bit_size()
        self.hash_count = self._get_hash_count()

    def _get_memory_bit_size(self):
        return int(-self.capacity * math.log(self.error_rate) / (0.4804530139182014))

    def _get_hash_count(self):
        return max(1, int(self.memory_size / self.capacity * 0.6931471805599453))

    def _get_hash_offset(self, item: str) -> list[int]:
        hashes = []
        for i in range(self.hash_count):
            digest = hashlib.md5(f"{item}: {i}".encode()).digest()
            hash_val = struct.unpack("<Q", digest[:8])[0]
            hashes.append(hash_val % self.memory_size)
        return hashes

    def add(self, item: str):
        for hash_val in self._get_hash_offset(item):
            self.conn.setbit(self.key, hash_val, 1)

    def add_batch(self, items: list[str]):
        pipe = self.conn.pipeline(False)
        for item in items:
            for hash_val in self._get_hash_offset(item):
                pipe.setbit(self.key, hash_val, 1)
        pipe.execute()

    def might_contain(self, item: str) -> bool:
        return all(
            self.conn.getbit(self.key, hash_val)
            for hash_val in self._get_hash_offset(item)
        )

    def clear(self):
        return self.conn.delete(self.key)

    def info(self) -> dict:
        return {
            "key": self.key,
            "capacity": self.capacity,
            "memory_size": self.memory_size,
            "error_rate": self.error_rate,
            "hash_count": self.hash_count,
        }


NULL_VALUE_HOLDER = "__NULL__"


class CachePenetration:
    def __init__(
        self,
        conn: Redis,
        bloom_key: str = "bloom:key",
        capacity: int = 1_000_000,
        error_rate: float = 0.01,
        cache_prefix: str = "cache:guard",
        ttl: int = 300,
        null_ttl: int = 10,
    ) -> None:
        self.conn = conn
        self.bloom_filter = BloomFilter(self.conn, bloom_key, capacity, error_rate)
        self.cache_prefix = cache_prefix
        self.ttl = ttl
        self.null_ttl = null_ttl
        pass

    def init_bloom_filter(self, valid_keys: list[str]):
        self.bloom_filter.add_batch(valid_keys)

    def add_valid_key(self, valid_key: str):
        self.bloom_filter.add(valid_key)

    def get_or_fetch(
        self,
        key: str,
        func: Callable[[str], (dict[str, Any] | None)],
        *args,
        serialize: Callable[[Any], str] = json.dumps,
        deserialize: Callable[[str], Any] = json.loads,
        **kwargs,
    ):
        if not self.bloom_filter.might_contain(key):
            return None

        cache_key = f"{self.cache_prefix}:{key}"

        cached = self.conn.get(cache_key)
        if cached is not None:
            if cached == NULL_VALUE_HOLDER:
                return None
            return deserialize(cached)  # type: ignore

        result = func(*args, **kwargs)

        (
            self.conn.set(cache_key, serialize(result), self.ttl)
            if result is not None
            else self.conn.set(cache_key, NULL_VALUE_HOLDER, self.null_ttl)
        )

        return result


class CachePenetrationGuard:
    """缓存穿透守卫类"""

    def __init__(
        self,
        redis_conn: Redis,
        bloom_key: str = "bloom:key",
        capacity: int = 1_000_000,
        error_rate=0.01,
        cache_prefix="cache:guard",
        ttl: int = 300,
        null_ttl: int = 60,
    ) -> None:
        self.cache_penetration_guard = CachePenetration(
            redis_conn, bloom_key, capacity, error_rate, cache_prefix, ttl, null_ttl
        )

    def get_cache_penetration_guard(self) -> CachePenetration:
        if self.cache_penetration_guard is None:
            pass
        return self.cache_penetration_guard


def get_cache_penetration_guard(request: Request) -> CachePenetration:
    """获取依赖的全局实例：缓存穿透守卫"""
    return request.app.state.cache_penetration_guard.get_cache_penetration_guard()


cache_penetration_guard_depend = Annotated[
    CachePenetration, Depends(get_cache_penetration_guard)
]
"""获取缓存穿透守卫注解"""
