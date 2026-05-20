from algopy import ARC4Contract, UInt64
from algopy.arc4 import abimethod


class Counter(ARC4Contract):
    def __init__(self) -> None:
        self.counter = UInt64(0)

    @abimethod()
    def increment(self) -> UInt64:
        self.counter += 1
        return self.counter

    @abimethod()
    def decrement(self) -> UInt64:
        assert self.counter > 0
        self.counter -= 1
        return self.counter

    @abimethod(readonly=True)
    def get_counter(self) -> UInt64:
        return self.counter
