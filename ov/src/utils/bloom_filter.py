import hashlib
import math
import struct

from redis import Redis


class BloomFilter:
    """
    基于 Redis 的布隆过滤器实现，用于缓存穿透防护。

    通过位数组 + 多个哈希函数判断元素是否"可能存在"，
    误判率由 error_rate 控制，但不会漏判（false positive only）。
    """

    def __init__(
        self,
        redis: Redis,
        key: str = "bloom:default",
        capacity: int = 1_000_000,
        error_rate: float = 0.01,
    ) -> None:
        self.conn = redis
        self.key = key
        self.capacity = capacity  # 预期最大元素数量
        self.error_rate = error_rate  # 允许的误判率，默认 1%
        self.memory_size = self._get_memory_bit_size()  # 位数组大小（bit）
        self.hash_count = self._get_hash_count()  # 哈希函数个数

    def _get_memory_bit_size(self):
        """
        计算位数组大小。

        公式: m = -n * ln(p) / (ln 2)²
        其中 n=capacity, p=error_rate
        (ln 2)² ≈ 0.4804530139182014
        """
        return int(-self.capacity * math.log(self.error_rate) / (0.4804530139182014))

    def _get_hash_count(self):
        """
        计算最优哈希函数个数。

        公式: k = (m / n) * ln 2
        其中 m=memory_size, n=capacity, ln 2 ≈ 0.6931471805599453
        """
        return max(1, int(self.memory_size / self.capacity * 0.6931471805599453))

    def _get_hash_offset(self, item: str) -> list[int]:
        """
        通过多次 MD5 加盐生成 k 个哈希值，映射到位数组的偏移量。

        每次用不同后缀 "{item}: {i}" 做 MD5，取前 8 字节解为 uint64，
        再对 memory_size 取模得到位索引。
        """
        hashes = []
        for i in range(self.hash_count):
            digest = hashlib.md5(f"{item}: {i}".encode()).digest()
            hash_val = struct.unpack("<Q", digest[:8])[0]
            hashes.append(hash_val % self.memory_size)
        return hashes

    def add(self, item: str):
        """将单个元素加入布隆过滤器，对应位设为 1。"""
        for hash_val in self._get_hash_offset(item):
            self.conn.setbit(self.key, hash_val, 1)

    def add_batch(self, items: list[str]):
        """批量添加元素，使用 Redis pipeline 减少网络往返。"""
        pipe = self.conn.pipeline(False)
        for item in items:
            for hash_val in self._get_hash_offset(item):
                pipe.setbit(self.key, hash_val, 1)
        pipe.execute()

    def might_contain(self, item: str) -> bool:
        """
        检查元素是否可能存在。

        返回 True 表示"可能存在"（有误判），
        返回 False 表示"一定不存在"（无漏判）。
        """
        return all(
            self.conn.getbit(self.key, hash_val)
            for hash_val in self._get_hash_offset(item)
        )

    def clear(self):
        """清空布隆过滤器，删除对应的 Redis key。"""
        return self.conn.delete(self.key)

    def info(self) -> dict:
        """返回当前布隆过滤器的配置信息。"""
        return {
            "key": self.key,
            "capacity": self.capacity,
            "memory_size": self.memory_size,
            "error_rate": self.error_rate,
            "hash_count": self.hash_count,
        }


if __name__ == "__main__":
    conn =  Redis(password="redis")
    bloom_filter = BloomFilter(conn)
    test_id_1 = "12345678910"
    test_id_2 = "13547594583"
    test_id_3 = "15983779822"
    bloom_filter.add(test_id_1)
    bloom_filter.add_batch([test_id_2, test_id_3])

    error_id_1 = "10987654321"
    print(bloom_filter.might_contain(test_id_1))
    print(bloom_filter.might_contain(error_id_1))
    print(bloom_filter.info())
