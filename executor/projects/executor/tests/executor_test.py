from collections.abc import Iterator

import pytest
from algopy_testing import AlgopyTestContext, algopy_testing_context

from smart_contracts.executor.contract import ArcExecutor


@pytest.fixture()
def context() -> Iterator[AlgopyTestContext]:
    with algopy_testing_context() as ctx:
        yield ctx


def test_executor_nonce_tracking(context: AlgopyTestContext) -> None:
    """Test that nonces are initialized at 0 for unknown users."""
    contract = ArcExecutor()

    # Get initial nonce for an arbitrary user (should be 0 since not yet accessed)
    user = context.any.account()
    user_nonce = contract.get_nonce(user)
    assert user_nonce == 0
