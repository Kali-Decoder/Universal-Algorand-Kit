from collections.abc import Iterator

import pytest
from algopy_testing import AlgopyTestContext, algopy_testing_context

from smart_contracts.counter.contract import Counter


@pytest.fixture()
def context() -> Iterator[AlgopyTestContext]:
    with algopy_testing_context() as ctx:
        yield ctx


def test_counter_increment_decrement(context: AlgopyTestContext) -> None:
    contract = Counter()
    # initial
    assert contract.get_counter() == 0
    # increment
    assert contract.increment() == 1
    assert contract.increment() == 2
    # decrement
    assert contract.decrement() == 1
    assert contract.get_counter() == 1
